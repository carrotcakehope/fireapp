// 건축물대장 조회 중계 Worker
// - API 키(BLD_KEY: 공공데이터포털 Decoding 키, JUSO_KEY: 도로명주소 검색 API 승인키)는 secret으로만 보관
// - GET /search?q=주소        → 도로명주소 검색 결과(후보 목록)
// - GET /building?admCd=&bun=&ji=&mtYn=  → 표제부 첫 동 + 층별개요
// - POST /feedback  → 의견 보내기를 텔레그램으로 전달 (feedback.js)

import { handleFeedback } from "./feedback.js";

const ALLOWED_ORIGINS = [
  "https://fire-assistant.github.io",
  "https://carrotcakehope.github.io",
  "http://localhost:3900",
  "null", // 모바일미리보기.bat 등 file:// 로 연 index.html
];

const BLD_BASE = "https://apis.data.go.kr/1613000/BldRgstHubService";
const RAW_OPS = ["getBrBasisOulnInfo", "getBrRecapTitleInfo", "getBrTitleInfo", "getBrFlrOulnInfo", "getBrAtchJibunInfo", "getBrExposInfo"];
const JUSO_URL ="https://business.juso.go.kr/addrlink/addrLinkApi.do";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(request.url);
    try {
      if (url.pathname === "/feedback") {
        if (request.method !== "POST") return json({ error: "method not allowed" }, cors, 405);
        if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: "forbidden" }, cors, 403);
        const [body, status] = await handleFeedback(request, env);
        return json(body, cors, status);
      }
      if (url.pathname === "/search") return json(await searchAddress(url.searchParams.get("q"), env), cors);
      if (url.pathname === "/building") return json(await getBuilding(url.searchParams, env), cors);
      // 원인 확인용: 허용된 대장 조회를 그대로 돌려준다 (ji 생략은 noJi=1)
      if (url.pathname === "/raw") {
        const op = url.searchParams.get("op");
        if (!RAW_OPS.includes(op)) return json({ error: "op not allowed" }, cors, 400);
        return json(await callBld(op, url.searchParams, env, 100), cors);
      }
      return json({ error: "not_found" }, cors, 404);
    } catch (e) {
      return json({ error: String(e.message || e) }, cors, 502);
    }
  },
};

function json(body, cors, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}

// juso.go.kr·data.go.kr이 가끔 Cloudflare 연결을 늦게 받아 522가 난다.
// 한 번에 6초까지만 기다리고, 연결 실패·시간초과·5xx면 최대 3번까지 다시 시도한다.
async function fetchTextRetry(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const text = await res.text();
      if (res.status < 500) return text;
      lastErr = new Error(`upstream ${res.status}: ${text.slice(0, 80)}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < tries - 1) await new Promise((r) => setTimeout(r, 300 * (i + 1)));
  }
  throw lastErr;
}

async function searchAddress(q, env) {
  q = (q || "").trim();
  if (q.length < 2) return { items: [] };
  const params = new URLSearchParams({
    confmKey: env.JUSO_KEY,
    currentPage: "1",
    countPerPage: "10",
    keyword: q,
    resultType: "json",
  });
  const data = JSON.parse(await fetchTextRetry(`${JUSO_URL}?${params}`));
  const common = data?.results?.common || {};
  if (common.errorCode && common.errorCode !== "0") throw new Error(`주소검색 오류 ${common.errorCode}: ${common.errorMessage}`);
  const items = (data?.results?.juso || []).map((j) => ({
    roadAddr: j.roadAddr,
    jibunAddr: j.jibunAddr,
    bdNm: j.bdNm,
    admCd: j.admCd,
    bun: j.lnbrMnnm,
    ji: j.lnbrSlno,
    mtYn: j.mtYn,
  }));
  return { total: Number(common.totalCount || items.length), items };
}

async function callBld(op, sp, env, rows) {
  const admCd = sp.get("admCd") || "";
  if (!/^\d{10}$/.test(admCd)) throw new Error("admCd가 올바르지 않음");
  const params = new URLSearchParams({
    serviceKey: env.BLD_KEY,
    sigunguCd: admCd.slice(0, 5),
    bjdongCd: admCd.slice(5, 10),
    platGbCd: sp.get("mtYn") === "1" ? "1" : "0",
    bun: String(sp.get("bun") || "0").padStart(4, "0"),
    ji: String(sp.get("ji") || "0").padStart(4, "0"),
    numOfRows: String(rows),
    pageNo: "1",
    _type: "json",
  });
  if (sp.get("noJi") === "1") params.delete("ji");
  const text = await fetchTextRetry(`${BLD_BASE}/${op}?${params}`);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // 키 오류 등은 XML로 돌아온다
    throw new Error(`대장 API 응답 오류: ${text.slice(0, 200)}`);
  }
  const header = data?.response?.header || {};
  if (header.resultCode && header.resultCode !== "00") throw new Error(`대장 API 오류 ${header.resultCode}: ${header.resultMsg}`);
  const item = data?.response?.body?.items?.item;
  return Array.isArray(item) ? item : item ? [item] : [];
}

async function getBuilding(sp, env) {
  const [titles, floors] = await Promise.all([
    callBld("getBrTitleInfo", sp, env, 10),
    callBld("getBrFlrOulnInfo", sp, env, 100),
  ]);
  // 여러 동이면 첫 동만 (예외 처리 안 하기로 함)
  const title = titles[0] || null;
  const flrs = title ? floors.filter((f) => !f.dongNm || f.dongNm === title.dongNm) : floors;
  return { title, floors: flrs, titleCount: titles.length };
}
