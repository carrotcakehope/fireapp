// 의견 보내기 → 텔레그램 전달
// - POST /feedback (multipart/form-data)
//   category, message, contact, device(JSON 문자열), deviceId, website(봇 함정 칸, 사람은 비워둠), photo(최대 3장)
// - secret: TG_TOKEN(봇 토큰), TG_CHAT_ID(받을 대화방 번호)
// - KV: FEEDBACK_KV(하루 횟수 세기). 차단: wrangler.toml [vars] FEEDBACK_BLOCK = "기기ID,IP표식,..."

const CATEGORIES = ["버그", "불편한 점", "건의", "기타"];
const MAX_MESSAGE = 300;
const MAX_CONTACT = 100;
const MAX_CONTEXT = 2500; // 탐색기 결과 화면에서 붙이는 입력값·판정 (텔레그램 메시지 4096자 안에 들어가게)
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 앱에서 줄여 보내므로 보통 300KB 안팎
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LIMIT_DEVICE = 3;  // 기기당 하루
const LIMIT_IP = 10;     // 같은 IP 하루 (소방서처럼 여러 명이 한 IP를 쓸 수 있어 넉넉히)
const LIMIT_ALL = 30;    // 전체 하루
const DAY_TTL = 60 * 60 * 48;

export async function handleFeedback(request, env) {
  if (!env.TG_TOKEN || !env.TG_CHAT_ID || !env.FEEDBACK_KV) return [{ ok: false, error: "not_configured" }, 503];

  let form;
  try {
    form = await request.formData();
  } catch {
    return [{ ok: false, error: "invalid" }, 400];
  }

  // 봇이 모든 칸을 채우면 성공한 척만 한다
  if (String(form.get("website") || "").trim()) return [{ ok: true }, 200];

  const category = String(form.get("category") || "");
  const message = String(form.get("message") || "").trim();
  const contact = String(form.get("contact") || "").trim();
  const context = String(form.get("context") || "").trim().slice(0, MAX_CONTEXT);
  const deviceId = String(form.get("deviceId") || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16) || "unknown";
  if (!CATEGORIES.includes(category) || !message || message.length > MAX_MESSAGE || contact.length > MAX_CONTACT) {
    return [{ ok: false, error: "invalid" }, 400];
  }

  const photos = form.getAll("photo").filter((f) => f && typeof f === "object" && f.size > 0);
  if (photos.length > MAX_PHOTOS) return [{ ok: false, error: "invalid" }, 400];
  for (const p of photos) {
    if (!PHOTO_TYPES.includes(p.type) || p.size > MAX_PHOTO_BYTES) return [{ ok: false, error: "photo" }, 400];
  }

  let device = {};
  try {
    device = JSON.parse(String(form.get("device") || "{}"));
  } catch {}

  const ipTag = await shortHash(request.headers.get("CF-Connecting-IP") || "none");

  // 차단 목록이면 보낸 것처럼 응답만 하고 전달하지 않는다
  const blocked = String(env.FEEDBACK_BLOCK || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (blocked.includes(deviceId) || blocked.includes(ipTag)) return [{ ok: true }, 200];

  // 하루 횟수 (한국 날짜 기준)
  const day = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const keys = { device: `fb:${day}:d:${deviceId}`, ip: `fb:${day}:ip:${ipTag}`, all: `fb:${day}:all` };
  const [nDevice, nIp, nAll] = await Promise.all([keys.device, keys.ip, keys.all].map(async (k) => Number(await env.FEEDBACK_KV.get(k)) || 0));
  if (nDevice >= LIMIT_DEVICE || nIp >= LIMIT_IP || nAll >= LIMIT_ALL) return [{ ok: false, error: "limit" }, 429];
  await Promise.all([
    env.FEEDBACK_KV.put(keys.device, String(nDevice + 1), { expirationTtl: DAY_TTL }),
    env.FEEDBACK_KV.put(keys.ip, String(nIp + 1), { expirationTtl: DAY_TTL }),
    env.FEEDBACK_KV.put(keys.all, String(nAll + 1), { expirationTtl: DAY_TTL }),
  ]);

  const text = [
    `<b>[${esc(category)}]</b> 의견이 왔어요`,
    "",
    esc(message),
    "",
    `연락처: ${contact ? esc(contact) : "없음"}`,
    ...(context ? ["──────────", `<pre>${esc(context)}</pre>`] : []),
    "──────────",
    `기기: ${esc(clip(device.os))} / ${esc(clip(device.app))} / ${esc(clip(device.browser))}`,
    `화면 크기: ${esc(clip(device.viewport))}`,
    `보던 화면: ${esc(clip(device.screen))}${device.prevScreen ? ` (직전: ${esc(clip(device.prevScreen))})` : ""}`,
    `앱 버전: ${esc(clip(device.version))}`,
    `기기ID: <code>${deviceId}</code>  IP표식: <code>${ipTag}</code>`,
    `오늘 이 기기 ${nDevice + 1}/${LIMIT_DEVICE}, 전체 ${nAll + 1}/${LIMIT_ALL}`,
  ].join("\n");

  const sent = await tg(env, "sendMessage", { chat_id: env.TG_CHAT_ID, text, parse_mode: "HTML" });
  const replyTo = sent?.result?.message_id;

  if (photos.length === 1) {
    const fd = new FormData();
    fd.append("chat_id", env.TG_CHAT_ID);
    fd.append("photo", photos[0], "photo.jpg");
    if (replyTo) fd.append("reply_parameters", JSON.stringify({ message_id: replyTo }));
    await tg(env, "sendPhoto", fd);
  } else if (photos.length > 1) {
    const fd = new FormData();
    fd.append("chat_id", env.TG_CHAT_ID);
    fd.append("media", JSON.stringify(photos.map((_, i) => ({ type: "photo", media: `attach://p${i}` }))));
    photos.forEach((p, i) => fd.append(`p${i}`, p, `photo${i}.jpg`));
    if (replyTo) fd.append("reply_parameters", JSON.stringify({ message_id: replyTo }));
    await tg(env, "sendMediaGroup", fd);
  }

  return [{ ok: true }, 200];
}

async function tg(env, method, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`telegram ${method}: ${data.description || res.status}`);
  return data;
}

async function shortHash(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 4).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function clip(v) {
  return String(v ?? "-").slice(0, 120);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
