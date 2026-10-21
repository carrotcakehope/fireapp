// 연도별 탐색기 자동 채점
//   node tests/grade.js            채점 + 정답지 변경 확인
//   node tests/grade.js --approve  지금 정답지.md를 승인본으로 저장 (사용자가 승인했을 때만)
//
// 종료 코드: 0 = 통과 / 1 = 오답 또는 오류 / 2 = 채점은 통과했지만 정답지가 승인본과 다름
const fs = require("fs");
const path = require("path");
const { loadApp } = require("./load-app.js");

const ANSWER_FILE = path.join(__dirname, "정답지.md");
const APPROVED_FILE = path.join(__dirname, ".정답지-승인본.md");
const VALID_ANSWERS = ["설치", "설치(경과조치)", "해당 없음", "면제", "검토"];

// 정답지.md 표에서 "| 번호 | 건물 | 허가일 | 확인 설비 | 정답 | 근거 |" 줄만 읽는다
function parseAnswerSheet(text) {
  const rows = new Map();
  text.split(/\r?\n/).forEach((line) => {
    if (!line.startsWith("|")) return;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 6 || !/^[가-힣]+\d+$/.test(cells[0])) return;
    const [id, building, date, facility, answer, basis] = cells;
    rows.set(id, { id, building, date, facility, answer, basis, line: line.trim() });
  });
  return rows;
}

function makeJudge(app) {
  const base = JSON.parse(JSON.stringify(app.__yearState.answers));
  let required = null;
  let exceptions = [];
  let toast = null;
  const origRequired = app.renderSimpleRequiredList;
  const origGroup = app.renderResultGroup;
  app.renderSimpleRequiredList = function (items, target) {
    if (target === "year-required-list") required = items.map((r) => ({ name: r.name, status: r.status, reason: r.reason || "" }));
    return origRequired.apply(this, arguments);
  };
  app.renderResultGroup = function (target, items) {
    if (target === "year-exception-list") exceptions = (items || []).map((r) => ({ category: r.category, name: r.name }));
    return origGroup.apply(this, arguments);
  };
  app.showToast = (m) => { toast = m; };

  return function judge(input, facility) {
    const answers = app.__yearState.answers;
    Object.keys(answers).forEach((k) => delete answers[k]);
    Object.assign(answers, JSON.parse(JSON.stringify(base)), input);
    required = null; exceptions = []; toast = null;
    app.yearShowResults();
    if (toast) return { answer: "오류", detail: `입력 거부: ${toast}` };
    if (!required) return { answer: "오류", detail: "결과 목록이 만들어지지 않음" };
    // 시기마다 띄어쓰기가 달라("휴대용비상조명등"/"휴대용 비상조명등") 공백은 무시하고 비교
    const want = facility.replace(/\s/g, "");
    const match = (name) => name.replace(/\s/g, "").startsWith(want);
    const hit = required.find((r) => match(r.name));
    if (hit) {
      if (hit.status === "review") return { answer: "검토", detail: hit.reason };
      if (hit.status === "required") return { answer: hit.reason.includes("경과조치") ? "설치(경과조치)" : "설치", detail: hit.reason };
      return { answer: `알 수 없음(${hit.status})`, detail: hit.reason };
    }
    if (exceptions.some((e) => e.category === "설치 제외" && match(e.name))) return { answer: "면제", detail: "" };
    return { answer: "해당 없음", detail: "" };
  };
}

function diffSheets(approved, current) {
  const changes = [];
  current.forEach((row, id) => {
    const old = approved.get(id);
    if (!old) changes.push(`  + 추가  ${row.line}`);
    else if (old.line !== row.line) changes.push(`  - 이전  ${old.line}\n  + 변경  ${row.line}`);
  });
  approved.forEach((row, id) => {
    if (!current.has(id)) changes.push(`  - 삭제  ${row.line}`);
  });
  return changes;
}

function main() {
  const sheetText = fs.readFileSync(ANSWER_FILE, "utf8");
  if (process.argv.includes("--approve")) {
    fs.writeFileSync(APPROVED_FILE, sheetText, "utf8");
    console.log("  정답지 승인본을 저장했습니다.");
    return 0;
  }

  const sheet = parseAnswerSheet(sheetText);
  const inputs = require("./입력값.js");
  const judge = makeJudge(loadApp());
  const failures = [];

  sheet.forEach((row) => {
    if (!VALID_ANSWERS.includes(row.answer)) {
      failures.push(`  [${row.id}] 정답 칸 값이 잘못됨: "${row.answer}" (가능: ${VALID_ANSWERS.join(", ")})`);
      return;
    }
    const input = inputs[row.id];
    if (!input) {
      failures.push(`  [${row.id}] 입력값.js에 이 번호의 입력값이 없음`);
      return;
    }
    let got;
    try {
      got = judge(input, row.facility);
    } catch (e) {
      got = { answer: "오류", detail: e.message };
    }
    if (got.answer !== row.answer) {
      failures.push(`  [${row.id}] ${row.building} / ${row.date} / ${row.facility}\n        정답: ${row.answer}   앱: ${got.answer}${got.detail ? `\n        앱 사유: ${got.detail}` : ""}`);
    }
  });
  Object.keys(inputs).forEach((id) => {
    if (!sheet.has(id)) failures.push(`  [${id}] 입력값은 있는데 정답지에 없는 번호`);
  });

  if (failures.length) {
    console.log(`  채점 실패: ${sheet.size}개 중 ${failures.length}개 문제\n`);
    console.log(failures.join("\n"));
    return 1;
  }
  console.log(`  채점 통과: ${sheet.size}개 모두 정답`);

  const approved = fs.existsSync(APPROVED_FILE) ? parseAnswerSheet(fs.readFileSync(APPROVED_FILE, "utf8")) : new Map();
  const changes = diffSheets(approved, sheet);
  if (changes.length) {
    console.log(`\n  ⚠ 정답지가 마지막 승인 이후 바뀌었습니다 (${changes.length}건):\n`);
    console.log(changes.join("\n"));
    return 2;
  }
  return 0;
}

process.exitCode = main();
