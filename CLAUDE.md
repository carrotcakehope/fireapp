# ⚠️ 배포 구조 (절대 어기지 말 것)

- **이 앱은 원격 로드(remote-load) APK다.** `capacitor.config.json`의 `server.url`이 **반드시 있어야** 한다. APK는 번들된 파일이 아니라 이 URL(github.io)을 띄운다.
  - **현재 주소: `https://fire-assistant.github.io/app` (fire-assistant org, repo `app`).**
  - 옛 주소 `https://carrotcakehope.github.io/fireapp` 도 **병행 유지 중**(기존 설치 APK가 그 server.url로 고정돼 있어 안 끊기게). `웹배포.bat`가 `fireapp`(옛)·`appsite`(새) 양쪽에 동시 push 한다. 신규 빌드 APK는 새 주소를 본다.
- **그래서 app.js/index.html/styles.css 등 웹 코드 수정은 `웹배포.bat`만 돌리면 폰 앱에도 즉시 반영된다. APK 재설치 불필요.**
- **APK 재빌드·재설치를 시키지 말 것.** capacitor 네이티브 설정/플러그인/MainActivity를 바꿀 때만 (거의 없음). 코드 버그 수정은 무조건 웹배포로 끝.
- `server.url`이 빠지면 번들 방식이 되어 ① APK가 245MB 이미지까지 떠안아 ~283MB로 비대해지고 ② 웹배포가 앱에 안 먹혀 매번 283MB 재설치 지옥이 된다. (2026-04~05 실제로 이 일이 났었음: server.url 제거됨 → 번들 APK 설치 → 재설치 지옥. server.url 복구로 해결.)
## 뒤로가기(back) 구조와 한계 — 또 헤매지 말 것

- **원격 로드 APK에는 Capacitor 네이티브 브리지가 주입되지 않는다** (원격 페이지에서 `window.Capacitor === undefined`, `window.AndroidBack === undefined`로 확인됨, 2026-05-31). 따라서 `@capacitor/app` 의 `backButton` 리스너도, `Capacitor.Plugins.App.exitApp` 도, MainActivity가 추가하는 JS 인터페이스도 **원격 페이지에선 못 쓴다.** 네이티브 back 핸들러 시도(=며칠 날림)는 이 구조에선 무의미. 다시 시도하지 말 것.
- 그래서 뒤로가기는 **JS popstate "연료(fuel)" 모델**로만 동작한다 (app.js `initBackButton`):
  - forward(사용자 클릭)마다 `history.pushState` 로 실제 엔트리 1개 적재(클릭=제스처라 크롬 history-intervention이 안 건너뜀).
  - `popstate` 에서 `doHandleBack`로 한 단계만 복원, re-push 안 함.
  - 홈에서 더블탭 종료는 시간 기반(`_homeExitArmedAt`). 홈 클릭도 연료를 쌓아야 얕은 탐색 후에도 홈에서 토스트가 뜬다(홈 연료 스킵 금지).
- **수용된 한계(고치려 들지 말 것):** 앱 켜자마자 **아무 터치 없이 첫 뒤로가기**를 누르면 종료된다. 로드 직후엔 연료(히스토리 엔트리)가 0이라 popstate로 못 막고, 네이티브 back은 위 이유로 불가. 한 번이라도 화면을 터치(=연료 생성)하면 정상. 사용자와 합의해 이 엣지는 수용함(2026-05-31).
- 정리: 뒤로가기 코드는 popstate 모델 유지. `@capacitor/app`/네이티브 onBackPressed/registerPlugin 재시도 금지.

# 작업 원칙

- 파일 열람 권한은 이미 부여돼 있음. 재요청 금지.
- 단순 변경(CSS 한 줄, 스크롤 수정 등)에 Agent/Explore 서브에이전트 사용 금지. Grep/Glob/Read로 바로 찾을 것.
- 요청 범위만 수정. 요청하지 않은 리디자인·리팩토링·색상 변경 등 금지.
- 관련 파일을 바로 열고 해당 부분만 수정할 것.

## 탐색기 3종 (app.js에 multiuse/다중이용업소 코드 보여도 혼동 말 것)

- **소방시설 탐색기** = 홈 `open-explorer` → **연도별 탐색기**(`yearSteps[]` / `yearState`, `y` 접두사)가 유일한 소방시설 탐색기다. 자체 다중이용업소 복제본(`yMultiuse*`, `yLodgingMultiuse*`) 보유.
- **간단 버전 탐색기는 2026-10에 폐기됨** (판정 함수 `evaluate*Facility` 등 삭제). 되살리거나 "간단 버전도 고치자"고 제안하지 말 것.
- **다중이용업소 안전시설 탐색** = multiuse-only 모드, `multiuseSteps[]` 사용. 옛 간단 버전과 같은 화면(`screen-explorer`)과 `steps[]`/`state`/`getActiveSteps()` 엔진을 공유하므로 그 엔진은 지우면 안 됨.
- 즉 "소방시설 탐색기" 작업 시 `yearSteps`/`yearEvaluate*` 쪽만 보면 됨.

## 정답지 자동 채점 (2026-10-21 도입)

- `tests/정답지.md` = 사용자가 확정한 연도별 탐색기 판정 목록. `tests/입력값.js` = 각 번호의 입력값. `node tests/grade.js`로 채점하며, `웹배포.bat`이 배포 전에 자동 실행한다(오답이면 배포 중단, 정답지가 승인본 `tests/.정답지-승인본.md`와 다르면 바뀐 줄을 보여주고 Y/N 승인).
- **`정답지.md`와 `.정답지-승인본.md`는 사용자 승인 없이 수정 금지.** 고쳐야 하면 바뀌는 줄과 근거(법령·부칙)를 먼저 보여주고 승인받을 것. 승인본은 사용자가 배포 때 Y를 눌러 갱신하는 것이 원칙이고, 직접 `--approve`를 실행하지 말 것.
- 채점이 실패하면 정답지가 아니라 **app.js를 먼저 의심**할 것. 채점을 통과시키려고 `입력값.js`를 바꾸지 말 것(입력값은 정답지의 "건물" 칸 설명과 일치해야 함).
- 날짜·판정을 새로 고치면 그 경계(시행일 전날/당일) 케이스를 정답지에 추가 제안할 것.
