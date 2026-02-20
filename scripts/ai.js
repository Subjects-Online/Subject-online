/* =====================================================
   ai.js — Gemini AI Chat Assistant
   API key is stored in localStorage by the Admin Panel
   ===================================================== */

const AI_KEY_STORE = "so_gemini_key";
const GEMINI_BASE = "https://generativelanguage.googleapis.com";

// Try these in order as fallback if dynamic detection fails
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
];

/* ── Auto-detect available models ────────────────── */
async function getAvailableModel(key) {
  try {
    const r = await fetch(`${GEMINI_BASE}/v1beta/models?key=${key}`);
    const d = await r.json();
    if (d.models) {
      const m = d.models.find(
        (m) =>
          m.supportedGenerationMethods?.includes("generateContent") &&
          m.name.includes("gemini"),
      );
      if (m) return m.name.replace("models/", "");
    }
  } catch (_) {}
  return null;
}

/* ── Conversation state ─────────────────────────── */
let _aiHistory = [];
let _currentKey = "";
let _currentModel = "";
let _systemCtx = "";

/* ── Build the AI Chat panel (once) ─────────────── */
function buildAIOverlay() {
  if (document.getElementById("ai-explain-overlay")) return;
  const div = document.createElement("div");
  div.id = "ai-explain-overlay";
  div.innerHTML = `
    <div class="ai-backdrop" onclick="closeAIExplain()"></div>
    <div class="ai-panel">
      <div class="ai-topbar">
        <div class="ai-topbar-left">
          <span class="ai-robot-icon">🤖</span>
          <div class="ai-titles">
            <div class="ai-subject-lbl" id="ai-subject-lbl"></div>
            <div class="ai-lecture-lbl" id="ai-lecture-lbl"></div>
          </div>
        </div>
        <button class="ai-close-btn" onclick="closeAIExplain()" title="Close">✕</button>
      </div>
      <div class="ai-body" id="ai-body"></div>
      <div class="ai-input-bar">
        <input type="text" class="ai-chat-input" id="ai-chat-input"
               placeholder="اسأل سؤال…" autocomplete="off"/>
        <button class="ai-send-btn" id="ai-send-btn" onclick="aiSendMessage()" title="Send">➤</button>
      </div>
    </div>`;
  document.body.appendChild(div);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAIExplain();
  });
  document.getElementById("ai-chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      aiSendMessage();
    }
  });
}

window.closeAIExplain = function () {
  const ov = document.getElementById("ai-explain-overlay");
  if (ov) ov.classList.remove("open");
  document.body.style.overflow = "";
};

/* ── Append a bubble to the chat body ─────────────── */
function appendBubble(role, html, isLoading) {
  const body = document.getElementById("ai-body");
  const wrap = document.createElement("div");
  wrap.className = `ai-bubble-wrap ${role}`;
  wrap.innerHTML =
    role === "user"
      ? `<div class="ai-bubble user-bubble">${html}</div>`
      : `<div class="ai-bubble ai-bubble-msg">${isLoading ? '<div class="ai-typing"><span></span><span></span><span></span></div>' : html}</div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
  return wrap;
}

/* ── Call Gemini with full history ────────────────── */
async function callGemini(contents) {
  const key = _currentKey;
  const body = JSON.stringify({
    contents,
    generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
  });

  if (!_currentModel) {
    _currentModel = (await getAvailableModel(key)) || GEMINI_FALLBACK_MODELS[0];
  }

  const modelsToTry = [
    _currentModel,
    ...GEMINI_FALLBACK_MODELS.filter((m) => m !== _currentModel),
  ];

  for (const model of modelsToTry) {
    for (const ver of ["v1beta", "v1"]) {
      try {
        const url = `${GEMINI_BASE}/${ver}/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const data = await res.json();
        if (!res.ok) {
          console.warn(`[AI] ${model} (${ver}):`, data?.error?.message);
          continue;
        }
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          _currentModel = model;
          return text;
        }
      } catch (e) {
        console.warn(`[AI] ${model} (${ver}) fetch error:`, e.message);
      }
    }
  }
  console.error("[AI] All models failed.");
  return null;
}

/* ── Open / init the AI chat for a lecture ────────── */
window.openAIExplain = async function (lectureTitle, subjectName) {
  const key = localStorage.getItem(AI_KEY_STORE);
  if (!key) {
    if (window.showToast)
      showToast("مفيش API Key — افتح Admin Panel وحطه أولاً 🔑", "warning");
    return;
  }
  _currentKey = key;
  _aiHistory = [];
  // System context injected into the FIRST user message only
  _systemCtx = `أنت مساعد دراسي بتتكلم بالعامية المصرية البسيطة. الطالب بيدرس مادة "${subjectName}" والموضوع هو "${lectureTitle}". رد بشكل مختصر وواضح وبالعامية.`;

  buildAIOverlay();
  document.getElementById("ai-subject-lbl").textContent =
    subjectName || "Subject";
  document.getElementById("ai-lecture-lbl").textContent =
    lectureTitle || "Lecture";
  document.getElementById("ai-body").innerHTML = "";
  document.getElementById("ai-chat-input").value = "";

  appendBubble(
    "ai",
    `أهلاً! 👋 اسألني عن <strong>${lectureTitle}</strong> أو قولي "اشرحلي" وأنا أشرحهولك بالعامية. 😊`,
  );

  document.body.style.overflow = "hidden";
  requestAnimationFrame(() =>
    document.getElementById("ai-explain-overlay").classList.add("open"),
  );
  setTimeout(() => document.getElementById("ai-chat-input").focus(), 400);
};

/* ── Send follow-up message ───────────────────────── */
window.aiSendMessage = async function () {
  const input = document.getElementById("ai-chat-input");
  const text = input.value.trim();
  if (!text || !_currentKey) return;
  input.value = "";

  appendBubble("user", text);

  // First message: prepend system context
  const msgText =
    _aiHistory.length === 0 ? `${_systemCtx}\n\nسؤال الطالب: ${text}` : text;
  _aiHistory.push({ role: "user", parts: [{ text: msgText }] });

  const loadingBubble = appendBubble("ai", "", true);
  const aiText = await callGemini(_aiHistory);
  loadingBubble.remove();

  if (aiText) {
    _aiHistory.push({ role: "model", parts: [{ text: aiText }] });
    appendBubble("ai", formatAIText(aiText));
  } else {
    appendBubble(
      "ai",
      '<div class="ai-error">❌ مش قادر يرد — جرب تاني أو غير الـ API key</div>',
    );
  }
  input.focus();
};

/* ── Simple markdown formatter ────────────────────── */
function formatAIText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^#{1,3}\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .trim()
    .replace(/^(?!<)/, "<p>")
    .replace(/(?<!>)$/, "</p>");
}
