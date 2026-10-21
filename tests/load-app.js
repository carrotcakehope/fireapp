// app.js를 node에서 불러오기 위한 최소 환경.
// 브라우저 객체(document, window 등)는 무엇을 물어도 자기 자신을 돌려주는 가짜 객체로 대신한다.
// 판정 함수(yearEvaluate* 등)는 화면과 무관하게 계산만 하므로 이걸로 충분하다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function makeStub() {
  const fn = function () {};
  const handler = {
    get(target, prop) {
      if (prop === Symbol.toPrimitive) return () => "";
      if (prop === Symbol.iterator) return function* () {};
      if (prop === "then") return undefined; // Promise로 오인되지 않게
      if (prop === "length") return 0;
      if (prop in target) return target[prop];
      return stub;
    },
    set(target, prop, value) { target[prop] = value; return true; },
    apply() { return stub; },
    construct() { return stub; },
  };
  const stub = new Proxy(fn, handler);
  return stub;
}

function loadApp(appPath = path.join(__dirname, "..", "app.js")) {
  const code = fs.readFileSync(appPath, "utf8");
  const stub = makeStub();
  const storage = { getItem: () => null, setItem() {}, removeItem() {}, clear() {} };
  const sandbox = {
    console: { log() {}, info() {}, warn() {}, error() {}, debug() {} },
    document: stub,
    navigator: stub,
    location: stub,
    history: stub,
    screen: stub,
    localStorage: storage,
    sessionStorage: storage,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    fetch: () => new Promise(() => {}),
    matchMedia: () => stub,
    getComputedStyle: () => stub,
    addEventListener() {}, removeEventListener() {},
    alert() {}, confirm: () => false,
    scrollTo() {}, scrollBy() {}, open() {}, print() {}, dispatchEvent() {},
    innerWidth: 400, innerHeight: 800, devicePixelRatio: 1, scrollY: 0, pageYOffset: 0,
    performance: { now: () => 0 },
    MutationObserver: function () { return stub; },
    IntersectionObserver: function () { return stub; },
    ResizeObserver: function () { return stub; },
    Image: function () { return stub; },
    URL, URLSearchParams, TextEncoder, TextDecoder, Blob, atob, btoa,
    HTMLElement: function () {}, Element: function () {}, Node: function () {}, Event: function () {}, CustomEvent: function () {},
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "app.js" });
  // 자식 스크립트가 아니라 app.js 안의 const(yearState 등)는 전역 속성이 아니므로 꺼내 둔다
  vm.runInContext("globalThis.__yearState = yearState;", sandbox);
  return sandbox;
}

module.exports = { loadApp };
