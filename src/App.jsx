import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import {
  Home, CalendarDays, Mail, User, Settings, Plus, X, Check,
  Camera, RotateCw, Lock, Sparkles, ChevronLeft, ChevronRight, Trash2,
  Volume2, VolumeX, GripVertical,
} from "lucide-react";
import * as Tone from "tone";

/* ---------------------------------------------------------------
   洞見卡牌組
---------------------------------------------------------------- */
const CARD_DECK = [
  { word: "留白", meaning: "今天不必把行程排滿。留一段空白給自己呼吸，答案常在鬆手後出現。" },
  { word: "誠實", meaning: "對自己誠實一次，勝過對別人客氣一百次。今天說一句真話。" },
  { word: "重來", meaning: "昨天沒做好的事，今天可以重新開始。過程本來就允許修正。" },
  { word: "邊界", meaning: "說不，也是一種完整。今天練習溫柔而堅定地畫出界線。" },
  { word: "慢下來", meaning: "速度不是唯一的美德。今天試著把一件事，做得比平常慢一點。" },
  { word: "感謝", meaning: "找一件微小的事，具體說出「謝謝」。感謝會回頭餵養你自己。" },
  { word: "放手", meaning: "不是所有的線都要握緊。今天，練習放開一件不屬於你的事。" },
  { word: "勇敢", meaning: "勇敢不是不害怕，而是帶著害怕，仍然往前走一步。" },
  { word: "專注", meaning: "今天選一件最重要的事，其他都先放到明天。" },
  { word: "溫柔", meaning: "先對自己溫柔，才有餘裕對別人溫柔。今天善待自己一次。" },
  { word: "整理", meaning: "外在的整理，是內在的隱喻。整理一個小角落，心也會跟著清爽。" },
  { word: "傾聽", meaning: "今天多聽一分鐘，少說一分鐘。答案往往藏在別人的話裡。" },
  { word: "初心", meaning: "回想當初為什麼開始。初心會提醒你，此刻在往哪裡走。" },
  { word: "休息", meaning: "休息不是懶惰，是為了走更長遠的路。今天允許自己停下來。" },
  { word: "選擇", meaning: "你今天的每個選擇，都是在對未來的自己投票。" },
  { word: "接納", meaning: "先接納現在的樣子，改變才有落腳的地方。" },
  { word: "行動", meaning: "想法不會自己發生，今天把一個念頭變成一個小小的動作。" },
  { word: "獨處", meaning: "留一點時間給自己，不解釋、不迎合，只是單純地待著。" },
  { word: "耐心", meaning: "有些事急不來。今天對正在發生的事，多一點耐心。" },
  { word: "分享", meaning: "把心裡的感受說給一個信任的人聽，重量會因此減半。" },
  { word: "覺察", meaning: "留意今天讓你情緒波動的瞬間，那裡藏著你真正在意的事。" },
  { word: "簡單", meaning: "今天試著把一件複雜的事，拆成最簡單的一步。" },
  { word: "信任", meaning: "信任自己已經做的準備，然後放心地往前走。" },
  { word: "喜悅", meaning: "找一件會讓你嘴角上揚的小事，今天就去做。" },
  { word: "誠懇", meaning: "不必完美，只要誠懇。今天用最真實的樣子面對一件事。" },
  { word: "呼吸", meaning: "感到緊繃的時候，先深呼吸三次。身體放鬆了，心才有空間思考。" },
  { word: "餘裕", meaning: "不用把每一分鐘都填滿，留一點餘裕，才接得住突發的狀況。" },
  { word: "誠實面對", meaning: "有些逃避是為了保護自己，但今天試著誠實面對一件拖延已久的事。" },
  { word: "小步前進", meaning: "不必一次到位，今天走一小步，比原地想一百次更有用。" },
  { word: "自我肯定", meaning: "今天找一件自己做得不錯的事，大方地肯定自己。" },
  { word: "界線感", meaning: "溫柔地拒絕，也是在保護你在乎的關係。今天練習說出真實的限度。" },
  { word: "放輕鬆", meaning: "不是所有事都需要用力，今天試著放鬆肩膀，也放鬆心情。" },
  { word: "觀察者", meaning: "今天試著退後一步，用觀察者的角度看自己的情緒，而不是被捲進去。" },
  { word: "允許休息", meaning: "休息不需要理由。今天允許自己不做任何事，也是一種完整。" },
  { word: "微小改變", meaning: "巨大的改變常常從一個微小的習慣開始，今天可以是那一天。" },
  { word: "重新定義", meaning: "失敗不是終點，而是重新定義下一步的機會。" },
  { word: "專屬時刻", meaning: "今天留一段只屬於自己的時刻，不被打擾，也不必分享。" },
  { word: "情緒空間", meaning: "情緒來的時候，先給它一點空間，不急著壓下去或解決它。" },
  { word: "自我對話", meaning: "留意今天你怎麼跟自己說話，試著換成更溫柔的語氣。" },
  { word: "剛剛好", meaning: "不用做到最好，剛剛好也是一種完成。" },
  { word: "誠實表達", meaning: "把心裡真正的想法說出來，而不是說對方想聽的話。" },
  { word: "值得被愛", meaning: "提醒自己，不需要做到什麼，也一樣值得被愛。" },
  { word: "放慢腳步", meaning: "今天走路、吃飯、說話都試著慢一點，感受當下的細節。" },
  { word: "允許不完美", meaning: "允許今天的自己不完美，那也是真實的一部分。" },
  { word: "回到當下", meaning: "心思飄走的時候，輕輕把注意力帶回這一刻正在做的事。" },
  { word: "誠實需求", meaning: "問問自己，此刻真正需要的是什麼，而不是應該要什麼。" },
  { word: "有意識選擇", meaning: "今天的每個決定，試著多想一秒鐘，帶著覺察去選擇。" },
  { word: "自我照顧", meaning: "身體和心都需要照顧，今天做一件單純為了自己好的事。" },
  { word: "允許求助", meaning: "獨自扛著不是唯一的辦法，今天練習開口請別人幫忙。" },
  { word: "感受連結", meaning: "今天花點時間，好好感受一段對你重要的關係。" },
  { word: "放下比較", meaning: "你的節奏不需要跟別人一樣。今天練習不跟別人比較。" },
  { word: "溫柔堅持", meaning: "堅持一件對的事，不需要用力對抗，也可以溫柔而穩定。" },
  { word: "看見進步", meaning: "回頭看看，你已經比一個月前的自己前進了多少。" },
];

/* ---------------------------------------------------------------
   工具函式
---------------------------------------------------------------- */
const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => fmtDate(new Date());
const weekdayCN = ["日", "一", "二", "三", "四", "五", "六"];
// 心情：改用角色表情圖示（key 對應 FACE）
const moods = ["happy", "smile", "cheer", "calm", "thanks", "surprise", "think", "night", "tired", "sad"];
const MOOD_LABEL = {
  happy: "開心", smile: "微笑", cheer: "加油", calm: "安心", thanks: "感謝",
  surprise: "驚喜", think: "思考", night: "晚安", tired: "疲憊", sad: "難過",
};
const MOOD_WEIGHTS = {
  happy: 4, smile: 3, cheer: 2, calm: 2, thanks: 2,
  surprise: 1, think: 0, night: 1, tired: -1, sad: -3,
  // 舊版 emoji 紀錄仍可正確計分
  "🙂": 3, "😌": 2, "😢": -3, "😤": -2, "😴": -1, "🤍": 2, "🔥": 4,
};

function moodWeight(mood) {
  return mood ? (MOOD_WEIGHTS[mood] || 0) : 0;
}

// 最終日分數 = 自評分數 + 轉盤加減分 + 心情權重
function computeFinalScore(r) {
  if (!r || r.score === undefined || r.score === null || r.score === "") return null;
  const base = Number(r.score);
  const wheelAdj = r.scoreAdjust || 0;
  const moodAdj = moodWeight(r.mood);
  return base + wheelAdj + moodAdj;
}

// 依今日分數決定角色狀態：發光／有點疲倦／坐著休息
// 依時間打招呼
function greetWord() {
  const h = new Date().getHours();
  if (h < 5) return "還沒睡嗎";
  if (h < 11) return "早安";
  if (h < 14) return "午安";
  if (h < 18) return "下午好";
  return "晚安";
}

function avatarStateFromScore(score) {
  if (score === null || score === undefined) return { key: "none", label: "" };
  if (score >= 90) return { key: "glow", label: "發光中" };
  if (score >= 65) return { key: "good", label: "狀態不錯" };
  if (score >= 40) return { key: "tired", label: "有點疲倦" };
  return { key: "rest", label: "需要休息" };
}

function stampForDays(days) {
  if (days <= 7) return { key: "dream", label: "夢境郵票", en: "DREAM", range: "0–7 天", tint: "#B08D57" };
  if (days <= 14) return { key: "bloom", label: "花之郵票", en: "BLOOM", range: "8–14 天", tint: "#6B6656" };
  if (days <= 30) return { key: "cloud", label: "雲之郵票", en: "CLOUD", range: "15–30 天", tint: "#3E6E8E" };
  if (days < 365) return { key: "crown", label: "皇冠郵票", en: "CROWN", range: "30 天以上", tint: "#9A7A2E" };
  return { key: "galaxy", label: "星河郵票", en: "GALAXY", range: "365 天以上", tint: "#1C1C1C" };
}

/* 郵票圖示元件 */
function StampIcon({ stamp, size = 64, square = false }) {
  const src = STAMP_IMG[stamp?.key] || STAMP_IMG.dream;
  // square：放進正方形框裡完整呈現（不裁切、不變形）
  return (
    <img
      src={src}
      alt={stamp?.label || ""}
      style={
        square
          ? { width: size, height: size, objectFit: "contain", display: "block" }
          : { width: size, height: (size * 366) / 300, display: "block" }
      }
    />
  );
}


// 成長指引：依分數區間，並回扣使用者自己填的年度目標
function scoreGuidance(score, yearGoal) {
  const goal = yearGoal && yearGoal.trim() ? yearGoal.trim() : "理想中的自己";
  if (score === null || score === undefined) return { text: "今天還沒有為自己打分。", range: "" };
  if (score < 60) return { text: `今天也許沒有走到理想的位置，但沒關係。回到最簡單的一件事，重新找回自己的節奏。`, range: "< 60" };
  if (score < 70) return { text: `你正在慢慢靠近「${goal}」。不用急，只要每天再前進一點點。`, range: "60－70" };
  if (score < 80) return { text: `穩穩地往前走，離「${goal}」又近了一些。接下來，可以開始在意每一步的品質。`, range: "70－80" };
  if (score < 90) return { text: `現在的你，已經很接近「${goal}」。保持現在的節奏，也別忘了溫柔對待自己。`, range: "80－90" };
  if (score < 100) return { text: `你正在活成自己期待的樣子。`, range: "90－100" };
  return { text: `今天的你，就是曾經想成為的自己。`, range: "100" };
}

// AI 一句話總結：依分數、完成/未完成事項、與昨天的比較，每天只生成一句溫柔的話
function aiOneLiner(record, doneList = [], missList = [], prevScore = null, dateStr = "") {
  const fs = computeFinalScore(record);
  if (fs === null) return null;
  // 以日期＋分數做種子，讓同一天固定同一句，不會每次打開都變
  const seedStr = dateStr + fs;
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
  const pick = (arr) => arr[seed % arr.length];

  const firstMiss = missList[0];
  const firstDone = doneList[0];
  const better = prevScore !== null && fs > prevScore;
  const worse = prevScore !== null && fs < prevScore;

  if (fs >= 90) {
    return pick([
      "今天的你，很靠近自己喜歡的模樣。",
      "今天值得收藏，也值得好好睡一覺。",
      "今天沒有白過，謝謝努力生活的自己。",
      better ? "比昨天更亮了一點，而且是你自己走出來的。" : "把今天的節奏記住，它會慢慢成為你的日常。",
    ]);
  }
  if (fs >= 80) {
    if (firstMiss) return pick([
      `今天比昨天更願意照顧自己了，雖然${firstMiss}沒有完成，但你沒有放棄今天。`,
      `${firstMiss}不用急，明天再完成也很好。`,
      "差一點，不代表做不到。",
    ]);
    return pick([
      "今天很好，也別忘了把這份溫柔留給明天的自己。",
      better ? "悄悄地，你比昨天又前進了一步。" : "穩穩的一天，這種日子最養人。",
      "不轟轟烈烈，但踏實——這就是生活長出來的樣子。",
      "沒有特別耀眼，但每一步都算數。",
    ]);
  }
  if (fs >= 70) {
    if (firstDone) return pick([
      `完成了${firstDone}，今天就沒有白過。`,
      `今天做到不少，${firstMiss ? `${firstMiss}先放著，` : ""}留一點力氣給明天。`,
      `${firstDone}做完的那一刻，你有沒有偷偷鬆一口氣？`,
      "今天的努力，也值得一句辛苦了。",
      "一點一點累積，就是成長。",
    ]);
    return pick([
      "今天完成不少，但也記得，休息才走得遠。",
      "還有進步空間，但方向是對的，慢慢來。",
      "今天的努力，也值得一句辛苦了。",
      "一點一點累積，就是成長。",
    ]);
  }
  if (fs >= 60) {
    return pick([
      "不要否定自己，慢慢前進就好。",
      worse ? "今天比較累了吧？累的日子，也算數。" : "普通的一天，也是往前的一天。",
      firstDone ? `至少${firstDone}做到了，這就夠當今天的句點。` : "明天再試一次，就好。",
      "有些日子是用來撐過的，你撐過了。",
      "慢一點沒有關係，你沒有停下來。",
      "每一次願意重新開始，都值得鼓勵。",
    ]);
  }
  return pick([
    "今天辛苦了，先休息，再慢慢重新開始。",
    "今天的分數，不等於今天的你。",
    "低潮的日子願意留下紀錄，這本身就是勇敢。",
    "先抱抱自己，其他的事，明天再說。",
    "有些日子，只要好好活著，就已經很棒了。",
    "明天還在，我們一起慢慢來。",
  ]);
}

// 自動生成的每日成長總結：串聯洞見卡、轉盤結果、照片與分數
// 溫暖的一日敘事：把洞見卡、轉盤、照片、心情揉成兩三句貼近生活的話，
// 最後接上 AI 的一句話收尾（合併版總結）
function buildWarmSummary(r, doneList = [], missList = [], prevScore = null, dateStr = "") {
  const fs = computeFinalScore(r);
  const parts = [];

  if (r?.insightCard) {
    parts.push(`今天的關鍵字是「${r.insightCard.word}」。`);
  }

  if (r?.wheelPick) {
    if (r.wheelStatus === "check") {
      parts.push(`答應自己的「${r.wheelPick}」，今天完成了。`);
    } else if (r.wheelStatus === "cross") {
      parts.push(`「${r.wheelPick}」今天還沒完成，就留給明天的自己吧。`);
    } else {
      parts.push(`今天想為自己做的事是「${r.wheelPick}」。`);
    }
  }

  if (doneList.length > 0 && !r?.wheelPick) {
    parts.push(`完成了${doneList.slice(0, 2).join("、")}${doneList.length > 2 ? "等幾件事" : ""}。`);
  }

  if (r?.photo) parts.push("也替今天留下一張照片。");
  if (r?.mood) parts.push(`心情停在「${MOOD_LABEL[r.mood] || r.mood}」。`);

  const line = aiOneLiner(r, doneList, missList, prevScore, dateStr);
  return { fs, facts: parts.join(""), line };
}

async function resizeImageToDataURL(file, maxW = 480) {
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxW / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

/* ---------------------------------------------------------------
   儲存 keys
---------------------------------------------------------------- */
const K_CHAR = "app-character";
const K_SETTINGS = "app-settings";
const K_TODOS = "app-todos";

/* 勾完代辦時角色偶爾冒出的小鼓勵 */
const TODO_CHEERS = [
  "又完成一件，好樣的。",
  "這一步，算你的。",
  "做到了，記得誇自己一下。",
  "一件一件來，你很穩。",
  "完成的感覺，值得收藏。",
  "今天又前進了一點點。",
  "你正在慢慢兌現對自己的承諾。",
  "小小的完成，也是完成。",
  "謝謝你沒有拖到最後。",
  "這種踏實，最養人。",
];
const K_DAILY = "app-daily";
const K_POSTCARDS = "app-postcards";
const K_LETTERS = "app-letters";     // 週回顧信已讀狀態
const K_YEARLETTER = "app-yearletter"; // 給年底的自己
const K_GENTLE = "app-gentle";       // 低潮關心明信片

/* ---------------------------------------------------------------
   照片儲存層（IndexedDB）
   照片體積大，不適合塞進 localStorage（上限僅約 5MB）。
   改存到 IndexedDB：容量大得多、照片各自獨立存取，不拖慢一般操作。
   紀錄裡只留 "idb:xxx" 參照；舊資料若直接存 base64 也仍相容。
---------------------------------------------------------------- */
const IDB_NAME = "lumi-photos";
const IDB_STORE = "photos";
let _idbPromise = null;
function idb() {
  if (_idbPromise) return _idbPromise;
  _idbPromise = new Promise((resolve) => {
    if (!("indexedDB" in window)) { resolve(null); return; }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return _idbPromise;
}
async function idbPut(id, dataUrl) {
  const db = await idb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(dataUrl, id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}
async function idbGet(id) {
  const db = await idb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const r = tx.objectStore(IDB_STORE).get(id);
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => resolve(null);
  });
}
async function idbAll() {
  const db = await idb();
  if (!db) return {};
  return new Promise((resolve) => {
    const out = {};
    const tx = db.transaction(IDB_STORE, "readonly");
    const store = tx.objectStore(IDB_STORE);
    const keysReq = store.getAllKeys();
    keysReq.onsuccess = () => {
      const keys = keysReq.result || [];
      const valsReq = store.getAll();
      valsReq.onsuccess = () => {
        const vals = valsReq.result || [];
        keys.forEach((k, i) => { out[k] = vals[i]; });
        resolve(out);
      };
      valsReq.onerror = () => resolve({});
    };
    keysReq.onerror = () => resolve({});
  });
}
async function savePhoto(dataUrl) {
  if (!dataUrl) return null;
  const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const ok = await idbPut(id, dataUrl);
  return ok ? `idb:${id}` : dataUrl;
}
function usePhoto(ref) {
  const [url, setUrl] = useState(() => (ref && ref.startsWith("idb:") ? null : ref || null));
  useEffect(() => {
    let alive = true;
    if (!ref) { setUrl(null); return; }
    if (ref.startsWith("idb:")) {
      idbGet(ref.slice(4)).then((d) => { if (alive) setUrl(d); });
    } else {
      setUrl(ref);
    }
    return () => { alive = false; };
  }, [ref]);
  return url;
}
// 通用照片元件：自動解析 idb 參照，載入前顯示淡色底
function Photo({ src, className, style, onClick }) {
  const url = usePhoto(src);
  if (!url) return <div className={className} style={{ ...style, background: "#F0EBE0" }} onClick={onClick} />;
  return <img src={url} className={className} style={style} onClick={onClick} alt="" />;
}

async function loadKey(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r !== null ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("storage error", e);
  }
}

const COVER_SRC = "data:image/jpeg;base64,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";

/* 角色表情圖示（取自設計稿） */
const FACE = {
  smile: "data:image/png;base64,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",
  think: "data:image/png;base64,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",
  happy: "data:image/png;base64,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",
  surprise: "data:image/png;base64,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",
  cheer: "data:image/png;base64,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",
  thanks: "data:image/png;base64,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",
  tired: "data:image/png;base64,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",
  sad: "data:image/png;base64,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",
  calm: "data:image/png;base64,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",
  night: "data:image/png;base64,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",
};

/* 角色每日狀態插畫（依當日分數，取自設計稿） */
const STATE_IMG = {
  glow: "data:image/png;base64,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",
  good: "data:image/png;base64,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",
  tired: "data:image/png;base64,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",
  rest: "data:image/png;base64,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",
  none: "data:image/png;base64,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",
};


/* 郵票圖示（取自設計稿） */
const STAMP_IMG = {
  dream: "data:image/png;base64,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",
  bloom: "data:image/png;base64,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",
  cloud: "data:image/png;base64,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",
  crown: "data:image/png;base64,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",
  galaxy: "data:image/png;base64,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",
};

const DEFAULT_CHARACTER = {
  name: "", motto: "", idealSelf: "", yearGoal: "",
  avatar: null, avatarPos: 50,
  onboarded: false,
};

/* ---------------------------------------------------------------
   固定角色頭像（直接使用使用者提供的手繪圖）
---------------------------------------------------------------- */
const AVATAR_SRC = "data:image/png;base64,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";

function Avatar({ size = 88, className = "", style = {} }) {
  return (
    <img
      src={AVATAR_SRC}
      alt="character avatar"
      style={{ width: size, height: size, objectFit: "cover", ...style }}
      className={`rounded-full ${className}`}
    />
  );
}

/* 成長階段頭像：依歷史平均分換框（用於明信片署名） */
/* 成長階段外框：改用向量繪製（任何尺寸都銳利），中間放高解析度的角色手稿。
   原本是從設計稿裁圖，圓圈原生只有約 250px，放大到 190px 顯示時在手機上會被放大 2 倍以上 → 糊。 */
const TIER_STYLE = {
  none:  { ring: "#D2CEC5", rw: 1.4, halo: null,      leaf: null,      sparks: 0, haloW: 0.8 },
  plain: { ring: "#ABA79B", rw: 1.7, halo: "#DAD6CC", leaf: "#BDB8A9", sparks: 0, haloW: 0.9 },
  ring:  { ring: "#4A4638", rw: 2.1, halo: "#B4AFA1", leaf: "#8C8674", sparks: 3, haloW: 1.0 },
  gold:  { ring: "#C2A05B", rw: 2.1, halo: "#DCC38A", leaf: "#C2A05B", sparks: 4, haloW: 1.0 },
  star:  { ring: "#C2A05B", rw: 2.6, halo: "#E6D09A", leaf: "#C2A05B", sparks: 6, haloW: 1.3 },
};

function TierAvatar({ tier = "none", size = 120, nudgeLeft = 0, nudgeUp = 0, pullText = 0, photo = null, photoPos = 50 }) {
  const C = TIER_STYLE[tier] || TIER_STYLE.none;
  const uid = useId().replace(/[:]/g, "");
  const CX = 54, CY = 60, R = 37;
  const src = photo || AVATAR_SRC;
  // 自訂照片時，用 photoPos(0-100) 決定上下顯示範圍；預設手繪圖維持置中
  const yShift = photo ? ((photoPos - 50) / 50) * R * 0.6 : 0;

  const sparkPts = [[14, 30], [20, 88], [98, 26], [104, 92], [8, 58], [96, 104]].slice(0, C.sparks);

  return (
    <svg
      width={size} height={size} viewBox="0 0 120 120"
      className="shrink-0" style={{ display: "block", marginLeft: -nudgeLeft, marginTop: -nudgeUp, marginRight: -pullText, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`tc-${uid}`}><circle cx={CX} cy={CY} r={R - C.rw / 2} /></clipPath>
      </defs>

      {C.halo && (
        <circle cx={CX} cy={CY} r={R + 7} fill="none" stroke={C.halo}
                strokeWidth={C.haloW} strokeDasharray="1.5 4" strokeLinecap="round" opacity="0.95" />
      )}

      <circle cx={CX} cy={CY} r={R} fill="#FFFFFF" />
      <image href={src} x={CX - R} y={CY - R - yShift} width={R * 2} height={R * 2}
             clipPath={`url(#tc-${uid})`} preserveAspectRatio="xMidYMid slice" />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.ring} strokeWidth={C.rw} />

      {C.leaf && (
        <g stroke={C.leaf} strokeWidth="1" strokeLinecap="round" fill="none">
          <path d="M76 102 Q95 97 108 70" />
          {[[86.3, 102.8, 5], [87.3, 90.9, -74], [99.5, 91.8, -15], [97.6, 79.1, -90], [109.9, 76.3, -28]].map(
            ([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx="5.4" ry="2.5"
                       transform={`rotate(${r} ${x} ${y})`}
                       fill={C.leaf} fillOpacity="0.26" />
            )
          )}
        </g>
      )}

      {sparkPts.map(([x, y], i) => (
        <path key={i}
              d={`M${x} ${y - 4.2} L${x + 1.2} ${y - 1.2} L${x + 4.2} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4.2} L${x - 1.2} ${y + 1.2} L${x - 4.2} ${y} L${x - 1.2} ${y - 1.2} Z`}
              fill={C.leaf || "#C2A05B"} opacity="0.75" />
      ))}
    </svg>
  );
}

function MoodAvatar({ score, size = 76, showLabel = true, circle = false }) {
  const state = avatarStateFromScore(score);
  // 圖已裁掉左右空白：固定「高度」讓五種狀態角色一樣大，寬度自動 → 不占多餘空間
  const img = (
    <img
      src={STATE_IMG[state.key]}
      alt={state.label}
      className={state.key === "glow" ? "state-glow" : ""}
      style={{ height: size, width: "auto", display: "block", position: "relative", zIndex: 1 }}
    />
  );
  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      {circle ? (
        <div
          className="relative flex items-center justify-center rounded-full avatar-disc"
          style={{ width: size * 1.18, height: size * 1.18 }}
        >
          {img}
        </div>
      ) : (
        img
      )}
      {showLabel && state.label && <div className="fs-10 text-mute whitespace-nowrap">{state.label}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------
   共用元件
---------------------------------------------------------------- */
function Modal({ onClose, children, width = "max-w-sm" }) {
  const downOnBackdrop = useRef(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-o40 modal-blur"
      onPointerDown={(e) => { downOnBackdrop.current = (e.target === e.currentTarget); }}
      onPointerUp={(e) => {
        const shouldClose = downOnBackdrop.current && e.target === e.currentTarget;
        downOnBackdrop.current = false;
        if (shouldClose) onClose();
      }}
    >
      <div
        className={`w-full ${width} bg-paper rounded-t-3xl sm:rounded-3xl maxh-88vh overflow-y-auto overflow-x-hidden border border-line shadow-xl box-border`}
        onPointerDown={(e) => { e.stopPropagation(); downOnBackdrop.current = false; }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="fs-11 ls-0p25 text-mute uppercase mb-2">{children}</div>;
}

function RoundIconBtn({ onClick, children, variant = "dark" }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        variant === "dark" ? "bg-ink text-white" : "bg-paper text-ink border border-line"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------
   背景音樂引擎：多種風格可切換，開啟 App 後第一次觸碰畫面即自動播放
   （瀏覽器規定聲音必須由使用者的一次觸碰啟動，無法真正「零互動」自動播）
---------------------------------------------------------------- */
const MUSIC_STYLES = [
  { key: "piano", label: "柔和鋼琴" },
  { key: "musicbox", label: "音樂盒" },
  { key: "rain", label: "雨聲鋼琴" },
  { key: "epiano", label: "溫暖電鋼琴" },
  { key: "chimes", label: "風鈴長音" },
  { key: "off", label: "關閉音樂" },
];

const musicEngine = {
  nodes: [],
  current: null,
  gen: 0,
  _chain: Promise.resolve(),
  _teardown() {
    try { Tone.Transport.stop(); } catch {}
    try { Tone.Transport.cancel(0); } catch {}
    // 先把所有節點靜音再 dispose，避免殘響尾音疊到下一軌
    this.nodes.forEach((n) => {
      try { if (n.volume) n.volume.value = -Infinity; } catch {}
    });
    this.nodes.forEach((n) => { try { n.dispose(); } catch {} });
    this.nodes = [];
    this.current = null;
  },
  // 對外：把每次切換排進同一條佇列，前一次完全結束後才會執行下一次 → 不可能疊播
  play(style) {
    const myGen = ++this.gen;
    this._chain = this._chain.then(() => this._run(style, myGen)).catch(() => {});
    return this._chain;
  },
  async _run(style, myGen) {
    // 若在排隊期間又被呼叫，這一次就作廢
    if (myGen !== this.gen) return;
    // 無論如何，先把舊的徹底清掉
    this._teardown();
    if (!style || style === "off") return;

    await Tone.start();
    if (myGen !== this.gen) { this._teardown(); return; }
    // 給瀏覽器一個微小的喘息，確保上一軌的節點真的被釋放
    await new Promise((r) => setTimeout(r, 60));
    if (myGen !== this.gen) { this._teardown(); return; }

    const reverb = new Tone.Reverb({ decay: 6, wet: 0.5 }).toDestination();
    this.nodes.push(reverb);

    if (style === "piano") {
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 1, sustain: 0.6, release: 4 },
      }).connect(reverb);
      synth.volume.value = -8;
      const chords = [["C4","E4","G4"],["A3","C4","E4"],["F3","A3","C4"],["G3","B3","D4"]];
      let i = 0;
      const loop = new Tone.Loop((t) => { synth.triggerAttackRelease(chords[i % 4], "2n", t); i++; }, "2m").start(0);
      this.nodes.push(synth, loop);
    } else if (style === "musicbox") {
      const synth = new Tone.PolySynth(Tone.MetalSynth, {
        harmonicity: 12, resonance: 800, modulationIndex: 20,
        envelope: { attack: 0.001, decay: 1.6, release: 2 },
      }).connect(reverb);
      synth.volume.value = -22;
      const notes = ["C5","E5","G5","B5","A5","G5","E5","D5"];
      let i = 0;
      const loop = new Tone.Loop((t) => { synth.triggerAttackRelease(notes[i % notes.length], "8n", t); i++; }, "4n").start(0);
      this.nodes.push(synth, loop);
    } else if (style === "rain") {
      const noise = new Tone.Noise("pink").start();
      const filter = new Tone.Filter(900, "lowpass").toDestination();
      noise.connect(filter);
      noise.volume.value = -28;
      const piano = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.5, decay: 1, sustain: 0.2, release: 3 } }).connect(reverb);
      piano.volume.value = -14;
      const notes = ["C5","E5","G4","A4","D5"];
      const loop = new Tone.Loop((t) => {
        if (Math.random() < 0.5) piano.triggerAttackRelease(notes[Math.floor(Math.random()*notes.length)], "2n", t);
      }, "1m").start(0);
      this.nodes.push(noise, filter, piano, loop);
    } else if (style === "epiano") {
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 2, modulationIndex: 1.2,
        envelope: { attack: 0.02, decay: 1.4, sustain: 0.3, release: 2.5 },
        modulationEnvelope: { attack: 0.01, decay: 0.6, sustain: 0.2, release: 1.5 },
      }).connect(reverb);
      synth.volume.value = -14;
      const chords = [["E3","G3","B3","D4"],["A3","C4","E4","G4"],["D3","F3","A3","C4"],["G3","B3","D4","F4"]];
      let i = 0;
      const loop = new Tone.Loop((t) => { synth.triggerAttackRelease(chords[i % 4], "1m", t); i++; }, "2m").start(0);
      this.nodes.push(synth, loop);
    } else if (style === "chimes") {
      const pad = new Tone.PolySynth(Tone.AMSynth, {
        envelope: { attack: 4, decay: 2, sustain: 0.8, release: 6 },
      }).connect(reverb);
      pad.volume.value = -20;
      const padLoop = new Tone.Loop((t) => { pad.triggerAttackRelease(["C3","G3","E4"], "2m", t); }, "2m").start(0);
      const bell = new Tone.MetalSynth({ resonance: 900, envelope: { attack: 0.001, decay: 2.5, release: 3 } }).connect(reverb);
      bell.volume.value = -24;
      const bellLoop = new Tone.Loop((t) => {
        if (Math.random() < 0.4) bell.triggerAttackRelease(["G5","B5","D6"][Math.floor(Math.random()*3)], "4n", t);
      }, "2n").start(0);
      this.nodes.push(pad, padLoop, bell, bellLoop);
    }
    // 建好節點後再檢查一次，若已被新的呼叫取代就拆掉，不要播
    if (myGen !== this.gen) { this._teardown(); return; }
    Tone.Transport.start();
    this.current = style;
  },
};

/* 第一次觸碰畫面時自動開始播放（瀏覽器音訊政策要求） */
function useAutoMusic(style) {
  const started = useRef(false);
  const styleRef = useRef(style);
  useEffect(() => { styleRef.current = style; }, [style]);
  useEffect(() => {
    const unlock = () => {
      if (started.current) return;
      started.current = true;
      musicEngine.play(styleRef.current); // 用最新的風格，而非掛載當下的舊值
    };
    // 各種第一手勢都嘗試解鎖，讓「一進 app 就有音樂」更容易觸發
    const opts = { once: false };
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("touchstart", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
  useEffect(() => {
    if (started.current) musicEngine.play(style);
  }, [style]);
}

/* ---------------------------------------------------------------
   滾軸選天數（模擬轉盤式滾輪選擇器）
---------------------------------------------------------------- */
function DayRoller({ value, onChange, max = 60 }) {
  const itemHeight = 36;
  const height = 144;
  const padding = (height - itemHeight) / 2;
  const ref = useRef(null);
  const timerRef = useRef(null);
  const items = Array.from({ length: max + 1 }, (_, i) => i);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = value * itemHeight;
    // eslint-disable-next-line
  }, []);

  const handleScroll = () => {
    if (!ref.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const idx = Math.round(ref.current.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(max, idx));
      onChange(clamped);
      ref.current.scrollTo({ top: clamped * itemHeight, behavior: "smooth" });
    }, 120);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 border-y border-ink-o25 bg-ink-o5 z-10 rounded" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 fade-top z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 fade-bottom z-10" />
      <div ref={ref} onScroll={handleScroll} className="no-scrollbar overflow-y-auto" style={{ height, scrollSnapType: "y mandatory" }}>
        <div style={{ height: padding }} />
        {items.map((n) => (
          <div
            key={n}
            style={{ height: itemHeight, scrollSnapAlign: "center" }}
            className={`flex items-center justify-center text-lg transition-colors ${n === value ? "text-ink font-semibold" : "text-line3"}`}
          >
            {n === 0 ? "今天" : `${n} 天`}
          </div>
        ))}
        <div style={{ height: padding }} />
      </div>
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&family=Noto+Sans+TC:wght@400;500;600&display=swap');
      .font-sans { font-family: 'Noto Sans TC', sans-serif; }
      .font-serif { font-family: 'Noto Serif TC', serif; }
      /* 手寫感改由字距與行高營造，字體統一用 Noto Sans TC，避免中日字體混排跑版 */
      .font-hand { font-family: 'Noto Sans TC', sans-serif; letter-spacing: 0.06em; }
      button { transition: transform 0.15s ease, opacity 0.15s ease; }
      button:active { transform: scale(0.96); }
      .page-fade { animation: pageFade 0.35s ease; }
      @keyframes pageFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .wheel-zoom { animation: wheelZoom 0.5s cubic-bezier(.2,.9,.3,1.15); }
      @keyframes wheelZoom { from { transform: scale(0.55); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .splash-fade { animation: splashFade 2.6s ease forwards; }
      .cheer-pop { animation: cheerPop 2.6s ease forwards; will-change: transform, opacity; }
      @keyframes cheerPop {
        0% { transform: translateY(14px) scale(.92); opacity: 0; }
        12% { transform: translateY(0) scale(1); opacity: 1; }
        85% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-6px) scale(.98); opacity: 0; }
      }
      @keyframes splashFade { 0% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }
      .stamp-drop { animation: stampDrop .8s cubic-bezier(.25,.9,.3,1.2) forwards; will-change: transform, opacity; backface-visibility: hidden; }
      @keyframes stampDrop {
        0% { transform: translate3d(0,-120px,0) scale(2.1) rotate(-14deg); opacity: 0; }
        55% { transform: translate3d(0,0,0) scale(1.06) rotate(3deg); opacity: 1; }
        72% { transform: translate3d(0,0,0) scale(.97) rotate(-1deg); }
        100% { transform: translate3d(0,0,0) scale(1) rotate(2deg); }
      }
      .ink-press { animation: inkPress .55s cubic-bezier(.2,.9,.3,1.05) 1.05s backwards; will-change: transform, opacity; backface-visibility: hidden; transform: translateZ(0); }
      @keyframes inkPress {
        0% { transform: translateZ(0) scale(1.45) rotate(-17deg); opacity: 0; }
        65% { transform: translateZ(0) scale(.98) rotate(-11deg); opacity: .92; }
        100% { transform: translateZ(0) scale(1) rotate(-12deg); opacity: 1; }
      }
      /* 郵票貼上時，明信片被「咚」一下震到 */
      .card-thud { animation: cardThud .5s cubic-bezier(.3,.8,.4,1) .55s; will-change: transform; }
      @keyframes cardThud {
        0%, 100% { transform: none; }
        30% { transform: translateY(3px) scale(.994); }
        60% { transform: translateY(-1px); }
      }
      /* 整張明信片飛進雲裡 */
      .card-fly { animation: cardFly 2s cubic-bezier(.42,0,.62,.35) .3s forwards; will-change: transform, opacity; }
      @keyframes cardFly {
        0% { transform: translate3d(0,0,0) scale(1) rotate(0deg); opacity: 1; }
        14% { transform: translate3d(0,16px,0) scale(.985) rotate(-1.5deg); opacity: 1; }
        30% { transform: translate3d(0,-10px,0) scale(1) rotate(1deg); opacity: 1; }
        70% { transform: translate3d(0,-230px,0) scale(.6) rotate(5deg); opacity: .85; }
        100% { transform: translate3d(0,-620px,0) scale(.24) rotate(8deg); opacity: 0; }
      }
      .flipcard { perspective: 1200px; }
      .flipcard-inner { transition: transform 0.7s cubic-bezier(.4,.2,.2,1); transform-style: preserve-3d; }
      .flipped { transform: rotateY(180deg); }
      .face { backface-visibility: hidden; }
      .face-back { transform: rotateY(180deg); }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      /* 拖曳代辦期間，全頁停用文字選取與長按選單 */
      body.dragging-todo, body.dragging-todo * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      .todo-grip {
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }
      .paper-grain {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E");
      }
      /* 背景點綴：靜態閃爍 + 飄落小星 */
      .deco-twinkle { animation: decoTwinkle ease-in-out infinite; will-change: opacity, transform; }
      @keyframes decoTwinkle {
        0%, 100% { opacity: .16; transform: scale(.82); }
        50% { opacity: .5; transform: scale(1.08); }
      }
      .deco-fall { animation: decoFall linear infinite; will-change: transform, opacity; }
      @keyframes decoFall {
        0% { transform: translate3d(0,-24px,0) rotate(0deg); opacity: 0; }
        12% { opacity: .42; }
        88% { opacity: .42; }
        100% { transform: translate3d(0,105vh,0) rotate(40deg); opacity: 0; }
      }
      /* 寄出動畫的雲層 */
      .cloud-l { animation: cloudL linear infinite; will-change: transform; }
      @keyframes cloudL { from { transform: translate3d(0,0,0);} to { transform: translate3d(-46vw,0,0);} }
      .cloud-r { animation: cloudR linear infinite; will-change: transform; }
      @keyframes cloudR { from { transform: translate3d(0,0,0);} to { transform: translate3d(46vw,0,0);} }
      .cloud-rise { animation: cloudRise 1.9s cubic-bezier(.22,.68,.3,1) forwards; will-change: transform, opacity; }
      @keyframes cloudRise { from { transform: translate3d(0,90px,0); opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }

      /* ---- 顏色（改用固定 CSS class，避免任意數值 class 在部分預覽環境不生效） ---- */
      .bg-ink{background-color:#1C1C1C} .text-ink{color:#1C1C1C} .border-ink{border-color:#1C1C1C}
      .bg-line{background-color:#E3DFD4} .text-line{color:#E3DFD4} .border-line{border-color:#E3DFD4}
      .bg-mute{background-color:#9C9686} .text-mute{color:#9C9686} .border-mute{border-color:#9C9686}
      .bg-paper{background-color:#FAF8F4} .text-paper{color:#FAF8F4} .border-paper{border-color:#FAF8F4}
      .bg-mute2{background-color:#B4AFA1} .text-mute2{color:#B4AFA1} .border-mute2{border-color:#B4AFA1}
      .bg-line2{background-color:#D8D5CE} .text-line2{color:#D8D5CE} .border-line2{border-color:#D8D5CE}
      .bg-line3{background-color:#C9C3B4} .text-line3{color:#C9C3B4} .border-line3{border-color:#C9C3B4}
      .bg-tan{background-color:#EDE7D9} .text-tan{color:#EDE7D9} .border-tan{border-color:#EDE7D9}
      .bg-brown{background-color:#6B6656} .text-brown{color:#6B6656} .border-brown{border-color:#6B6656}
      .bg-brown2{background-color:#4A4638} .text-brown2{color:#4A4638} .border-brown2{border-color:#4A4638}
      .bg-gold{background-color:#B08D57} .text-gold{color:#B08D57} .border-gold{border-color:#B08D57}
      .bg-cream{background-color:#FEFCF7} .text-cream{color:#FEFCF7} .border-cream{border-color:#FEFCF7}
      .text-main{color:#242220}

      .bg-ink-o85{background-color:rgba(28,28,28,0.85)}
      .bg-ink-o5{background-color:rgba(28,28,28,0.05)}
      .border-ink-o25{border-color:rgba(28,28,28,0.25)}
      .bg-black-o40{background-color:rgba(0,0,0,0.40)}
      .bg-black-o50{background-color:rgba(0,0,0,0.50)}
      .bg-white-solid{background-color:#ffffff}
      .bg-white-o50{background-color:rgba(255,255,255,0.5)}
      .modal-blur{backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);}

      .app-bg-gradient{background:linear-gradient(to bottom, #FBF7EC, #F6F1E6 50%, #E9E4D6);}
      .fade-top{background:linear-gradient(to bottom, #FAF8F4, rgba(250,248,244,0));}
      .fade-bottom{background:linear-gradient(to top, #FAF8F4, rgba(250,248,244,0));}


      .state-glow { animation: stateGlow 2.6s ease-in-out infinite; }
      @keyframes stateGlow {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(176,141,87,0.30)); }
        50% { filter: drop-shadow(0 0 12px rgba(176,141,87,0.62)); }
      }
      /* 首頁角色的圓形白底 */
      .avatar-disc {
        background: rgba(255,255,255,0.88);
        border: 1px solid #1C1C1C;
      }

      .fs-10{font-size:10px} .fs-11{font-size:11px} .fs-7{font-size:7px} .fs-12{font-size:12px}
      .fs-15{font-size:15px} .fs-13{font-size:13px} .fs-8{font-size:8px} .fs-9{font-size:9px}
      .fs-12p5{font-size:12.5px}
      .ls-0p25{letter-spacing:0.25em} .ls-0p15{letter-spacing:0.15em} .ls-0p2{letter-spacing:0.2em} .ls-0p3{letter-spacing:0.3em}
      .maxh-88vh{max-height:88vh}
      .rounded-4{border-radius:4px}
      .divide-line > * + *{border-color:#E3DFD4}
      .accent-ink{accent-color:#1C1C1C}
    `}</style>
  );
}

/* ---------------------------------------------------------------
   航空信風格邊框與郵戳徽章（頁面 3 明信片用）
---------------------------------------------------------------- */
function AirmailFrame({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        padding: "9px",
        background:
          "repeating-linear-gradient(135deg, #B23A2E 0px, #B23A2E 10px, #FAF8F4 10px, #FAF8F4 20px, #2E4C8E 20px, #2E4C8E 30px, #FAF8F4 30px, #FAF8F4 40px)",
      }}
    >
      <div className="rounded-xl bg-cream w-full h-full">{children}</div>
    </div>
  );
}

function PostmarkBadge({ stamp, size = 88, locked = false }) {
  const rawId = useId().replace(/[:]/g, "");
  const pathId = `postmark-path-${rawId}`;
  const tint = locked ? "#B4AFA1" : "#4A4638";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0" style={{ opacity: 0.85 }}>
      <defs>
        <path id={pathId} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke={tint} strokeWidth="1.3" strokeDasharray="1.5 3.5" opacity="0.85" />
      <circle cx="50" cy="50" r="37" fill="none" stroke={tint} strokeWidth="1.1" opacity="0.9" />
      <text fontSize="6.6" letterSpacing="2.2" fill={tint} opacity="0.9">
        <textPath href={`#${pathId}`} startOffset="2%">
          ✦ LUMI TIME MAIL ✦ 2026 ✦
        </textPath>
      </text>
      {locked ? (
        <text x="50" y="59" fontSize="22" textAnchor="middle">🔒</text>
      ) : (
        <g stroke={tint} strokeWidth="1.7" fill="none" strokeLinecap="round">
          <path d="M32 43 q4.5 -3.5 9 0 t9 0 t9 0" />
          <path d="M32 50 q4.5 -3.5 9 0 t9 0 t9 0" />
          <path d="M32 57 q4.5 -3.5 9 0 t9 0 t9 0" />
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------
   省思功能的計算輔助
---------------------------------------------------------------- */
// 取得某天所屬「週一～週日」的日期字串陣列
function weekDates(ref) {
  const d = new Date(ref);
  const day = (d.getDay() + 6) % 7; // 週一 = 0
  const mon = new Date(d);
  mon.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(mon);
    x.setDate(mon.getDate() + i);
    return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  });
}

function weekNumber(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

// 組出週回顧信的資料與信文
function buildWeeklyLetter(daily, refDate) {
  const dates = weekDates(refDate);
  const rows = dates.map((ds) => ({ ds, r: daily[ds] || null, s: computeFinalScore(daily[ds]) }));
  const scored = rows.filter((x) => x.s !== null);
  if (scored.length === 0) return null;

  const scores = scored.map((x) => x.s);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best = Math.max(...scores);
  const low = Math.min(...scores);
  const lowRow = scored.find((x) => x.s === low);
  const bestRow = scored.find((x) => x.s === best);

  const moodCounts = {};
  rows.forEach((x) => { if (x.r?.mood) moodCounts[x.r.mood] = (moodCounts[x.r.mood] || 0) + 1; });
  const topMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || null;
  const doneTasks = rows.filter((x) => x.r?.wheelStatus === "check").length;
  const cards = rows.filter((x) => x.r?.insightCard).length;

  const md = (ds) => { const d = new Date(ds); return `${d.getMonth() + 1}/${d.getDate()}`; };
  const paras = [];
  paras.push(`這週你有 ${scored.length} 天留下了紀錄。`);

  if (low < 60 && best >= 75 && lowRow && bestRow) {
    paras.push(`${md(lowRow.ds)} 掉到 ${low} 分，那天大概不太好過。但 ${md(bestRow.ds)} 你回到了 ${best} 分——你沒有讓一個低分的日子，變成一個低分的星期。`);
  } else if (avg >= 80) {
    paras.push(`平均 ${avg} 分，這週你把自己照顧得很好。這種穩定不是運氣，是你每天選出來的。`);
  } else if (avg < 60) {
    paras.push(`平均 ${avg} 分，這是辛苦的一週。但你七天裡有 ${scored.length} 天願意坐下來記錄，這件事本身就不容易。`);
  } else {
    paras.push(`平均 ${avg} 分，不高不低，是真實生活的樣子。起伏本來就是常態。`);
  }

  if (doneTasks > 0) paras.push(`你完成了 ${doneTasks} 件答應自己的事${cards > 0 ? `，也收下了 ${cards} 張洞見卡` : ""}。`);
  if (topMood) paras.push(`這週最常出現的心情是「${MOOD_LABEL[topMood] || topMood}」。`);
  paras.push("下週不用更好，維持就很好。");

  return { dates, rows, avg, best, low, topMood, doneTasks, cards, logged: scored.length, text: paras, weekNo: weekNumber(dates[0]), range: `${md(dates[0])} – ${md(dates[6])}` };
}

// 低潮偵測：最近連續 N 天皆低於 60 分
function detectSlump(daily, todayS, n = 3) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date(todayS);
    d.setDate(d.getDate() - (i - 1));
    const ds = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const s = computeFinalScore(daily[ds]);
    if (s === null || s >= 60) return null;
    out.push({ ds, s });
  }
  return out.reverse();
}


/* ---------------------------------------------------------------
   柔和雲朵（共用：背景點綴 & 寄出動畫）
---------------------------------------------------------------- */
function SoftCloud({ w = 200, opacity = 1, blur = 2, fill = "#FFFFFF", style, className }) {
  // 用 radial-gradient 做出柔邊，完全不使用 SVG/CSS filter：
  // filter 在動畫中每一幀都要重新算，是造成卡頓的主因。
  const h = w * 0.56;
  const puff = (cxP, cyP, rxP, ryP) => ({
    position: "absolute",
    left: w * cxP - w * rxP,
    top: h * cyP - h * ryP,
    width: w * rxP * 2,
    height: h * ryP * 2,
    background: `radial-gradient(closest-side, ${fill} 58%, rgba(255,255,255,0) 100%)`,
    borderRadius: "50%",
  });
  return (
    <div className={className} style={{ position: "relative", width: w, height: h, opacity, ...style }} aria-hidden="true">
      <div style={puff(0.29, 0.66, 0.24, 0.26)} />
      <div style={puff(0.48, 0.48, 0.21, 0.34)} />
      <div style={puff(0.67, 0.58, 0.19, 0.26)} />
      <div style={puff(0.82, 0.70, 0.16, 0.20)} />
      <div style={puff(0.50, 0.76, 0.38, 0.20)} />
    </div>
  );
}

/* ---------------------------------------------------------------
   背景點綴：柔和雲朵 + 會呼吸的小星星
---------------------------------------------------------------- */
function BackdropDeco() {
  const GOLD = "#C9BFA4", GOLD2 = "#B89F6B";
  const starPath = "M8 0.5 L9.5 6.5 L15.5 8 L9.5 9.5 L8 15.5 L6.5 9.5 L0.5 8 L6.5 6.5 Z";

  // 背景：原地呼吸閃爍的星
  const twinkles = [
    { top: "14%", left: "14%", s: 11, d: "0s", dur: "4s" },
    { top: "16%", right: "18%", s: 12, d: "0.5s", dur: "5s" },
    { top: "40%", left: "9%", s: 9, d: "1s", dur: "6s" },
    { top: "52%", right: "11%", s: 12, d: "1.5s", dur: "4.5s" },
    { bottom: "30%", left: "16%", s: 9, d: "2s", dur: "5.5s" },
    { bottom: "18%", right: "22%", s: 11, d: "0.8s", dur: "5s" },
  ];
  // 前景：緩緩飄落的星（少量，才不會太吵）
  const falls = [
    { left: "18%", s: 12, dur: "15s", delay: "-2s", col: GOLD },
    { left: "44%", s: 9, dur: "18s", delay: "-9s", col: GOLD2 },
    { left: "68%", s: 13, dur: "16s", delay: "-5s", col: GOLD },
    { left: "86%", s: 8, dur: "20s", delay: "-13s", col: GOLD2 },
    { left: "6%", s: 10, dur: "19s", delay: "-16s", col: GOLD },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {twinkles.map((t, i) => (
        <svg key={`tw${i}`} width={t.s} height={t.s} viewBox="0 0 16 16"
             className="deco-twinkle"
             style={{ position: "absolute", top: t.top, bottom: t.bottom, left: t.left, right: t.right,
                      animationDelay: t.d, animationDuration: t.dur }}>
          <path d={starPath} fill={GOLD} />
        </svg>
      ))}
      {falls.map((f, i) => (
        <svg key={`fl${i}`} width={f.s} height={f.s} viewBox="0 0 16 16"
             className="deco-fall"
             style={{ position: "absolute", top: 0, left: f.left,
                      animationDuration: f.dur, animationDelay: f.delay }}>
          <path d={starPath} fill={f.col} />
        </svg>
      ))}
    </div>
  );
}


function WaxSeal({ size = 54 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="24" fill="#9A4A3E" />
      <circle cx="30" cy="30" r="24" fill="none" stroke="#7E3A30" strokeWidth="2" />
      <circle cx="30" cy="30" r="18" fill="none" stroke="#C98C80" strokeWidth="1" opacity="0.6" />
      <text x="30" y="38" fontSize="20" textAnchor="middle" fill="#F4E3DE" fontFamily="Georgia, serif">L</text>
    </svg>
  );
}

function WeeklyLetterCard({ data, opened, onOpen, onClose }) {
  if (!data) return null;
  const wd = (ds) => { const d = new Date(ds); return "一二三四五六日"[(d.getDay() + 6) % 7]; };

  if (!opened) {
    return (
      <button onClick={onOpen} className="w-full text-left">
        <AirmailFrame>
          <div className="p-5 flex items-center gap-4">
            <WaxSeal size={46} />
            <div>
              <div className="font-serif text-base">第 {data.weekNo} 週的回顧信</div>
              <div className="fs-11 text-mute mt-0.5">{data.range} · 點一下拆開</div>
            </div>
          </div>
        </AirmailFrame>
      </button>
    );
  }

  return (
    <>
      <AirmailFrame>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-serif text-base">第 {data.weekNo} 週 · {data.range}</div>
              <div className="fs-10 ls-0p2 text-mute mt-1">來自 Lumi 的回顧信</div>
            </div>
            <button onClick={onClose} className="text-mute2 shrink-0 p-1"><X size={16} /></button>
          </div>

          <div className="flex items-end gap-1.5 mt-4" style={{ height: 84 }}>
            {data.rows.map((x) => (
              <div key={x.ds} className="flex-1 text-center">
                <div className="fs-9 text-mute2" style={{ marginBottom: 2 }}>{x.s ?? ""}</div>
                <div
                  style={{
                    height: x.s ? x.s * 0.5 : 3,
                    background: x.s === null ? "#F0EDE5" : x.s >= 80 ? "#D9CFC0" : x.s >= 60 ? "#E8DFD3" : "#EFEAE0",
                    border: "1px solid #E3DFD4", borderRadius: 4,
                  }}
                />
                <div className="fs-9 text-mute" style={{ marginTop: 3 }}>{wd(x.ds)}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            {[["平均", data.avg], ["最高", data.best], ["最低", data.low], ["紀錄", `${data.logged} 天`]].map(([k, v]) => (
              <div key={k} className="flex-1 border border-line rounded-lg py-1.5 text-center">
                <div className="fs-9 text-mute2">{k}</div>
                <div className="font-serif text-sm mt-0.5">{v}</div>
              </div>
            ))}
          </div>

          <div className="fs-12p5 leading-relaxed text-brown2 mt-4 space-y-2">
            {data.text.map((t, i) => <p key={i}>{t}</p>)}
          </div>

          {data.topMood && FACE[data.topMood] && (
            <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px dashed #E3DFD4" }}>
              <img src={FACE[data.topMood]} alt="" style={{ width: 34, height: 34 }} />
              <span className="fs-11 text-mute">這週最常出現的心情</span>
            </div>
          )}
        </div>
      </AirmailFrame>
      <button onClick={onClose} className="w-full mt-3 border border-line rounded-full py-2.5 fs-12 text-mute">
        收起信封
      </button>
    </>
  );
}

/* ---------------------------------------------------------------
   ② 給年底的自己
---------------------------------------------------------------- */
function YearLetterSection({ yearLetter, setYearLetter, yearGoal }) {
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [reading, setReading] = useState(false);

  const now = new Date();
  const openAt = yearLetter ? new Date(yearLetter.openAt) : null;
  const unlocked = openAt ? now >= openAt : false;
  const daysLeft = openAt ? Math.max(0, Math.ceil((openAt - now) / 86400000)) : 0;

  const seal = () => {
    if (!draft.trim()) return;
    const y = now.getFullYear();
    const open = new Date(y, 11, 31, 9, 0, 0);
    if (open < now) open.setFullYear(y + 1);
    setYearLetter({ content: draft.trim(), goal: yearGoal || "", createdAt: now.toISOString(), openAt: open.toISOString(), opened: false });
    setDraft("");
    setWriting(false);
  };

  if (!yearLetter) {
    if (!writing) {
      return (
        <div>
          <SectionLabel>給年底的自己</SectionLabel>
          <button onClick={() => setWriting(true)} className="w-full border border-dashed border-line3 rounded-2xl px-4 py-5 text-center">
            <div className="fs-13 text-brown">寫一封信給 {now.getFullYear()} 年底的自己</div>
            <div className="fs-11 text-mute2 mt-1">封起來，12/31 早上 9:00 才能開</div>
          </button>
        </div>
      );
    }
    return (
      <div>
        <SectionLabel>給年底的自己</SectionLabel>
        <AirmailFrame>
          <div className="p-4">
            {yearGoal && (
              <>
                <div className="fs-10 ls-0p2 text-mute">今年的目標</div>
                <div className="font-serif text-sm mt-1 pb-3" style={{ borderBottom: "1px dashed #E3DFD4" }}>{yearGoal}</div>
              </>
            )}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={7}
              placeholder={"嘿，年底的我：\n\n寫這封信的時候……"}
              className="w-full text-sm outline-none resize-none bg-transparent mt-3 leading-relaxed"
            />
          </div>
        </AirmailFrame>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setWriting(false)} className="flex-1 border border-line rounded-full py-2.5 fs-12 text-mute">取消</button>
          <button onClick={seal} disabled={!draft.trim()} className="flex-[2] bg-ink text-white rounded-full py-2.5 text-sm disabled:opacity-40">
            封起來，12/31 才能開
          </button>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div>
        <SectionLabel>給年底的自己</SectionLabel>
        <AirmailFrame>
          <div className="p-5 text-center relative">
            <div className="absolute top-3 right-4 fs-13" style={{ opacity: 0.5 }}>🔒</div>
            <div className="fs-10 ls-0p2 text-mute">SEALED · 已封緘</div>
            <div className="font-serif text-base mt-2">給 {new Date(yearLetter.openAt).getFullYear()} 年底的自己</div>
            <div className="my-3 flex justify-center"><WaxSeal size={58} /></div>
            <div className="fs-11 text-brown">{new Date(yearLetter.openAt).toLocaleDateString("zh-TW")} · 09:00 開啟</div>
            <div className="font-serif text-2xl mt-2">{daysLeft}</div>
            <div className="fs-10 text-mute2">天後</div>
          </div>
        </AirmailFrame>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel>給年底的自己</SectionLabel>
      {!reading ? (
        <button
          onClick={() => { setReading(true); setYearLetter({ ...yearLetter, opened: true }); }}
          className="w-full bg-ink text-paper rounded-xl px-4 py-3 fs-12p5 text-left"
        >
          💌 一年前的你寄來一封信，可以打開了
        </button>
      ) : (
        <AirmailFrame>
          <div className="p-4">
            <div className="fs-10 text-mute">寄出於 {new Date(yearLetter.createdAt).toLocaleDateString("zh-TW")}</div>
            {yearLetter.goal && <div className="font-serif text-sm mt-2 text-brown">「{yearLetter.goal}」</div>}
            <p className="text-sm leading-relaxed whitespace-pre-wrap mt-3">{yearLetter.content}</p>
          </div>
        </AirmailFrame>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   ④ 低潮偵測的溫柔明信片
---------------------------------------------------------------- */
const GENTLE_REPLIES = [
  { key: "one", text: "好，今天只做一件小事", back: "那就這樣。今天做完一件，就算贏。" },
  { key: "rest", text: "我想休息，什麼都不做", back: "收到。今天算「休息日」，它一樣算數。" },
  { key: "busy", text: "我還好，只是最近比較忙", back: "好，那我不吵你。這張明信片留著，想起來再看。" },
];

function GentleCard({ slump, reply, onReply }) {
  if (!slump) return null;
  const back = GENTLE_REPLIES.find((r) => r.key === reply)?.back;
  return (
    <AirmailFrame>
      <div className="p-4">
        <div className="flex gap-3 items-start">
          <img src={FACE.calm} alt="" style={{ width: 54, height: 54, flexShrink: 0 }} />
          <div className="font-hand text-sm" style={{ lineHeight: 2 }}>
            {back ? back : <>我注意到你最近有點累。<br />不用解釋，也不用補回來。<br />要不要今天只做一件小事就好？</>}
          </div>
        </div>
        {!reply && (
          <div className="mt-4 pt-3" style={{ borderTop: "1px dashed #E3DFD4" }}>
            <div className="fs-10 text-mute mb-2">你想怎麼回她？</div>
            {GENTLE_REPLIES.map((r) => (
              <button
                key={r.key}
                onClick={() => onReply(r.key)}
                className="block w-full text-left border border-line rounded-lg px-3 py-2.5 fs-12p5 bg-paper mb-2"
              >
                {r.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </AirmailFrame>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [settings, setSettings] = useState({ cardTime: "08:00", scoreTime: "21:00" });
  const [todos, setTodos] = useState([]);
  const [daily, setDaily] = useState({});
  const [postcards, setPostcards] = useState([]);
  const [letters, setLetters] = useState({});        // 週回顧信：{ "2026-W29": {opened:true} }
  const [yearLetter, setYearLetter] = useState(null); // { content, createdAt, openAt, opened }
  const [gentle, setGentle] = useState({});          // { "2026-07-17": {reply} }

  const [showSettings, setShowSettings] = useState(false);
  const [showEditChar, setShowEditChar] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showDayModal, setShowDayModal] = useState(null);
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [openPostcard, setOpenPostcard] = useState(null);
  const [cheer, setCheer] = useState(null);
  const [arrivedBanner, setArrivedBanner] = useState(null);

  const today = todayStr();
  const rec = daily[today] || {};

  const hasEntry = (r) => !!(r && (r.cardStage || (r.score !== undefined && r.score !== null && r.score !== "") || r.journal || r.wheelPick || r.photo));
  const missedDays = (() => {
    const dates = Object.keys(daily).filter((d) => hasEntry(daily[d])).sort();
    if (dates.length === 0) return 0;
    const last = new Date(dates[dates.length - 1] + "T00:00:00");
    const now = new Date(today + "T00:00:00");
    return Math.max(0, Math.round((now - last) / 86400000));
  })();
  const avgScore = (() => {
    const scores = Object.values(daily).map(computeFinalScore).filter((v) => v !== null);
    if (scores.length === 0) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  })();
  // 連續紀錄天數（從今天往回數；今天還沒紀錄就從昨天起算）
  const streak = (() => {
    let n = 0;
    const d = new Date(today);
    if (!hasEntry(daily[today])) d.setDate(d.getDate() - 1);
    for (let i = 0; i < 400; i++) {
      const ds = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      if (!hasEntry(daily[ds])) break;
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  })();
  const avatarTier = avgScore === null ? "none" : avgScore < 60 ? "plain" : avgScore < 80 ? "ring" : avgScore < 95 ? "gold" : "star";

  /* 省思功能資料 */
  const weekKey = (() => { const ds = weekDates(today)[0]; return `${new Date(ds).getFullYear()}-W${weekNumber(ds)}`; })();
  const weeklyData = loaded ? buildWeeklyLetter(daily, today) : null;
  const weeklyOpened = !!letters[weekKey]?.opened;
  const slump = loaded ? detectSlump(daily, today, 3) : null;
  const gentleReply = gentle[today]?.reply || null;

  useEffect(() => {
    (async () => {
      const [c, s, t, d, p, lt, yl, gt] = await Promise.all([
        loadKey(K_CHAR, DEFAULT_CHARACTER),
        loadKey(K_SETTINGS, { cardTime: "08:00", scoreTime: "21:00", musicStyle: "piano", notifyEnabled: false }),
        loadKey(K_TODOS, []),
        loadKey(K_DAILY, {}),
        loadKey(K_POSTCARDS, []),
        loadKey(K_LETTERS, {}),
        loadKey(K_YEARLETTER, null),
        loadKey(K_GENTLE, {}),
      ]);
      setCharacter(c);
      setSettings(s);
      setTodos(t);
      setDaily(d);
      setPostcards(p);
      setLetters(lt);
      setYearLetter(yl);
      setGentle(gt);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) saveKey(K_CHAR, character); }, [character, loaded]);
  useEffect(() => { if (loaded) saveKey(K_SETTINGS, settings); }, [settings, loaded]);
  useEffect(() => { if (loaded) saveKey(K_TODOS, todos); }, [todos, loaded]);
  useEffect(() => { if (loaded) saveKey(K_DAILY, daily); }, [daily, loaded]);
  useEffect(() => { if (loaded) saveKey(K_POSTCARDS, postcards); }, [postcards, loaded]);
  useEffect(() => { if (loaded) saveKey(K_LETTERS, letters); }, [letters, loaded]);
  useEffect(() => { if (loaded) saveKey(K_YEARLETTER, yearLetter); }, [yearLetter, loaded]);
  useEffect(() => { if (loaded) saveKey(K_GENTLE, gentle); }, [gentle, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const now = new Date();
    let changed = false;
    const updated = postcards.map((p) => {
      if (p.status === "transit" && new Date(p.arriveAt) <= now) {
        changed = true;
        if (!arrivedBanner) setArrivedBanner(p.id);
        return { ...p, status: "arrived" };
      }
      return p;
    });
    if (changed) setPostcards(updated);
    // eslint-disable-next-line
  }, [loaded]);

  const updateRecord = useCallback((date, patch) => {
    setDaily((prev) => ({ ...prev, [date]: { ...(prev[date] || {}), ...patch } }));
  }, []);

  const collectedWords = new Set(
    Object.values(daily)
      .filter((r) => r && r.insightCard)
      .map((r) => r.insightCard.word)
  );
  const collectedDates = {};
  Object.entries(daily).forEach(([dateStr, r]) => {
    if (r && r.insightCard) {
      const w = r.insightCard.word;
      if (!collectedDates[w] || dateStr < collectedDates[w]) collectedDates[w] = dateStr;
    }
  });
  const drawCard = () => {
    const remaining = CARD_DECK.filter((c) => !collectedWords.has(c.word));
    const pool = remaining.length > 0 ? remaining : CARD_DECK; // 圖鑑集滿後才允許重複，開始新一輪
    const card = pool[Math.floor(Math.random() * pool.length)];
    updateRecord(today, { insightCard: card, cardStage: 1 });
  };
  const revealExplanation = () => {
    updateRecord(today, { cardStage: 2 });
    if (todos.length > 0 && !rec.wheelPick) {
      setTimeout(() => setShowWheel(true), 1800);
    }
  };

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text, done: false }]);
    setNewTodo("");
  };
  const toggleTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    const willBeDone = todo ? !todo.done : false;
    setTodos((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const nowDone = !t.done;
      return { ...t, done: nowDone, doneDate: nowDone ? today : null };
    }));
    // 同步把「今天完成的代辦名稱」寫進今天的日記紀錄，供總結顯示
    setDaily((prev) => {
      if (!todo) return prev;
      const rec = prev[today] || {};
      const list = Array.isArray(rec.completedTodos) ? [...rec.completedTodos] : [];
      const idx = list.indexOf(todo.text);
      if (willBeDone && idx < 0) list.push(todo.text);
      if (!willBeDone && idx >= 0) list.splice(idx, 1);
      return { ...prev, [today]: { ...rec, completedTodos: list } };
    });
    // 完成時，偶爾（約一半機率）冒出一句小鼓勵
    if (willBeDone && Math.random() < 0.5) {
      const line = TODO_CHEERS[Math.floor(Math.random() * TODO_CHEERS.length)];
      setCheer({ id: Date.now(), text: line });
      setTimeout(() => setCheer(null), 2600);
    }
  };
  const removeTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const moveTodo = (from, to) => {
    setTodos((prev) => {
      if (to < 0 || to >= prev.length || from === to) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  /* 每天 00:00 過後：把「昨天（或更早）已完成」的代辦清掉，未完成的留著 */
  useEffect(() => {
    if (!loaded) return;
    setTodos((prev) => {
      const kept = prev.filter((t) => !(t.done && t.doneDate && t.doneDate !== today));
      return kept.length === prev.length ? prev : kept;
    });
    // eslint-disable-next-line
  }, [loaded, today]);

  /* 提醒通知：App 開著時，每分鐘檢查一次，到設定時間就發系統通知（每天每個時段最多一次） */
  const notifiedRef = useRef({});
  useEffect(() => {
    if (!loaded) return;
    if (!settings.notifyEnabled) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const check = () => {
      const now = new Date();
      const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const dayKey = fmtDate(now);
      const fire = (slot, time, title, body) => {
        if (!time) return;
        if (hhmm !== time) return;
        const key = `${dayKey}-${slot}`;
        if (notifiedRef.current[key]) return;
        notifiedRef.current[key] = true;
        try { new Notification(title, { body }); } catch {}
      };
      // 洞見卡提醒（若今天還沒抽卡）
      if (!daily[today]?.insightCard) {
        fire("card", settings.cardTime, "Lumi", "今天的洞見卡還在等你翻開 ✦");
      }
      // 打分提醒（若今天還沒打分）
      const todayScore = daily[today]?.score;
      if (todayScore === undefined || todayScore === null || todayScore === "") {
        fire("score", settings.scoreTime, "Lumi", "留幾分鐘，為今天的自己打個分數吧。");
      }
    };

    check();
    const timer = setInterval(check, 30000); // 每 30 秒檢查一次
    return () => clearInterval(timer);
  }, [loaded, settings.notifyEnabled, settings.cardTime, settings.scoreTime, daily, today]);

  const setWheelStatus = (date, status) => {
    const r = daily[date] || {};
    if (r.wheelStatus === status) {
      updateRecord(date, { wheelStatus: null, scoreAdjust: 0 });
      return;
    }
    updateRecord(date, { wheelStatus: status, scoreAdjust: status === "check" ? 5 : -5 });
  };

  const handleHomePhoto = async (file) => {
    const url = await resizeImageToDataURL(file);
    const ref = await savePhoto(url);
    updateRecord(today, { photo: ref });
  };

  /* 音樂：第一次觸碰畫面即開始播放；風格由設定頁切換 */
  const musicStyle = settings.musicStyle || "piano";
  useAutoMusic(musicStyle);
  const musicOn = musicStyle !== "off";
  const lastMusicStyle = useRef(musicStyle === "off" ? "piano" : musicStyle);
  useEffect(() => { if (musicStyle !== "off") lastMusicStyle.current = musicStyle; }, [musicStyle]);
  const toggleMusic = () => {
    const next = musicOn ? "off" : (lastMusicStyle.current || "piano");
    setSettings((s) => ({ ...s, musicStyle: next }));
    // 按鈕本身就是使用者手勢 → 可直接開始播放，不必再等其他觸碰
    musicEngine.play(next);
  };

  /* 封面自動淡出 */
  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, [showSplash]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-paper">
        <GlobalStyle />
        <div className="text-mute text-sm tracking-widest">載入中…</div>
      </div>
    );
  }

  /* 首次開啟：角色設定優先於一切，全螢幕顯示，完成前不顯示其他內容 */
  if (!character.onboarded) {
    return (
      <div className="fixed inset-0 bg-paper overflow-y-auto">
        <GlobalStyle />
        <OnboardWizard
          initial={character}
          mode="create"
          onFinish={(c) => setCharacter({ ...c, onboarded: true })}
        />
      </div>
    );
  }

  return (
    <div id="app-root" className="fixed inset-0 flex flex-col app-bg-gradient text-main font-sans overflow-hidden">
      <GlobalStyle />
      <div className="paper-grain absolute inset-0 pointer-events-none" />
      <BackdropDeco />

      {cheer && (
        <div className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ bottom: 96 }}>
          <div className="cheer-pop flex items-center gap-2 bg-ink text-paper rounded-full pl-2 pr-4 py-2 shadow-lg" style={{ maxWidth: "86%" }}>
            <img src={FACE.cheer} alt="" style={{ width: 28, height: 28, background: "#fff", borderRadius: "50%" }} />
            <span className="fs-12">{cheer.text}</span>
          </div>
        </div>
      )}

      {showSplash && (
        <div
          className="fixed inset-0 z-50 splash-fade"
          onClick={() => setShowSplash(false)}
          style={{ backgroundImage: `url(${COVER_SRC})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}

      {arrivedBanner && (
        <div
          className="bg-tan border-b border-line2 fs-12 px-4 py-2 flex items-center justify-between shrink-0 cursor-pointer"
          onClick={() => { setPage(3); setArrivedBanner(null); }}
        >
          <span>✉ 一封明信片已經送達了</span>
          <X size={14} onClick={(e) => { e.stopPropagation(); setArrivedBanner(null); }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div key={page} className="page-fade">
        {page === 1 && (
          <HomePage
            character={character}
            rec={rec}
            missedDays={missedDays}
            streak={streak}
            drawCard={drawCard}
            revealExplanation={revealExplanation}
            todos={todos}
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            moveTodo={moveTodo}
            handleHomePhoto={handleHomePhoto}
            setWheelStatus={(status) => setWheelStatus(today, status)}
            openWheel={() => setShowWheel(true)}
            slump={slump}
            gentleReply={gentleReply}
            onGentleReply={(k) => setGentle((p) => ({ ...p, [today]: { reply: k } }))}
            musicOn={musicOn}
            onToggleMusic={toggleMusic}
          />
        )}
        {page === 2 && (
          <CalendarPage
            character={character}
            daily={daily}
            monthCursor={monthCursor}
            setMonthCursor={setMonthCursor}
            openDay={(d) => setShowDayModal(d)}
          />
        )}
        {page === 3 && (
          <PostcardPage
            character={character}
            postcards={postcards}
            setPostcards={setPostcards}
            openPostcard={openPostcard}
            setOpenPostcard={setOpenPostcard}
            weeklyData={weeklyData}
            weeklyOpened={weeklyOpened}
            onOpenWeekly={() => setLetters((p) => ({ ...p, [weekKey]: { opened: true } }))}
            onCloseWeekly={() => setLetters((p) => ({ ...p, [weekKey]: { opened: false } }))}
            todayScore={computeFinalScore(rec)}
            tier={avatarTier}
          />
        )}
        {page === 4 && (
          <ProfilePage
            character={character}
            setCharacter={setCharacter}
            tier={avatarTier}
            avgScore={avgScore}
            collectedCount={collectedWords.size}
            deckSize={CARD_DECK.length}
            collectedCards={CARD_DECK.filter((c) => collectedWords.has(c.word))}
            collectedDates={collectedDates}
            yearLetter={yearLetter}
            setYearLetter={setYearLetter}
            daily={daily}
            onOpenDay={(ds) => { setShowDayModal(ds); }}
            onEdit={() => setShowEditChar(true)}
            onSettings={() => setShowSettings(true)}
          />
        )}
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-paper flex items-stretch py-2.5 pb-3">
        {[
          { id: 1, icon: Home, label: "首頁" },
          { id: 2, icon: CalendarDays, label: "日曆" },
          { id: 3, icon: Mail, label: "明信片" },
          { id: 4, icon: User, label: "我" },
        ].map((it) => (
          <button
            key={it.id}
            onClick={() => setPage(it.id)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-1.5 ${page === it.id ? "text-ink" : "text-mute2"}`}
          >
            <it.icon size={25} strokeWidth={page === it.id ? 2.4 : 1.8} />
            <span className="fs-12 tracking-wide">{it.label}</span>
          </button>
        ))}
      </div>

      {showWheel && (
        <WheelModal
          todos={todos}
          onClose={() => setShowWheel(false)}
          onPick={(text) => {
            updateRecord(today, { wheelPick: text, wheelStatus: null, scoreAdjust: 0 });
            setShowWheel(false);
          }}
        />
      )}

      {showSettings && <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}

      {showEditChar && (
        <Modal onClose={() => setShowEditChar(false)} width="max-w-md">
          <OnboardWizard
            initial={character}
            mode="edit"
            onClose={() => setShowEditChar(false)}
            onFinish={(c) => { setCharacter({ ...c, onboarded: true }); setShowEditChar(false); }}
          />
        </Modal>
      )}

      {showDayModal && (
        <DayModal
          date={showDayModal}
          record={daily[showDayModal] || {}}
          yearGoal={character.yearGoal}
          todos={showDayModal === today ? todos : []}
          prevScore={(() => {
            const d = new Date(showDayModal);
            d.setDate(d.getDate() - 1);
            const prevKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            return computeFinalScore(daily[prevKey]);
          })()}
          onClose={() => setShowDayModal(null)}
          updateRecord={(patch) => updateRecord(showDayModal, patch)}
          setWheelStatus={(status) => setWheelStatus(showDayModal, status)}
          isPast={showDayModal !== today}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   角色設定精靈（兩步驟）
   Step1 头像（固定）＋名稱＋座右銘＋理想樣子｜Step2 年度目標
---------------------------------------------------------------- */
function OnboardWizard({ initial, mode, onFinish, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...DEFAULT_CHARACTER, ...initial });

  const saveExit = () => {
    onFinish(form);
    if (onClose) onClose();
  };
  const next = () => (step < 2 ? setStep(step + 1) : saveExit());
  const back = () => setStep(Math.max(1, step - 1));

  return (
    <div className="w-full min-h-full flex flex-col bg-paper">
      <div className="flex items-center justify-between px-6 pt-6 shrink-0">
        {step === 1 ? (
          <RoundIconBtn onClick={saveExit}><X size={17} /></RoundIconBtn>
        ) : (
          <RoundIconBtn onClick={back} variant="light"><ChevronLeft size={17} /></RoundIconBtn>
        )}
        <div className="flex gap-1.5">
          {[1, 2].map((n) => (
            <div key={n} className={`h-1.5 rounded-full transition-all ${n === step ? "w-5 bg-ink" : "w-1.5 bg-line2"}`} />
          ))}
        </div>
        <RoundIconBtn onClick={next}><Check size={17} /></RoundIconBtn>
      </div>

      <div className="flex-1 px-6 pt-5 pb-6 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <input
                type="file" accept="image/*" className="hidden"
                ref={(el) => (window.__onbAvatarInput = el)}
                onChange={async (e) => {
                  if (e.target.files[0]) {
                    const url = await resizeImageToDataURL(e.target.files[0], 640);
                    setForm({ ...form, avatar: url, avatarPos: 50 });
                  }
                }}
              />
              <button
                onClick={() => window.__onbAvatarInput?.click()}
                className="relative w-32 h-32 rounded-full border-2 border-ink overflow-hidden flex items-center justify-center bg-white-solid"
              >
                {form.avatar ? (
                  <img src={form.avatar} alt="" className="w-full h-full object-cover"
                       style={{ objectPosition: `center ${form.avatarPos ?? 50}%` }} />
                ) : (
                  <Avatar size={128} />
                )}
                <span className="absolute bottom-1 right-1 bg-ink text-paper rounded-full p-1.5">
                  <Camera size={13} />
                </span>
              </button>
              {form.avatar && (
                <div className="flex items-center gap-2 w-44">
                  <span className="fs-9 text-mute2 shrink-0">位置</span>
                  <input type="range" min="0" max="100" value={form.avatarPos ?? 50}
                         onChange={(e) => setForm({ ...form, avatarPos: Number(e.target.value) })}
                         className="flex-1 accent-ink" />
                  <button onClick={() => setForm({ ...form, avatar: null })} className="fs-9 text-mute2 shrink-0 underline">還原</button>
                </div>
              )}
              <div className="fs-10 text-mute2">點頭像可上傳自己的照片，不換則用預設角色</div>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="幫自己取個名字"
                className="text-center bg-transparent border-b border-line3 outline-none text-base py-1 w-44 placeholder:text-line3"
              />
            </div>

            <div>
              <div className="fs-15 font-medium text-brown2 mb-2">座右銘</div>
              <input
                value={form.motto}
                onChange={(e) => setForm({ ...form, motto: e.target.value })}
                placeholder="一句提醒自己的話"
                className="w-full border border-line rounded-xl px-4 py-3 text-base outline-none bg-white-solid"
              />
            </div>
            <div>
              <div className="fs-15 font-medium text-brown2 mb-2">理想中的樣子</div>
              <textarea
                value={form.idealSelf}
                onChange={(e) => setForm({ ...form, idealSelf: e.target.value })}
                rows={4}
                placeholder="想成為什麼樣的人？"
                className="w-full border border-line rounded-xl px-4 py-3 text-base outline-none resize-none bg-white-solid leading-relaxed"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="font-serif text-xl">今年，想往哪裡走？</div>
            </div>
            <div>
              <div className="fs-15 font-medium text-brown2 mb-2">年度目標</div>
              <textarea
                value={form.yearGoal}
                onChange={(e) => setForm({ ...form, yearGoal: e.target.value })}
                rows={3}
                placeholder="填寫今年的年度目標"
                className="w-full border border-line rounded-xl px-4 py-3 text-base outline-none resize-none bg-white-solid leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-8 pt-3 bg-paper border-t border-line">
        {step === 1 ? (
          <button onClick={next} className="w-full bg-ink text-white rounded-full py-3.5 text-base font-medium">
            下一步
          </button>
        ) : (
          <button onClick={saveExit} className="w-full bg-ink text-white rounded-full py-3.5 text-base font-medium">
            {mode === "edit" ? "儲存" : "完成，開始使用"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   頁面 1：首頁
---------------------------------------------------------------- */
function HomePage({
  character, rec, missedDays = 0, streak = 0, drawCard, revealExplanation, todos, newTodo, setNewTodo,
  addTodo, toggleTodo, removeTodo, moveTodo, handleHomePhoto, setWheelStatus, openWheel,
  slump, gentleReply, onGentleReply, musicOn, onToggleMusic,
}) {
  const fileRef = useRef(null);
  const stage = rec.cardStage || 0;
  const noiseOpacity = missedDays >= 7 ? Math.min(0.55, 0.18 + (missedDays - 7) * 0.04) : 0;

  // 代辦拖曳排序
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const listRef = useRef(null);
  const onGripDown = (e, idx) => {
    e.preventDefault();
    setDragIdx(idx);
    setOverIdx(idx);
    // 拖曳期間關閉整頁的文字選取與長按選單
    document.body.classList.add("dragging-todo");
    const move = (ev) => {
      // 阻止拖曳時頁面跟著捲動 / 選字
      if (ev.cancelable) ev.preventDefault();
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const rows = listRef.current?.querySelectorAll("[data-todo-row]");
      if (!rows) return;
      let target = idx;
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect();
        if (y > r.top && y < r.bottom) target = i;
      });
      setOverIdx(target);
    };
    const up = () => {
      setDragIdx((d) => {
        setOverIdx((o) => {
          if (d !== null && o !== null && d !== o) moveTodo(d, o);
          return null;
        });
        return null;
      });
      document.body.classList.remove("dragging-todo");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  return (
    <div className="relative">
      {noiseOpacity > 0 && (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-40 mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              opacity: noiseOpacity,
            }}
          />
          <div className="fixed top-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="bg-ink text-paper fs-11 px-4 py-2 rounded-full">
              好一陣子沒有紀錄了，畫面有點模糊——完成今天的紀錄，讓它清晰起來
            </div>
          </div>
        </>
      )}
      <div className="px-5 pt-5 pb-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="fs-11 text-mute">
              {new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" })}
            </div>
            <div className="font-serif text-xl mt-0.5 truncate">
              {character.name ? `${character.name}，${greetWord()}。` : `${greetWord()}。`}
            </div>
            <div className="fs-10 text-mute2 mt-1 truncate">
              {avatarStateFromScore(computeFinalScore(rec)).label || "今天還沒有紀錄"}
              {streak > 0 && ` · 已連續紀錄 ${streak} 天`}
            </div>
          </div>
          <MoodAvatar score={computeFinalScore(rec)} size={66} showLabel={false} circle />
        </div>

        {slump && (
          <div>
            <SectionLabel>來自 Lumi 的明信片</SectionLabel>
            <GentleCard slump={slump} reply={gentleReply} onReply={onGentleReply} />
          </div>
        )}

        <div>
          <SectionLabel>今日洞見卡</SectionLabel>
          {stage === 0 ? (
            <button
              onClick={drawCard}
              className="w-full h-40 rounded-2xl border border-dashed border-line3 flex flex-col items-center justify-center gap-2 text-mute"
            >
            <Sparkles size={20} />
            <span className="text-sm">點一下，抽取今日的卡</span>
          </button>
        ) : (
          <div className="flipcard w-full h-40" onClick={() => stage === 1 && revealExplanation()}>
            <div className={`relative w-full h-full flipcard-inner ${stage === 2 ? "flipped" : ""}`}>
              <div className="face absolute inset-0 rounded-2xl bg-ink text-paper flex items-center justify-center">
                <div className="text-center">
                  <div className="fs-11 ls-0p3 text-mute2 mb-2">TODAY'S CARD</div>
                  <div className="font-serif text-3xl">{rec.insightCard?.word}</div>
                  {stage === 1 && <div className="fs-11 text-mute2 mt-3">再點一下，翻開解釋</div>}
                </div>
              </div>
              <div className="face face-back absolute inset-0 rounded-2xl bg-tan border border-line2 flex items-center justify-center px-6">
                <p className="fs-13 leading-relaxed text-center">{rec.insightCard?.meaning}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {rec.wheelPick && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>今日必須完成</SectionLabel>
            <button onClick={openWheel} className="fs-11 text-mute2 underline">重新轉一次</button>
          </div>
          <div className="border border-line rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm">{rec.wheelPick}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setWheelStatus("check")}
                className={`w-8 h-8 rounded-full border flex items-center justify-center ${rec.wheelStatus === "check" ? "bg-ink text-white border-ink" : "border-line2 text-mute"}`}
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => setWheelStatus("cross")}
                className={`w-8 h-8 rounded-full border flex items-center justify-center ${rec.wheelStatus === "cross" ? "bg-ink text-white border-ink" : "border-line2 text-mute"}`}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {!rec.wheelPick && todos.length > 0 && stage === 2 && (
        <button
          onClick={openWheel}
          className="w-full border border-dashed border-line3 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-mute text-sm"
        >
          <RotateCw size={16} /> 轉一下，決定今日必須完成的事
        </button>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>代辦事項</SectionLabel>
          {todos.length > 0 && (
            <span className="fs-11 text-mute2">已完成 {todos.filter((t) => t.done).length} / {todos.length}</span>
          )}
        </div>
        <div
          ref={listRef}
          className="border border-line rounded-2xl divide-y divide-line bg-paper"
          style={{ userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
        >
          {todos.length === 0 && (
            <div className="px-4 py-5 text-center fs-13 text-mute2">
              還沒有代辦事項，新增你今天的第一件事吧！
            </div>
          )}
          {todos.map((t, idx) => (
            <div
              key={t.id}
              data-todo-row
              className={`flex items-center gap-2 px-3 py-3 ${dragIdx === idx ? "opacity-40" : ""} ${overIdx === idx && dragIdx !== null && dragIdx !== idx ? "bg-tan" : ""}`}
              style={{ transition: "background 0.12s", userSelect: dragIdx !== null ? "none" : "auto" }}
            >
              <span
                onPointerDown={(e) => onGripDown(e, idx)}
                onTouchStart={(e) => onGripDown(e, idx)}
                className="todo-grip text-line2 shrink-0 cursor-grab p-1 -m-1"
                style={{ touchAction: "none" }}
              >
                <GripVertical size={16} />
              </span>
              <button
                onClick={() => toggleTodo(t.id)}
                className={`w-5 h-5 shrink-0 border rounded-4 flex items-center justify-center ${t.done ? "bg-ink border-ink" : "border-line3"}`}
              >
                {t.done && <Check size={12} className="text-white" />}
              </button>
              <span
                className={`flex-1 text-sm select-none ${t.done ? "line-through text-mute2" : ""}`}
                style={{ userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
              >{t.text}</span>
              <button onClick={() => removeTodo(t.id)} className="text-line2"><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="flex items-center gap-2 px-4 py-3">
            <Plus size={15} className="text-mute2 shrink-0" />
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="輸入代辦事項，例如：回覆一封信"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-line3 min-w-0"
              style={{ userSelect: "text", WebkitUserSelect: "text" }}
            />
            {newTodo.trim() && (
              <button
                onClick={addTodo}
                className="shrink-0 bg-ink text-white text-xs px-3 py-1.5 rounded-full"
              >
                新增
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>今日值得紀錄的照片</SectionLabel>
        <input
          type="file" accept="image/*" ref={fileRef} className="hidden"
          onChange={(e) => e.target.files[0] && handleHomePhoto(e.target.files[0])}
        />
        {rec.photo ? (
          <div className="relative">
            <Photo src={rec.photo} className="w-full h-48 object-cover rounded-2xl" style={{ objectPosition: `center ${rec.photoPos ?? 50}%` }} />
            <button onClick={() => fileRef.current.click()} className="absolute bottom-3 right-3 bg-ink text-white rounded-full p-2">
              <Camera size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current.click()} className="w-full h-32 rounded-2xl border border-dashed border-line3 flex flex-col items-center justify-center gap-2 text-mute">
            <Camera size={18} />
            <span className="text-xs">新增一張照片</span>
          </button>
        )}
      </div>
      </div>

      <button
        onClick={onToggleMusic}
        aria-label={musicOn ? "關閉音樂" : "播放音樂"}
        className={`fixed z-30 flex items-center justify-center rounded-full shadow-md ${musicOn ? "bg-ink text-paper" : "bg-white-solid text-mute border border-line"}`}
        style={{ left: 18, bottom: 84, width: 46, height: 46 }}
      >
        {musicOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   轉盤
---------------------------------------------------------------- */
function WheelModal({ todos, onClose, onPick }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const n = todos.length;
  const anglePer = n > 0 ? 360 / n : 360;
  // 奶茶大地色盤（低飽和），依序循環
  const PALETTE_A = ["#E8DFD3", "#DCD3C3", "#E5D9C9", "#D9CFC0", "#EAE2D6", "#D5CBBB"];
  const segColor = (i) => PALETTE_A[i % PALETTE_A.length];

  const gradient = n > 0
    ? `conic-gradient(${todos.map((t, i) => `${segColor(i)} ${i * anglePer}deg ${(i + 1) * anglePer}deg`).join(",")})`
    : "#EDE7D9";

  const spin = () => {
    if (n === 0 || spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * n);
    const target = 360 * 6 + (360 - (idx * anglePer + anglePer / 2));
    setRotation((prev) => prev - (prev % 360) + target);
    setTimeout(() => {
      setSpinning(false);
      onPick(todos[idx].text);
    }, 3200);
  };

  return (
    <Modal onClose={spinning ? () => {} : onClose}>
      <div className="p-6 flex flex-col items-center gap-6 wheel-zoom">
        <div className="text-center">
          <div className="font-serif text-lg">轉出今日必須完成的事</div>
          <div className="fs-12 text-mute mt-1">點擊轉盤中央開始轉動</div>
        </div>
        {n === 0 ? (
          <div className="text-sm text-mute py-10">請先在首頁新增代辦事項</div>
        ) : (
          <div className="relative w-64 h-64">
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0"
              style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #1C1C1C" }}
            />
            <div
              className="w-64 h-64 rounded-full border-4 border-ink relative overflow-hidden"
              style={{ background: gradient, transform: `rotate(${rotation}deg)`, transition: "transform 3.1s cubic-bezier(.17,.67,.2,1)" }}
            >
              {todos.map((t, i) => {
                const mid = i * anglePer + anglePer / 2;
                return (
                  // 整層與轉盤同大小 → 旋轉軸心就是圓心；標籤固定放在 12 點鐘，
                  // 轉 mid 度後剛好落在自己那一格的正中央（與 conic-gradient 對齊）
                  <div key={t.id} className="absolute inset-0" style={{ transform: `rotate(${mid}deg)` }}>
                    <div
                      className="flex flex-col items-center"
                      style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 84 }}
                    >
                      <span className="fs-9 font-semibold w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center mb-0.5">
                        {i + 1}
                      </span>
                      <span
                        className="fs-10 font-medium text-center"
                        style={{
                          color: "#1C1C1C",
                          textShadow: "0 0 4px rgba(255,255,255,0.95), 0 0 2px rgba(255,255,255,0.95)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "84px",
                        }}
                      >
                        {t.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={spin}
                className="w-16 h-16 rounded-full bg-paper border-2 border-ink flex flex-col items-center justify-center gap-0.5"
              >
                <RotateCw size={15} className={spinning ? "animate-spin" : ""} />
                <span className="fs-8 leading-none text-brown">決定<br/>今日行動</span>
              </button>
            </div>
          </div>
        )}
        {n > 0 && (
          <div className="w-full border border-line rounded-2xl px-4 py-3 space-y-1.5">
            {todos.map((t, i) => (
              <div key={t.id} className="flex items-center gap-2 fs-12">
                <span className="shrink-0 w-4 h-4 rounded-full bg-ink text-white fs-9 font-semibold flex items-center justify-center">{i + 1}</span>
                <span className="truncate">{t.text}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="fs-12 text-mute">稍後再轉</button>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------
   頁面 2：日曆
---------------------------------------------------------------- */
function CalCell({ d, score, photoRef, isToday, onClick }) {
  const photo = usePhoto(photoRef);
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 overflow-hidden ${isToday ? "border-ink" : "border-line"}`}
      style={photo ? { backgroundImage: `url(${photo})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
    >
      <span className={`fs-11 ${photo ? "text-white drop-shadow" : ""}`}>{d}</span>
      {score !== null && (
        <span className={`fs-9 px-1 rounded ${photo ? "bg-black-o50 text-white" : "text-mute"}`}>{score}</span>
      )}
    </button>
  );
}

function CalendarPage({ character, daily, monthCursor, setMonthCursor, openDay }) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthRecords = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const r = daily[`${year}-${pad(month + 1)}-${pad(d)}`];
    if (r) monthRecords.push(r);
  }
  const monthScores = monthRecords.map(computeFinalScore).filter((v) => v !== null);
  const loggedDays = monthRecords.filter((r) => r.cardStage || r.journal || r.wheelPick || (r.score !== undefined && r.score !== null && r.score !== "") || r.photo).length;
  const avgScore = monthScores.length ? Math.round(monthScores.reduce((a, b) => a + b, 0) / monthScores.length) : null;
  const bestScore = monthScores.length ? Math.max(...monthScores) : null;
  const moodCounts = {};
  monthRecords.forEach((r) => { if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1; });
  const topMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || null;
  const cardsThisMonth = monthRecords.filter((r) => r.insightCard).length;
  const completedTasks = monthRecords.filter((r) => r.wheelStatus === "check").length;

  return (
    <div className="px-5 pt-5 pb-8">
      {character.yearGoal && (
        <div className="mb-4 text-center">
          <div className="fs-10 ls-0p25 text-mute">年度目標</div>
          <div className="font-serif text-sm mt-1">{character.yearGoal}</div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonthCursor(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
        <div className="font-serif text-base">{year} 年 {month + 1} 月</div>
        <button onClick={() => setMonthCursor(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center fs-10 text-mute2 mb-1">
        {weekdayCN.map((w) => <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const r = daily[dateStr];
          const score = computeFinalScore(r);
          const isToday = dateStr === todayStr();
          return (
            <CalCell key={i} d={d} score={score} photoRef={r?.photo} isToday={isToday} onClick={() => openDay(dateStr)} />
          );
        })}
      </div>

      <div className="mt-7">
        <div className="fs-11 ls-0p25 text-mute uppercase mb-2">本月小結</div>
        {loggedDays === 0 ? (
          <div className="border border-dashed border-line3 rounded-2xl px-4 py-6 text-center fs-13 text-mute2">
            這個月還沒有紀錄，點一個日期開始寫下今天吧。
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">紀錄天數</div>
              <div className="font-serif text-xl mt-1">{loggedDays} 天</div>
            </div>
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">平均分數</div>
              <div className="font-serif text-xl mt-1">{avgScore !== null ? avgScore : "－"}</div>
            </div>
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">最高分</div>
              <div className="font-serif text-xl mt-1">{bestScore !== null ? bestScore : "－"}</div>
            </div>
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">最常出現的心情</div>
              {topMood && FACE[topMood] ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <img src={FACE[topMood]} alt="" style={{ width: 30, height: 30 }} />
                  <span className="fs-12 text-brown">{MOOD_LABEL[topMood]}</span>
                </div>
              ) : (
                <div className="text-xl mt-1">{topMood || "－"}</div>
              )}
            </div>
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">抽到的洞見卡</div>
              <div className="font-serif text-xl mt-1">{cardsThisMonth} 張</div>
            </div>
            <div className="border border-line rounded-2xl px-4 py-3">
              <div className="fs-10 text-mute2">完成的轉盤任務</div>
              <div className="font-serif text-xl mt-1">{completedTasks} 件</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   單日紀錄 Modal
---------------------------------------------------------------- */
function DayModal({ date, record, yearGoal, todos = [], prevScore = null, onClose, updateRecord, setWheelStatus, isPast = false }) {
  const fileRef = useRef(null);
  const [wheelInput, setWheelInput] = useState("");
  const [editing, setEditing] = useState(false);
  const fs = computeFinalScore(record);
  const guidance = scoreGuidance(fs, yearGoal);
  // 總結只看「今日必須完成」（轉盤選出的那一件），不列出全部代辦
  const doneList = record.wheelPick && record.wheelStatus === "check" ? [record.wheelPick] : [];
  const missList = record.wheelPick && record.wheelStatus === "cross" ? [record.wheelPick] : [];
  const warm = buildWarmSummary(record, doneList, missList, prevScore, date);

  // 有內容的日記
  const hasContent = !!(record.completed || record.journal || (record.score !== undefined && record.score !== null && record.score !== "") || record.insightCard || record.wheelPick || record.photo);
  // 唯讀檢視「只在打開當下判斷一次」，避免編輯過程中新增內容就被自動鎖定。
  // - 今天：只有「按過完成」才鎖定
  // - 過去：已完成、或打開時就已有內容的舊紀錄
  const initialLocked = useRef(record.completed || (isPast && hasContent)).current;
  const locked = initialLocked && !editing;

  const complete = () => {
    updateRecord({ completed: true });
    onClose();
  };

  if (locked) {
    return (
      <Modal onClose={onClose} width="max-w-md">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="font-serif text-lg">{date}</div>
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(true)} className="flex items-center gap-1 fs-12 text-mute">
                <Settings size={14} /> 編輯
              </button>
              <button onClick={onClose}><X size={18} /></button>
            </div>
          </div>

          {record.insightCard && (
            <div className="bg-tan rounded-xl p-3 fs-12">
              <span className="font-medium">洞見卡：{record.insightCard.word}</span>
              <p className="mt-1 text-brown leading-relaxed">{record.insightCard.meaning}</p>
            </div>
          )}

          {record.wheelPick && (
            <div>
              <SectionLabel>今日必須完成</SectionLabel>
              <div className="border border-line rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm">{record.wheelPick}</span>
                <span className={`fs-12 ${record.wheelStatus === "check" ? "text-brown" : record.wheelStatus === "cross" ? "text-mute2" : "text-mute2"}`}>
                  {record.wheelStatus === "check" ? "✓ 完成" : record.wheelStatus === "cross" ? "✕ 未完成" : "—"}
                </span>
              </div>
            </div>
          )}

          {fs !== null && (
            <div>
              <SectionLabel>今日分數</SectionLabel>
              <div className="border border-line rounded-xl px-4 py-4 bg-white-o50 text-center">
                <div className="font-serif text-4xl">{fs}</div>
                <div className="fs-11 text-mute2 mt-1">自評 {record.score} ＋ 轉盤 {record.scoreAdjust || 0} ＋ 心情 {moodWeight(record.mood)}</div>
              </div>
            </div>
          )}

          {record.mood && (
            <div>
              <SectionLabel>心情</SectionLabel>
              <div className="flex items-center gap-2">
                <img src={FACE[record.mood]} alt="" style={{ width: 44, height: 44 }} />
                <span className="text-sm text-brown">{MOOD_LABEL[record.mood] || record.mood}</span>
              </div>
            </div>
          )}

          {record.photo && (
            <div>
              <SectionLabel>今日照片</SectionLabel>
              <Photo src={record.photo} className="w-full h-40 object-cover rounded-xl" style={{ objectPosition: `center ${record.photoPos ?? 50}%` }} />
            </div>
          )}

          {record.journal && (
            <div>
              <SectionLabel>今日紀錄</SectionLabel>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-brown2">{record.journal}</p>
            </div>
          )}

          {(warm.facts || warm.line || (record.completedTodos && record.completedTodos.length > 0)) && (
            <div className="border border-line rounded-xl p-4 bg-cream">
              <div className="text-mute fs-10 ls-0p2 mb-2">今日總結{warm.fs !== null ? ` · ${warm.fs} 分` : ""}</div>
              {(doneList.length > 0 || missList.length > 0) && (
                <div className="fs-12 mb-2 leading-relaxed">
                  <span className="text-mute2 mr-2">今日必須完成</span>
                  {doneList.map((t) => <span key={t} className="text-brown">✓ {t}</span>)}
                  {missList.map((t) => <span key={t} className="text-mute2">✕ {t}</span>)}
                </div>
              )}
              {record.completedTodos && record.completedTodos.length > 0 && (
                <div className="fs-12 mb-2 leading-relaxed">
                  <span className="text-mute2 mr-2">完成的代辦</span>
                  {record.completedTodos.map((t) => <span key={t} className="text-brown mr-2">✓ {t}</span>)}
                </div>
              )}
              {warm.facts && <div className="fs-12p5 leading-relaxed text-brown2 mb-2">{warm.facts}</div>}
              {warm.line && <div className="text-sm leading-relaxed font-serif">{warm.line}</div>}
            </div>
          )}

          <div className="bg-ink text-paper rounded-xl p-4 fs-12 leading-relaxed">
            <div className="text-mute2 fs-10 ls-0p2 mb-1">分數指引 {guidance.range && `· ${guidance.range}`}</div>
            {guidance.text}
          </div>

          <button onClick={onClose} className="w-full border border-line rounded-full py-3 text-sm text-mute">關閉</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} width="max-w-md">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="font-serif text-lg">{date}</div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        {record.insightCard && (
          <div className="bg-tan rounded-xl p-3 fs-12">
            <span className="font-medium">洞見卡：{record.insightCard.word}</span>
            <p className="mt-1 text-brown leading-relaxed">{record.insightCard.meaning}</p>
          </div>
        )}

        <div>
          <SectionLabel>今日必須完成</SectionLabel>
          {record.wheelPick ? (
            <div className="border border-line rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm">{record.wheelPick}</span>
                <button
                  onClick={() => updateRecord({ wheelPick: null, wheelStatus: null, scoreAdjust: 0 })}
                  className="ml-2 fs-10 text-mute2 underline"
                >
                  清除
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setWheelStatus("check")} className={`w-8 h-8 rounded-full border flex items-center justify-center ${record.wheelStatus === "check" ? "bg-ink text-white border-ink" : "border-line2 text-mute"}`}><Check size={15} /></button>
                <button onClick={() => setWheelStatus("cross")} className={`w-8 h-8 rounded-full border flex items-center justify-center ${record.wheelStatus === "cross" ? "bg-ink text-white border-ink" : "border-line2 text-mute"}`}><X size={15} /></button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-line3 rounded-xl px-4 py-3 flex items-center gap-2">
              <input
                value={wheelInput}
                onChange={(e) => setWheelInput(e.target.value)}
                placeholder="這天還沒有轉盤任務，可以手動新增一項"
                className="flex-1 text-sm outline-none bg-transparent"
              />
              <button
                onClick={() => {
                  if (!wheelInput.trim()) return;
                  updateRecord({ wheelPick: wheelInput.trim(), wheelStatus: null, scoreAdjust: 0 });
                  setWheelInput("");
                }}
                className="shrink-0 bg-ink text-white fs-11 px-3 py-1.5 rounded-full"
              >
                設定
              </button>
            </div>
          )}
        </div>

        <div>
          <SectionLabel>今日給自己的打分</SectionLabel>
          <div className="border border-line rounded-xl px-4 py-4 bg-white-o50">
            <div className="text-center font-serif text-3xl mb-2">
              {record.score === undefined || record.score === null || record.score === "" ? "－" : record.score}
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={record.score === undefined || record.score === null || record.score === "" ? 50 : record.score}
              onChange={(e) => updateRecord({ score: Number(e.target.value) })}
              className="w-full accent-ink"
            />
            <div className="flex justify-between fs-11 text-mute2 mt-1 tracking-wider">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          {fs !== null && (
            <div className="fs-11 text-mute mt-1">
              自評 {record.score}　＋　轉盤 {record.scoreAdjust || 0}　＋　心情 {moodWeight(record.mood)}　＝　最終 {fs}
            </div>
          )}
        </div>

        <div>
          <SectionLabel>心情</SectionLabel>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => updateRecord({ mood: m })}
                className={`rounded-xl border flex flex-col items-center justify-center py-1.5 ${record.mood === m ? "border-ink bg-tan" : "border-line bg-paper"}`}
              >
                <img src={FACE[m]} alt={MOOD_LABEL[m]} style={{ width: 38, height: 38 }} />
                <span className="fs-9 text-brown mt-0.5">{MOOD_LABEL[m]}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>今日值得紀錄的照片</SectionLabel>
          <input type="file" accept="image/*" ref={fileRef} className="hidden"
            onChange={async (e) => { if (e.target.files[0]) { const ref = await savePhoto(await resizeImageToDataURL(e.target.files[0])); updateRecord({ photo: ref, photoPos: 50 }); } }} />
          {record.photo ? (
            <>
              <Photo
                src={record.photo}
                onClick={() => fileRef.current.click()}
                className="w-full h-40 object-cover rounded-xl"
                style={{ objectPosition: `center ${record.photoPos ?? 50}%` }}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="fs-9 text-mute2 shrink-0">上下位置</span>
                <input
                  type="range" min="0" max="100"
                  value={record.photoPos ?? 50}
                  onChange={(e) => updateRecord({ photoPos: Number(e.target.value) })}
                  className="flex-1 accent-ink"
                />
              </div>
            </>
          ) : (
            <button onClick={() => fileRef.current.click()} className="w-full h-24 rounded-xl border border-dashed border-line3 flex items-center justify-center text-mute text-xs gap-2">
              <Camera size={16} /> 新增照片
            </button>
          )}
        </div>

        <div>
          <SectionLabel>今日紀錄</SectionLabel>
          <textarea
            value={record.journal || ""}
            onChange={(e) => updateRecord({ journal: e.target.value })}
            rows={4}
            placeholder="寫下今天的心情與想法……"
            className="w-full border border-line rounded-xl px-4 py-3 text-sm outline-none resize-none bg-paper"
          />
        </div>

        {(warm.facts || warm.line || (record.completedTodos && record.completedTodos.length > 0)) && (
          <div className="border border-line rounded-xl p-4 bg-cream">
            <div className="text-mute fs-10 ls-0p2 mb-2">今日總結{warm.fs !== null ? ` · ${warm.fs} 分` : ""}</div>
            {(doneList.length > 0 || missList.length > 0) && (
              <div className="fs-12 mb-2 leading-relaxed">
                <span className="text-mute2 mr-2">今日必須完成</span>
                {doneList.map((t) => <span key={t} className="text-brown">✓ {t}</span>)}
                {missList.map((t) => <span key={t} className="text-mute2">✕ {t}</span>)}
              </div>
            )}
            {record.completedTodos && record.completedTodos.length > 0 && (
              <div className="fs-12 mb-2 leading-relaxed">
                <span className="text-mute2 mr-2">完成的代辦</span>
                {record.completedTodos.map((t) => (
                  <span key={t} className="text-brown mr-2">✓ {t}</span>
                ))}
              </div>
            )}
            {warm.facts && <div className="fs-12p5 leading-relaxed text-brown2 mb-2">{warm.facts}</div>}
            {warm.line && <div className="text-sm leading-relaxed font-serif">{warm.line}</div>}
          </div>
        )}

        <div className="bg-ink text-paper rounded-xl p-4 fs-12 leading-relaxed">
          <div className="text-mute2 fs-10 ls-0p2 mb-1">分數指引 {guidance.range && `· ${guidance.range}`}</div>
          {guidance.text}
        </div>

        <button onClick={complete} className="w-full bg-ink text-paper rounded-full py-3.5 text-sm font-medium">
          {editing ? "儲存並鎖定" : "完成"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------
   頁面 3：明信片
---------------------------------------------------------------- */
function PostcardPage({ character, postcards, setPostcards, openPostcard, setOpenPostcard, weeklyData, weeklyOpened, onOpenWeekly, onCloseWeekly, todayScore = null, tier = "none" }) {
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [days, setDays] = useState(7);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const send = () => {
    if (!content.trim()) return;
    setSending("stamping");
    setTimeout(() => setSending("flying"), 2000);
    setTimeout(() => {
      const now = new Date();
      const arrive = new Date(now.getTime() + days * 86400000);
      arrive.setHours(9, 0, 0, 0);
      const stamp = stampForDays(days);
      setPostcards((prev) => [
        { id: Date.now().toString(), content, photo, days, sentAt: now.toISOString(), arriveAt: arrive.toISOString(), stamp, senderScore: todayScore, senderTier: tier, status: "transit", opened: false },
        ...prev,
      ]);
      setSending(false);
      setContent("");
      setPhoto(null);
      setDays(7);
    }, 4100);
  };

  const openIt = (pc) => {
    if (pc.status !== "arrived") return;
    setPostcards((prev) => prev.map((p) => (p.id === pc.id ? { ...p, opened: true } : p)));
    setOpenPostcard(pc.id);
  };

  const active = postcards.find((p) => p.id === openPostcard);

  return (
    <div className="px-5 pt-5 pb-8 space-y-6">
      {!sending && (
        <>
          <div className="font-serif text-lg">給未來的明信片</div>

          {weeklyData && (
            <div>
              <div className="fs-11 ls-0p25 text-mute uppercase mb-2">本週回顧信</div>
              <WeeklyLetterCard data={weeklyData} opened={weeklyOpened} onOpen={onOpenWeekly} onClose={onCloseWeekly} />
            </div>
          )}
        </>
      )}

      {sending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(to bottom, #CFE0EC 0%, #E6EDF0 38%, #F6F1E6 72%, #EFE9DB 100%)" }}>
          {/* 遠景雲層：一直緩慢橫移，做出天空的深度 */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="cloud-r" style={{ position: "absolute", top: "6%", left: "-30%", animationDuration: "44s" }}>
              <SoftCloud w={340} opacity={0.5} blur={6} />
            </div>
            <div className="cloud-l" style={{ position: "absolute", top: "22%", right: "-34%", animationDuration: "36s" }}>
              <SoftCloud w={420} opacity={0.6} blur={5} />
            </div>
            <div className="cloud-r" style={{ position: "absolute", top: "46%", left: "-26%", animationDuration: "52s" }}>
              <SoftCloud w={300} opacity={0.45} blur={7} />
            </div>
          </div>

          {/* 中景雲：飛行時從下方升起，托住明信片 */}
          {sending === "flying" && (
            <div className="absolute inset-0" aria-hidden="true">
              <div className="cloud-rise" style={{ position: "absolute", top: "30%", left: "-16%" }}>
                <SoftCloud w={330} opacity={0.9} blur={3} />
              </div>
              <div className="cloud-rise" style={{ position: "absolute", top: "16%", right: "-20%", animationDelay: ".15s" }}>
                <SoftCloud w={380} opacity={0.85} blur={3} />
              </div>
            </div>
          )}

          {/* 明信片本體：貼郵票 → 整張飛走 */}
          <div className={sending === "flying" ? "card-fly" : "card-thud"} style={{ width: 300, maxWidth: "86vw", position: "relative", zIndex: 2 }}>
            <AirmailFrame>
              <div className="p-4" style={{ minHeight: 190 }}>
                <div className="flex items-start justify-between gap-3" style={{ marginTop: -10 }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <TierAvatar tier={tier} size={76} nudgeLeft={12} nudgeUp={4} pullText={14} photo={character.avatar} photoPos={character.avatarPos ?? 50} />
                    <div className="fs-12 text-brown font-hand truncate">{character?.name || "我"} → 未來的自己</div>
                  </div>
                  {/* 郵票貼上的位置 */}
                  <div style={{ width: 58, height: 71, position: "relative", flexShrink: 0 }}>
                    <div className="stamp-drop" style={{ position: "absolute", inset: 0 }}>
                      <StampIcon stamp={stampForDays(days)} size={58} />
                    </div>
                    <div className="ink-press" style={{ position: "absolute", left: -34, top: 16 }}>
                      <PostmarkBadge stamp={stampForDays(days)} size={64} />
                    </div>
                  </div>
                </div>
                <p className="fs-12p5 leading-relaxed mt-3 text-brown2" style={{ maxHeight: 92, overflow: "hidden" }}>
                  {content}
                </p>
              </div>
            </AirmailFrame>
          </div>

          {/* 前景雲：蓋在明信片上方，讓它「消失在雲裡」 */}
          {sending === "flying" && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden="true">
              <div className="cloud-rise" style={{ position: "absolute", top: "2%", left: "-24%", animationDelay: ".25s" }}>
                <SoftCloud w={460} opacity={0.97} blur={2} />
              </div>
              <div className="cloud-rise" style={{ position: "absolute", top: "-4%", right: "-28%", animationDelay: ".35s" }}>
                <SoftCloud w={420} opacity={0.95} blur={2} />
              </div>
            </div>
          )}

          <div className="fs-13 text-mute mt-6" style={{ position: "relative", zIndex: 4 }}>
            {sending === "stamping" ? `貼上${stampForDays(days).label}…` : "投遞至雲端中…"}
          </div>
        </div>
      )}

      {!sending && (
        <div className="space-y-4">
          <input type="file" accept="image/*" ref={fileRef} className="hidden"
            onChange={async (e) => e.target.files[0] && setPhoto(await resizeImageToDataURL(e.target.files[0]))} />

          <AirmailFrame>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between" style={{ marginTop: -10 }}>
                <div className="flex items-center gap-2">
                  <TierAvatar tier={tier} size={76} nudgeLeft={12} nudgeUp={4} pullText={14} photo={character.avatar} photoPos={character.avatarPos ?? 50} />
                  <div className="fs-12 text-brown font-hand">{character?.name || "我"} → 未來的自己</div>
                </div>
                <button onClick={() => fileRef.current.click()} className="p-1.5 text-brown"><Camera size={18} /></button>
              </div>
              {photo && (
                <div className="relative">
                  <img src={photo} className="w-full h-32 object-cover rounded-lg" />
                  <button onClick={() => setPhoto(null)} className="absolute top-1 right-1 bg-black-o50 text-white rounded-full p-1"><X size={12} /></button>
                </div>
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="想對未來的自己說什麼……"
                className="w-full text-sm outline-none resize-none bg-transparent"
              />
            </div>
          </AirmailFrame>

          <div>
            <SectionLabel>幾天後送達（上下滾動選擇）</SectionLabel>
            <DayRoller value={days} onChange={setDays} max={400} />
          </div>
          <button
            onClick={send}
            disabled={!content.trim()}
            className="w-full bg-ink text-white rounded-full py-3 text-sm disabled:opacity-40"
          >
            寄出明信片
          </button>
        </div>
      )}

      {postcards.length > 0 && (
        <div>
          <div className="fs-11 ls-0p25 text-mute uppercase mb-2 mt-2">已寄出的明信片</div>
          <div className="grid grid-cols-2 gap-3">
            {postcards.map((pc) => {
              const arrived = pc.status === "arrived" || pc.opened;
              return (
                <button key={pc.id} onClick={() => openIt(pc)} className="text-left">
                  <AirmailFrame>
                    <div className="relative p-3 flex flex-col" style={{ aspectRatio: "1 / 1" }}>
                      <div className="flex items-start justify-between">
                        <TierAvatar tier={pc.senderTier || "none"} size={72} nudgeLeft={10} />
                        <StampIcon stamp={pc.stamp} size={44} square />
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                        <PostmarkBadge stamp={pc.stamp} size={62} locked={!arrived} />
                        <div className="fs-10 text-mute">{arrived ? "已開封" : "未開封"}</div>
                      </div>
                      <div className="fs-9 text-mute2 text-center">
                        {arrived ? `${new Date(pc.sentAt).toLocaleDateString("zh-TW")} 寄出` : `預計 ${new Date(pc.arriveAt).toLocaleDateString("zh-TW")} 送達`}
                      </div>
                    </div>
                  </AirmailFrame>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {active && (
        <Modal onClose={() => setOpenPostcard(null)} width="max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-lg">{new Date(active.sentAt).toLocaleDateString("zh-TW")} 的信</div>
                <div className="fs-11 text-mute2 mt-0.5">{active.stamp.label}</div>
              </div>
              <div className="flex items-center gap-1">
                <PostmarkBadge stamp={active.stamp} size={48} />
                <StampIcon stamp={active.stamp} size={48} square />
              </div>
            </div>
            <AirmailFrame>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2" style={{ marginTop: -10 }}>
                  <TierAvatar tier={active.senderTier || "none"} size={76} nudgeLeft={12} nudgeUp={4} pullText={14} />
                  <div className="fs-12 text-brown font-hand">{character?.name || "我"} → 未來的自己</div>
                </div>
                {active.photo && <Photo src={active.photo} className="w-full h-40 object-cover rounded-lg" />}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{active.content}</p>
              </div>
            </AirmailFrame>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   頁面 4：個人檔案
---------------------------------------------------------------- */
function ProfilePage({ character, setCharacter, tier = "none", avgScore, collectedCount = 0, deckSize = 0, collectedCards = [], collectedDates = {}, yearLetter, setYearLetter, daily = {}, onOpenDay, onEdit, onSettings }) {
  const [showGallery, setShowGallery] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const onEditAvatar = () => setShowAvatarEdit(true);

  // 隨機翻到過去有紀錄的一天（排除今天）
  const openRandomDay = () => {
    const today = todayStr();
    const days = Object.entries(daily)
      .filter(([ds, r]) => ds !== today && r && (r.journal || r.wheelPick || r.insightCard || computeFinalScore(r) !== null))
      .map(([ds]) => ds);
    if (days.length === 0) return;
    const pick = days[Math.floor(Math.random() * days.length)];
    onOpenDay && onOpenDay(pick);
  };
  const tierLabel = {
    none: "尚未累積紀錄",
    plain: "持續紀錄中",
    ring: "穩定成長中",
    gold: "金色成長階段",
    star: "閃耀成長階段 ✦",
  }[tier];
  const deckComplete = deckSize > 0 && collectedCount >= deckSize;

  return (
    <div className="px-5 pt-5 pb-8">
      <div className="flex justify-end">
        <button onClick={onSettings} className="p-1.5 text-brown"><Settings size={18} /></button>
      </div>
      <div className="flex flex-col items-center text-center mt-2">
        {/* 與明信片上的署名頭像同一組插畫，只是尺寸放大；可換成自訂照片 */}
        <div className="relative">
          <TierAvatar tier={tier} size={190} photo={character.avatar} photoPos={character.avatarPos ?? 50} />
          <button
            onClick={onEditAvatar}
            className="absolute bottom-1 right-1 bg-ink text-paper rounded-full p-2 shadow-md"
            aria-label="更換大頭照"
          >
            <Camera size={15} />
          </button>
        </div>
        <div className="fs-10 ls-0p2 text-gold mt-2">{tierLabel}{avgScore !== null && avgScore !== undefined ? `　·　平均 ${Math.round(avgScore)} 分` : ""}</div>
        <div className="font-serif text-xl mt-2">{character.name || "尚未命名"}</div>
        {character.motto && <div className="fs-13 text-mute mt-1 font-hand">「{character.motto}」</div>}

        <button
          onClick={() => setShowGallery(true)}
          className="w-full mt-6 border border-line rounded-2xl px-4 py-3 flex items-center justify-between text-left"
        >
          <div>
            <div className="fs-13 font-medium">洞見圖鑑</div>
            <div className="fs-11 text-mute mt-0.5">
              {deckComplete ? "已經收集完成，開始新的一輪循環 ✦" : `已收集 ${collectedCount} / ${deckSize} 張`}
            </div>
          </div>
          <ChevronRight size={16} className="text-mute2" />
        </button>

        <button
          onClick={() => setShowSearch(true)}
          className="w-full mt-3 border border-line rounded-2xl px-4 py-3 flex items-center justify-between text-left"
        >
          <div>
            <div className="fs-13 font-medium">搜尋日記</div>
            <div className="fs-11 text-mute mt-0.5">找回以前寫過的字句與那一天</div>
          </div>
          <ChevronRight size={16} className="text-mute2" />
        </button>

        <button
          onClick={openRandomDay}
          className="w-full mt-3 border border-line rounded-2xl px-4 py-3 flex items-center justify-between text-left"
        >
          <div>
            <div className="fs-13 font-medium">翻到過去的某一天</div>
            <div className="fs-11 text-mute mt-0.5">隨機重溫一個被遺忘的日子</div>
          </div>
          <RotateCw size={16} className="text-mute2" />
        </button>

        <div className="w-full mt-6 space-y-4 text-left">
          <div className="border-t border-line pt-4">
            <SectionLabel>理想中的樣子</SectionLabel>
            <p className="text-sm leading-relaxed">{character.idealSelf || "尚未填寫"}</p>
          </div>
          <div className="border-t border-line pt-4">
            <SectionLabel>年度目標</SectionLabel>
            <p className="text-sm leading-relaxed">{character.yearGoal || "尚未填寫"}</p>
          </div>
          <div className="border-t border-line pt-4">
            <YearLetterSection yearLetter={yearLetter} setYearLetter={setYearLetter} yearGoal={character.yearGoal} />
          </div>
        </div>

        <button onClick={onEdit} className="mt-8 border border-ink rounded-full px-6 py-2 text-sm">編輯角色</button>
      </div>

      {showGallery && (
        <Modal onClose={() => setShowGallery(false)} width="max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-serif text-lg">洞見圖鑑</div>
              <button onClick={() => setShowGallery(false)}><X size={18} /></button>
            </div>
            <div className="fs-12 text-mute">
              {deckComplete ? "恭喜，已經集滿一輪洞見圖鑑！" : `已收集 ${collectedCount} / ${deckSize} 張，每張都不會重複出現，直到全部收集完成。`}
            </div>
            <div className="space-y-2">
              {collectedCards.length === 0 && <div className="text-center text-mute2 text-sm py-8">還沒有抽到任何洞見卡</div>}
              {collectedCards.map((c) => (
                <div key={c.word} className="border border-line rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-sm font-medium">{c.word}</div>
                    {collectedDates[c.word] && (
                      <div className="fs-10 text-mute2">{collectedDates[c.word]}</div>
                    )}
                  </div>
                  <div className="fs-12 text-brown mt-1 leading-relaxed">{c.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      {showSearch && (
        <DiarySearchModal
          daily={daily}
          onClose={() => setShowSearch(false)}
          onOpenDay={(ds) => { setShowSearch(false); onOpenDay && onOpenDay(ds); }}
        />
      )}

      {showAvatarEdit && (
        <AvatarEditModal
          tier={tier}
          character={character}
          onClose={() => setShowAvatarEdit(false)}
          onSave={(patch) => { setCharacter({ ...character, ...patch }); setShowAvatarEdit(false); }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   大頭照編輯：上傳自訂照片、調整上下顯示範圍，或還原成預設角色
---------------------------------------------------------------- */
function AvatarEditModal({ tier, character, onClose, onSave }) {
  const [photo, setPhoto] = useState(character.avatar || null);
  const [pos, setPos] = useState(character.avatarPos ?? 50);
  const fileRef = useRef(null);

  const pickPhoto = async (file) => {
    const url = await resizeImageToDataURL(file, 640);
    setPhoto(url);
    setPos(50);
  };

  return (
    <Modal onClose={onClose} width="max-w-sm">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="font-serif text-lg">大頭照</div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="flex justify-center">
          <TierAvatar tier={tier} size={180} photo={photo} photoPos={pos} />
        </div>

        {photo && (
          <div className="flex items-center gap-2">
            <span className="fs-10 text-mute2 shrink-0">上下位置</span>
            <input type="range" min="0" max="100" value={pos}
                   onChange={(e) => setPos(Number(e.target.value))}
                   className="flex-1 accent-ink" />
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden"
               onChange={(e) => e.target.files[0] && pickPhoto(e.target.files[0])} />

        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()} className="flex-1 border border-ink rounded-full py-2.5 fs-12 text-ink">
            {photo ? "更換照片" : "上傳照片"}
          </button>
          {photo && (
            <button onClick={() => { setPhoto(null); setPos(50); }} className="flex-1 border border-line rounded-full py-2.5 fs-12 text-mute">
              還原預設角色
            </button>
          )}
        </div>

        <p className="fs-10 text-mute2 leading-relaxed">
          {photo ? "拖曳「上下位置」可調整照片在圓框中顯示的部分。" : "不上傳的話，會使用原本的手繪角色當大頭。"}
        </p>

        <button onClick={() => onSave({ avatar: photo, avatarPos: pos })} className="w-full bg-ink text-paper rounded-full py-3 text-sm">
          儲存
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------
   日記搜尋
---------------------------------------------------------------- */
function DiarySearchModal({ daily, onClose, onOpenDay }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = Object.entries(daily)
    .filter(([, r]) => r && (r.journal || r.wheelPick || r.insightCard))
    .map(([ds, r]) => ({ ds, r }))
    .filter(({ r }) => {
      if (!query) return true;
      const hay = [r.journal, r.wheelPick, r.insightCard?.word, r.insightCard?.meaning]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(query);
    })
    .sort((a, b) => (a.ds < b.ds ? 1 : -1));

  const highlight = (text) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query);
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-tan text-brown2" style={{ borderRadius: 3, padding: "0 1px" }}>{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <Modal onClose={onClose} width="max-w-md">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-serif text-lg">搜尋日記</div>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="輸入關鍵字，例如「散步」「累」"
          className="w-full border border-line rounded-xl px-4 py-2.5 text-sm outline-none bg-paper"
          style={{ boxSizing: "border-box" }}
        />
        <div className="fs-11 text-mute2">{query ? `找到 ${results.length} 天` : `共 ${results.length} 天有紀錄`}</div>
        <div className="space-y-2" style={{ maxHeight: "52vh", overflowY: "auto" }}>
          {results.length === 0 && (
            <div className="text-center text-mute2 text-sm py-8">{query ? "沒有符合的日記" : "還沒有寫過日記"}</div>
          )}
          {results.map(({ ds, r }) => {
            const d = new Date(ds);
            const fs = computeFinalScore(r);
            return (
              <button key={ds} onClick={() => onOpenDay(ds)} className="block w-full text-left border border-line rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="fs-12 font-medium text-brown2">{d.getFullYear()} / {d.getMonth() + 1} / {d.getDate()}（{"日一二三四五六"[d.getDay()]}）</div>
                  {fs !== null && <div className="fs-11 text-mute2">{fs} 分</div>}
                </div>
                {r.insightCard?.word && <div className="fs-11 text-gold mt-1">關鍵字 · {highlight(r.insightCard.word)}</div>}
                {r.wheelPick && <div className="fs-11 text-mute mt-0.5">任務 · {highlight(r.wheelPick)}</div>}
                {r.journal && <div className="fs-12 text-brown mt-1 leading-relaxed" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{highlight(r.journal)}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------
   設定 Modal
---------------------------------------------------------------- */
function TimeSelect({ value, onChange }) {
  const [h = "08", m = "00"] = (value || "08:00").split(":");
  const hours = Array.from({ length: 24 }, (_, i) => pad(i));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
  const selStyle = { flex: 1, minWidth: 0, boxSizing: "border-box", WebkitAppearance: "none", appearance: "none", textAlign: "center", textAlignLast: "center" };
  const selClass = "border border-line rounded-xl px-2 py-2.5 text-sm outline-none bg-paper";
  return (
    <div className="flex items-center gap-2" style={{ width: "100%" }}>
      <select value={h} onChange={(e) => onChange(`${e.target.value}:${minutes.includes(m) ? m : "00"}`)} className={selClass} style={selStyle}>
        {hours.map((hh) => <option key={hh} value={hh}>{hh} 時</option>)}
      </select>
      <span className="text-mute">:</span>
      <select value={minutes.includes(m) ? m : "00"} onChange={(e) => onChange(`${h}:${e.target.value}`)} className={selClass} style={selStyle}>
        {minutes.map((mm) => <option key={mm} value={mm}>{mm} 分</option>)}
      </select>
    </div>
  );
}

function SettingsModal({ settings, setSettings, onClose }) {
  const [form, setForm] = useState(settings);
  const [msg, setMsg] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");
  const importRef = useRef(null);

  const ALL_KEYS = [K_CHAR, K_SETTINGS, K_TODOS, K_DAILY, K_POSTCARDS, K_LETTERS, K_YEARLETTER, K_GENTLE];

  const exportData = async () => {
    const bundle = { _app: "Lumi", _version: 2, _exportedAt: new Date().toISOString(), data: {}, photos: {} };
    ALL_KEYS.forEach((k) => {
      const raw = localStorage.getItem(k);
      if (raw !== null) bundle.data[k] = raw;
    });
    try { bundle.photos = await idbAll(); } catch {}
    const blob = new Blob([JSON.stringify(bundle)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    a.href = url;
    a.download = `lumi-backup-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("已匯出備份檔（含照片）");
    setTimeout(() => setMsg(""), 2500);
  };

  const importData = async (file) => {
    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      if (!bundle || bundle._app !== "Lumi" || !bundle.data) throw new Error("格式不符");
      Object.entries(bundle.data).forEach(([k, v]) => {
        if (ALL_KEYS.includes(k)) localStorage.setItem(k, v);
      });
      // 還原照片到 IndexedDB
      if (bundle.photos) {
        for (const [id, dataUrl] of Object.entries(bundle.photos)) {
          try { await idbPut(id, dataUrl); } catch {}
        }
      }
      setMsg("匯入成功，即將重新載入…");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setMsg("匯入失敗：檔案格式不正確");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6 space-y-6" style={{ maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
        <div className="font-serif text-lg">設定</div>

        <div>
          <SectionLabel>提醒通知</SectionLabel>
          <button
            onClick={async () => {
              if (form.notifyEnabled) {
                setForm({ ...form, notifyEnabled: false });
                return;
              }
              if (!("Notification" in window)) {
                setNotifyMsg("這個瀏覽器不支援通知");
                setTimeout(() => setNotifyMsg(""), 3000);
                return;
              }
              const perm = await Notification.requestPermission();
              if (perm === "granted") {
                setForm({ ...form, notifyEnabled: true });
                new Notification("Lumi", { body: "通知已開啟，我會在設定的時間提醒你 ✦" });
              } else {
                setNotifyMsg("通知權限被拒絕，請到手機設定開啟");
                setTimeout(() => setNotifyMsg(""), 3500);
              }
            }}
            className={`w-full rounded-xl py-3 fs-13 border ${form.notifyEnabled ? "bg-ink text-white border-ink" : "border-line text-mute"}`}
          >
            {form.notifyEnabled ? "已開啟提醒通知" : "開啟提醒通知"}
          </button>
          {notifyMsg && <p className="fs-11 text-mute2 mt-2">{notifyMsg}</p>}
          <p className="fs-10 text-mute2 mt-2 leading-relaxed">開啟後，到下方設定的時間會跳出系統通知。注意：此提醒只在 App 開著（或在背景執行）時有效，完全關閉 App 後無法定時提醒。</p>
        </div>

        <div>
          <SectionLabel>洞見卡通知時間</SectionLabel>
          <TimeSelect value={form.cardTime} onChange={(v) => setForm({ ...form, cardTime: v })} />
        </div>
        <div>
          <SectionLabel>每日打分通知時間</SectionLabel>
          <TimeSelect value={form.scoreTime} onChange={(v) => setForm({ ...form, scoreTime: v })} />
        </div>
        <div>
          <SectionLabel>背景音樂</SectionLabel>
          <select
            value={form.musicStyle || "piano"}
            onChange={(e) => setForm({ ...form, musicStyle: e.target.value })}
            className="border border-line rounded-xl px-4 py-2.5 text-sm outline-none bg-paper"
            style={{ width: "100%", minWidth: 0, boxSizing: "border-box", WebkitAppearance: "none", appearance: "none" }}
          >
            {MUSIC_STYLES.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          <p className="fs-10 text-mute2 mt-1">開啟 App 後第一次觸碰畫面即自動播放</p>
        </div>

        <div>
          <SectionLabel>資料備份</SectionLabel>
          <div className="flex gap-2">
            <button onClick={exportData} className="flex-1 border border-ink rounded-full py-2.5 fs-12 text-ink">匯出備份</button>
            <button onClick={() => importRef.current?.click()} className="flex-1 border border-line rounded-full py-2.5 fs-12 text-mute">匯入還原</button>
          </div>
          <input ref={importRef} type="file" accept="application/json,.json" className="hidden"
                 onChange={(e) => e.target.files[0] && importData(e.target.files[0])} />
          <p className="fs-10 text-mute2 mt-2 leading-relaxed">資料只存在這支手機的瀏覽器裡。換手機、清除快取前，記得先「匯出備份」存成檔案，之後就能「匯入還原」。</p>
        </div>

        {msg && <div className="bg-ink text-paper fs-12 rounded-xl px-4 py-2.5 text-center">{msg}</div>}

        <p className="fs-11 text-mute2 leading-relaxed">此原型會保存你設定的時間，但預覽環境無法真正推播系統通知；正式上架後這裡會串接手機的推播提醒。</p>
        <button onClick={() => { setSettings(form); musicEngine.play(form.musicStyle || "piano"); onClose(); }} className="w-full bg-ink text-white rounded-full py-3 text-sm">儲存設定</button>
      </div>
    </Modal>
  );
}
