import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import {
  Home, CalendarDays, Mail, User, Settings, Plus, X, Check,
  Camera, RotateCw, Lock, Sparkles, ChevronLeft, ChevronRight, Trash2,
  Volume2, VolumeX,
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
const K_DAILY = "app-daily";
const K_POSTCARDS = "app-postcards";
const K_LETTERS = "app-letters";     // 週回顧信已讀狀態
const K_YEARLETTER = "app-yearletter"; // 給年底的自己
const K_GENTLE = "app-gentle";       // 低潮關心明信片

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

const COVER_SRC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUEBAQEAwUEBAQGBQUGCA0ICAcHCBALDAkNExAUExIQEhIUFx0ZFBYcFhISGiMaHB4fISEhFBkkJyQgJh0gISD/2wBDAQUGBggHCA8ICA8gFRIVICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAZrAvgDASIAAhEBAxEB/8QAHQABAQABBQEBAAAAAAAAAAAAAAEHAgQFBggDCf/EAFoQAAEDAwIEAwQGBAcLCAoCAwABAgMEBREGQQcSITETUWEIFCJxMoGRobHBFSNCUhYkM3KCorIXJTRDU1RiZZKz0Sdkc3R1g5PCGCY1N0Rjo9Lh8VWUlYTD/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAiEQEBAQACAwEBAAIDAAAAAAAAAREhMQISQVFhAxMicYH/2gAMAwEAAhEDEQA/APXoAOLoAAACblAAEAvqBsEAAhUXoA3AJgCghdgCAAAMkKA6k7FIA7jJdiAUgG+AAAADIwAL1JkDcCjYgAbAYGApsCjcInUZHoACgbgC+pAAKQFAEAAo7k7DsAALuBCgYAE9QqDsmAA6l79QBAUAATsAKQoAmQUbAQpO4AbgAAAPQAMgegAehUJsBexO4HYAO47gABsAGQAAAGAAA3CgGwCAACg+sAIAAKoyAECFAAhRsABE7FAEKpAA7AACkKABMDAFJuUBQAgQKTYAUhSAAAAQdgXHQKAhQiAFCoC7k7qECk3AAuQQBvkAABuOgAuCF3IBSbgAUEABewGwAoIAKMgACKUm4FIBuAA3HkAKQbgUmxSYApANwAAADcdgACAANgABdibAANh6jYAANwAGcAdwAAAAAKAAIAAKD0AApB8goQ7AYBFAoKVEAXuABSdgACBS7ARQNh2AdikXsXYCegAAAF9AGepBsAq7EKQIAblAgAAAYG4AAAAEAFJ3KQCjcg7AF7AbAAAAA3G4AYA6lAhSegwBU8yDYbACkAFyCdxsBQM7EApAAq7E3ACG5SBfMANgABTSUAo2GAAGw9QAGwADCgDAADYBQAABsAEAAAA7jYKAbDuoQAABABuAAAAABQABAAoEABFXcEBUCkCAUgUAPUAeYAKVCKA2BSAEKTBQAIUCAoCgJuAgCkAAbgC9iFAEA9AA3GwGwAAAUgygAAABhRsABSBQBQE3CARQAAAHoAAADYAABsB3ADIG4ADyG+QogUdwA2AG4QwAFAAAABgbgAAFAAEAAAAAAAAACAUABTIACAAAD1GwAAAAAAAA3AFIAAAIKTcbgoFIncdQCjcZ6DYCkAAAAAC5AE2AAAFJgAFAAbgbgBsMgbgAPUZAF8iFRQJ1yEG4ADcAAB3AAYA9ACgAKADYIADIF2IPUbgAFAEKCAUAAAAAAAAbjcAMAAKADsAAHkACgBAD1AADYAAABSZAAFIAoAMBADcAB0A8wAAwAG4AUGAAgBsAA7ABQegAAABF7kG5QIACKDuNwVAAdgAKT0AADcKbAYAQAAAAANwUgAKOwAYBUIAACAMjuAAG4AAAeYAABQIFAQIUAAAAAADcAbBQABD1BCgAQoUwQpABSFAE9SgABkAAAA3AAAAACkADYD1G4QGw2HoAAAAABUBQAAwACADcIAAAAAoAQCjYbAB6AAIAAABkAAAFAUm4QABFAAVAABQAeoQG49QA9QAAHcDsAAADcAJ2AAACkGwAAAAOoyAA3ACqQAIAAAAOwAhQFBsAAAHqBCjYAAB5hEBQAAABQAAAQBQEKABABSAuwEAAAoIBQAgAAAAAAAAQAAUAAQAAUAGQAACG4A/IKAAAAABCgCFAAAAAEACCgAKAeQAADYIAKAA2HcYAADYABsAAACiBQNgAAAd1A2H1BDqVSAAAAIUACkAAAAAAAHoAMAAAFAAEEGwwAoNgAh1AAADceYD0A2GwAAKAwAAAA6AAAAAAUACgQpNwBQQAUhVAAIAABCgBsAECFAVCgeQADcgFICgNgAgAYG4AAAAAAAA2CAA3AKAABNykCqgAIGwAKgUgApAMAAPQbAUgUAAAAAKBABuA2AwPUKZAG4QAAAABQbEKAAADAHoAhsAAAA3Cm4ACAA9QA9AAoAAgAAHcABVwTcD1CCgAABsAAACgAAAAIbkACqAQCgAAAQIAo2AhdgAAA2AD5gbgNgB6gB5gBQAdwgQoAAbAAAAoUg2CGQFAAbgBUBQBAUEDYAFAbgBDuB2G4AbAAPIdh3UAPQBR2ADYJ0KBApRsBAFGQG4G4AABQGwG47gAAAGwAAAAANgAAyMgAAAA3G4DA7KAAAHcAAAAAAY8gABUJuAAG43AAhQAAAEKB6AAQpFANyAUEKVDYAAAAAAAApAFBsAEMjZRgoEAQoE3AGwDqANgA7AKAA2AUAG4Q3AAUGQAgCkAbgbAKbAAID1AAbAACFAApM9AAGAXoTYB6lHZAA2IUAQAAB2AAAABuAAAA9QGxSeoAKAAG49RsNgGANhuAAKBNwCgQDcANiFABAAAQAAAAAGAAAAAAYHcAAAAAAhRsFAegA3CgAAAhQAUAAAAGwAUIADYAg3AxlQAGRgAAAHcAd1AAAB5DBQBMgbgANwPUKDcbDcIpEAAAAigG43KgAAA2AAAAKAbBAhuEAAAAAAAAA9AAATsFNwCAXAAABAAgNikAAbhQAAAAeoAAAACk9QHoAAAG4AAAAAAAAAAKAGwG42AAAAAoUBuAAA2AAhSFCgACIUbACF6ABTcAeoADA9AA9QAh3HUABsNwAAGxAKAAHYAbABnoBkAAPUAO6geYFIAgFJuPmNgG4AIooAXYqAyB6AEQFJ5AAPUAAAAAAU6gBAh2UAANgAoD1HoAAA9RsFABsEMDYdgAG4AADYAABsAA2AUBSBBRsMgANwNwp5AeYAINwEADYbjYID1AAAIAA7AdwATuOw7gAAAUBAAAAAAoE2AG4UCgBAbDA3Aeo7jcbABsECdgA7BAAAAFIAAAG4AAABgDIABO4AbAAKADsgQG+AMgAFUoEBQRQg3KVEL2BNgHcbAAUgADYKEGwAAKFB6DcBAAAUgHqAHZQF+4BsDZ3K62yz0y1N2uVLboE/xlVM2Jv8AWVDpU/G3hJTVD6ebiFZUkYvK5En5kRfmiYGGsgg6vZuI2gdQuRlk1nZq56ryoyOrYjlX0RVRTtGUwi+fb1LhoCZKRUBQAAAQAAUAAQKTzAAbABQpAEOwG4CgACA2Gw2AbgAABkAAnYbgKbDsBvkIApEAAAAAAAG43AdgAA2CAdgpkABADcAANhuAG4HcKYBSL5hFJsB5gEAGQAG4UBuAFAbl2JsMgBsPUbhQbABAdkBQAJ2QBTYF2AEG5SbhFX0AAEGwAAYLuTcABnIAeQ2A3AAIAonkFGUQvRUCJ3U1Y6Ghei90IszIo3yyyNjYxquc9y4RqImVVV2REA2N5u9ssFpqbtea+GgoKVniTVE7uVjE9V/Luph6LVnEvi3lOHkX8DdJK7H8IbjFzVVY3PVaeFfop/pKbG10k/H3WMmpbwxycNbJVLFabe7KNu9Qzo6olTeNFyiJ9XmZ9hYyKFkcbUYxjUa1rUREaidkRE7J6F4lTtie1+z7oGGpSu1Myv1jc1XmfV3yqdMiu80jReVDuVPw90JSQpDTaMscUbezUoI/zQ7TuUztXHQr1wc4XX6NUuOh7Ur1THiwQ+A9Pk5mFQ6PPwt17oFza7hLrSpqaKJcu05f5Vmp5W7tZKvVi+WcfMzqaVTPQvtUxjXh/wAWLdq661GmLzbajTOsKNM1FmrV+J6J3fC7/GN+8yYqdDo3ELhraNe2yKR8r7ZfaBfFtt4p/hno5E6oqOTqrM92nH8Ldd3LUFPctKawhbR61089IbjE3o2pYv0KmPza9O+Oy/M1nGjI4InVehdjKoUAAPMIAAUZAUAAQAGAKQAKADsA9AFAQwUmwAAeoAegACgIXPUIADuFQoAQCgbgANwAG4AAFIAG48wAAAAL3G47hQbAJ3CGwUFAgKAICkAbgDYKAD0CAGwAeoGwAYAKBB6AbhQDcBAABQAEDcoJkqL3BCgQfMF2Am4BQIgAyA2CIAAKiZUbHGX29UOndP3C+3OTw6Kgp31Mzk78rUzhPVeyfMDhdea/03w9srLlf6l/iTu8OloqdviVFXJ+5Gzf59kMf0l94/ayzVWbTtj0JbJEzC69K6pq3Jno5Y29G9NlQ+vCbTNZqutXjLren8S+XVOa00sqZZaqLP6trEXs9ydVd36+pmVW4dlNy3jpO2JH2P2h6GJ1RDrjSd3ejVX3artb4GuXyRzV6HRtZ674nXq0R8LrxoGq07f9Rzx0DLnRzePRvp3KnjOY/wDZXkz0XbJ6Yz0wp80YiORcdlyPYxs7JZbdp7TtBYrVA2CgoYWwQRtTGGtTH2r3+s36FzkhmrAKE3GSKduoHoUC5whhHjLTP0dqDT3GS1RKktonZQXdjP8A4igldyrzefI5UVPmnkZtU4y+WK1alsdZYr3SNrLdWx+FPC5VRHtyi906p1RCypY2tPqzScjkazVFpcq45W++x8y57dMnOK5q8qoqK1yZRU7L8lMcf3BeDzqX3ZeH1pRuMcyMdz/7Wc5OkXzQGtOE8cupOEt4rbnaabMtXpS5TOnjljTq7wHr8TXIm3f59jWTE2s+g6zoLWtn4gaKodT2VzkgqUVskMn06eVOj43eqL9qYU7MRQbjYBQAbAANgENwAAAADsAAp6hBsAhkBO4ADYAKAAIIBsNgAGR6gAAAAAAeg9QFAAENgAAAyAABAqgAANgAgUgyAQu5ABQQbhQFIEUE3ADAHqAHUDPUAAvYAAAAAG4ABSkCgAApEKQIDcpABSKABSAAEAAblUiHUuIeuaDh/pKS8VMD62smkbTUFBF/KVlQ7oyNv4quyCDsNzu9rstvkuN5uNNbqKNMvnqZUjYn1qed+MfFnRWt9Eu0Lo69yXWtvNwpaKR1NTSLH4Sypz4kxyrtudp05wjrNRVkeruM1Qmor5IviQ2lzl9wtiL1SNsadHOTdV+/uZkpKC300DIaahpoI48crI4WtRuO2EROhrZ0zytHTRUNLFR07EjhgY2JjU7I1qcqJ9iH3UKmHF7mGkwVQCKhSAAN+gHYC5J2KhALsE6LkIAGVyaXNVUyi9dlNQCMGaFp2aL9pLW2jqRGxWq90UWoKWBvRscmeWTHlnr9xnPHTJijW/DjWF34lUWuNF6ypNPVsFsW3P8AeKD3nnar+bdcHE1epeO2g2LWam09atdWSNvNNUWJFgq4m7u8J3R2E2RPrOmbyzuM1ooOsaI1xpvX+n2XvTVelTT83JLG5OWWnfuyRndrvuXY7QqYMtIAEAAAAAoAAbgKhQAh5jYDYAAMBQbgAAAAA9AA3KRAgQAG4DIACgBNgKBsQCjYZAAELuA3A3IAKAEAAFAEAQAADuAAAAAAAKADsEAOuQAUAAATcBVGAXcIAAKbgAiABCgCk7gABsA2AAAbAAM4TJhaiRNd+0/c6iod41q0DSsp6aJzfh9+mTL5PVWt6ZM1J9JPmn4mFOBXN/CXisk3SpTVUqvRe/LyfD9RYlZsc1DS3oazTjuZVeqkQqEIqgIRQHoXugAE9S7EwUAFACAAyAIXsECqmNzTJ1TCbdvQpFLvxGB+I9gn4X6mZxo0fAsNM2RkWprbCmI6ymc7Czo1OiPaq5Vfr885xo6ynuFDBXUkqS09RG2WKROz2OTKL9im11Da4b3pS62aeNkkVdSS07mv7LzMVOv14MdezxWVNZwE042sl8SajSeiV3pFK5iJ9iGvjP1lUbhRvgjYAAgANgAAAdwAFAAEB6AAAAFBsQuwAbAYAAAIADYB2AAUICgQFIAHqNygAPUAAQERQNgVQAAEAIBRuAABCgAQoAAegADcBADIyA2AAAbgIFCkKEAvoCBQAEAAFQKQoE2HcDsAAAUA3AQVOioYJvVd/cj4+VOqLlzRaN1syOGrq0b+roa9iYa5/k1yb/PyM7HH3qzWvUFkqrNeqCGvoKpnJNTzN5mvT/j5KnVCy4ljfRSNlRr2Oa5j0RzXNXKOReyou6H1emEyYTo+GPELQuYeF+vWOtCL+rsmo4lqIoU/djlb8TUN669e0Uqti/gXot2yzLc5Ub88dx68GsutUm55z1he+M+if4P631jqe1sskF3ghuFps1OqRRwSZarpJXfE/C7dj0XCrZI0exyPYqZa5OzkXqi/YSxdai7kVSmVRQX0IBQO4yAyCKXIDsRQFAvcBCliNKqMdDS52HEqammoqCWtq6iKnpoWq+WaV6NYxqd1VV6Igk2muC1tqOl0poC+6jq5Wxx0FHJKiu7K/lVGN9cuVEOrcDrLUWHghpikrGqyqnp3VszVTCo+Z6yKip/SOh1dxl9oPWlNZrMyVvDOyVTaivuDmq1LxUMXLIY8940Xqq/X5HoTkYxrWMajWtTCIiYRE8kNfEnYACNAAAegA3AAbgIbAAKAAIbj1HoAoQowABBkCgAAUgyEAMFAgG5AqgAIdQCBV3ICgBsQpECFQBQegBQBC9wGAoAADYeoQAAAeoAAAbBQBenQeoQBSANxuNxgBuAAAHYoVNgAAAAFIgGQikAAbgbgKbgvQnqEAEADsQFAidDXzGkgHD6k09bdVabuOnbxD41BcIXQTNTvhezk9UXCp6oYr4ea0rdA3KDhHxNqEpK2lTw7Jepl5ae7UyLhjedejZWphML3xjv3zaidcnC6p0rp3WVjksuprTT3OheufDmb1Y795q92u9ULOErl3Ow/59vU+qL0MLR8Jdcaad4fD3i3c7fQMRfDt15gbXxR+TWuXDkQ3LtHcdLjG6C6cYLfQQO6OW1WVrZcb4c5ei+oniWsw4+o09lMCWrX2oeD97TSnFmoqrnpyaVf0Vq9WK9OVVz4VVj6LkzjP4p1TONDcaC7UUVwtdbBX0cqI6OemkSRjkXdFQln0jdDYKqYCL07mWl7oT5Iba4XCitVBLX3KsgoaSJOaSeokSNjU81VehhW5cRNQ8VK6bS3B10tPbGu5Ljq+Rishp256spkXq969s//ALNSazrOYVcIYXSo4+6JVaZLbauJNqiT9VUJOlHcFamz0X4XO9Uzk0TcTeMVenu9m4DVtLUuTpLc7lGyFvzxjP2j1NZXvt+tWmtP1l9vdbHRW+jjWSad69Gp5J5qvZE3Uwhpi5cfNc09XrrTd8tNns1zqHLbbNeqRXctM3oyTmamUV3VfvOToOFOr9b3emvvGq+09fTUr/GpdM23LaGJ2yyr/jFTy+/BmyJrYomxsajWtRGta1MIiJ2RE2QvR2w+93tKVCugSHQFEqphKlJJ5Fb6o3HX5KH8Gb3qyaOo4t69rdTQMcj22ihj9yocp+81vxP+szHjrk15+HBZTHHWy3UFooILbbKOGio6ZiMhggYjGRt8kRDfKuVNOCoYaUDsNiggACHYAbgABuAUAgFUbDuNgGQO4AAAAQoCgAAAAIAAAAAICgKEKAIXcAAQoAgKAIBuXcCFA2AAbBQgAAAGw9QAACgACAAAAeg3AAbAAB3G4UBQEQABQAEAdwCoBQFAbgpAA2AAbhQACjZBuAGwAABewHoFEIvXoakQmeoRtKugorjRzUFxpIauknTlkhnYj2PTyVF6KYjrPZ8slvuT7lw81Pe9C1T1Vzo7dOr6dyr5xO6IZnxuUsuJeWFXaY9oy2RtitvEzTt5YnRHXO1rG9E81Vucqao9O+0hXsdHcOI2mLQztzW+2Olcqbr8WMKZoGemBpjDFNwCtVzro7hxG1Xe9d1Mao5sNwm8OlavpEzov1mXKCgorXQRUFupIaOkhbyxQQMRjGJ5I1OiG63KpLVwTGCKjVTsn2AdgCjsAFNy4IXIRpU1J2CtIvwpkAoCfEF6KAAAABAFNgAAAADuAiAAAAA2HcAAMAIAAAAF7ACkAAdgFAAAKhQAGw3CEzgCqNgi8yjPXAAZGB6gQoGAIVB2AADIQAFBQibAeg2AAAB2QeQGwADcAAAA7AAANwNgKCblAEBQICgip5AAqAH5AAAgAbAF9AIAAHqAOgABe4AAYAAbjYAUDOwADcACKUEAAAABuUCbnBar1ZY9Faek1BqKqfTW+J7I3PZE6ReZ64anK3r3OdOJ1Dp2yapsr7RqC2w3Kge5r3QTZ5Vc1covRUXKKBjlfaR4T4/9s1v/APjpf+Bt6j2mOE0aYW63BflbpDfTez1wkq+iaW93Vd4KuVv5qeCbxHHDdayniRUjiqJY2Iq5w1r3In3Ih04sY5j3JD7TXCVc/wB9Lj9dukNS+0xwldJj9LXD/wDx0h4NYvIxVyezuGXArhnfOGum9Q3ewSVddXUMc8zn1ciNc5c5XlRehmySLLayLpLjPoHXGpG6f09caqevdE+dGS0b4k5W/S+Jem5kZTp+m+GWgtJXJLnpzS9Hbq1I1iSdnO5/KvdMuVe528lagACKbEKAgAXAVAAEUEAAAoEAAAABQFAQIpQBBuAoDIAAAAAdd1xq226G0VctUXVHPp6KPmSNi/FK9VwxieqrhDsZhn2mbRXXXgXcH0LHSe4VMNZMxqZVYmqqOX6s5+oSaWvNt19o/ind7o+qpL4yy06OzHSUULFYxPJXORVcvr0Mx8E/aBuWrNTQ6P1o2B1wqUX3KvhYkaTPRMrHI1OiKqZw5O+MKeOoF6qucmROCdluF9436Zit8bl9zq21s707RRR9XKvlsnzU6WTGNfopnKZKaW7+pqObobjYDsBAUAAQu4FBAEXcgAAdQAAUAAOoGwAAAAAFAOgCC+Y+YAD1KQoAABWku4AQA7gAB3AAbD0KgE2HcpMgFGw2yAKAACkAyAAAApAAAGQACgAAAAAABewUd0ARNw7J+Wl7X/1guXpWT/71x+prVwqH5YXjrf7mq/55P/vXG/FnybJerVT0P0f4PNT+4ho5P9WRfmfnAi9/kp+kHB1c8EtHf9lxfmXy6SO9J0TAC9Qc2wABQDJqTHLkI09imlF5s46mpiOVVy1U+oABjCkXoBSE5sqVPpYAFD0VvdFT6iAFBUTJHrhAA7BnVOnVSfFzYVANWwKvRDQ1Vzleiea9ANQCZcvw4d/NXJpReuARqGOuQ5cGpiK5OnUDQNzQr0STlc5qL5KqIa8ORUynRdwAC9yogA+czY5YXwysbIx7Va5rkyjkXoqKi90Ppvg0d1wQYSuvswcMbncZK6nhuNpSR3M6noqhEiz/AKLXIvL8kU79obh1pHh7SS0mmLUlM6fHj1Ej1kmmx25nrt6JhDuL1RrOh80Y5MO5VwW34SR9FQF7oQAQoCg2BAighQoAgCAAQAFAAAACkGwAbghQoQFAAAAANgKFUmwCAACgAAAAAAAgAAAAADAAD1KQANwB2AIAAAA+QU9BnqBsAAChFIoADYAABgZKAT6SfM/LO7pjUF0/65P/AL1x+piL8TfmflpekxqC6f8AXJ/96434s1xzuy/I/R/g5/7kNG/9lxfmfnA/svyP0f4N/wDuQ0b/ANlxfmPIjvnqCkMNg3yEAHEanqb1RaTulXpyhZX3iGne+jpn9GyyonwtXqnf5nlzUfFX2kLbTSy1+m5bLDGiq+SGzq9jUTuqvy5Mep66VPhOu67crOGGqVRVTFpq/wDcuL4s14Kr+NfFW4q5KnXVza1f2YHMhT+q1DccMtY6sn4zaUkqNS3WpfLc4Yn+NWSSI5jlw5qo5yoqKmdjGi45W48kO88HYVn44aNjRM/3zjX7GuX8jbD9JH/SXHmdd1lebnYNF3S82azSXq4UkPiQUMfNzTu5kTlTlRV7Kq9PI7D5nyei56HOukePr97R/F2ke9smj6TTrU6ZqaGZ6t+uTCGPLxx74s3Jqtk1lU0zV7to4o4fvRqr957D44qq8AtYZVV/iO6/6bT86pHZVcnSMV6G9nHWOrL5xvZT3fUlzuEEtuqFkjqqp8rXcuFb0cuEVF3Q9pp2PDHsrxZ428/7trqF+9qHudV2M+TUdO19xM0rw1ttLW6lnqG++PdHTw08KyPlc1MqidkTCbqpgTUXtcve1zNK6ORvflnuc+fr5Gfmp6L1NpDTOsKaCl1NYqS7RU7lfE2pYq+G5UwqoqKip0POvtDcLdB6O4aw3rTOnIbXWrcIYFfDJIqKxyOymHOVNkHjlS6w7qLj3xU1FzxT6omt9O7p4FtYlM37U+L7zMvsl3251dVq2iuNyqamJjIKpEqJnSI1yq5HOy5Vx0Tr8jyb3dkyHw3oNc6hqLro7RDVYt7hjjuE+eRsNO12V5n/ALLVVcLjq7snc0jOXFj2nVoqmex8OnQvWNVjlvMrUe1XdlSBq9F/nr08kU81XTVGpdQVa1d/vtxuEj+vNVTvVPqTo1PkiHuPh1wI0VoWmhqZqOK+XpEy+vrIkcjF8oo1yjE+1fUyJetPWPUNnms97tVNX0MzVa6KWNFwnmi92r5KnVCbFx+adt1FfrFWsqrLeq+3TMXKOpqh7PuRcL9aHqbgbx+uGpr5DozW8sclynTFDcUajFqHImfCkROnOqIuHJ3xjB5v4kaTXQvEa9aX8R0sVFN+okf9J8TkRzFX1wuF9UU6jT1lVQ3Gnr6KZ0NTTSNmikavVj2rlqp8lQtmpr9JOJHEjTvDXS6Xi+SOkmmVWUlFCqeLVPROzc9kTdy9EPHWqeP3ETWk0sdLdJLHQKq8tFalVrkT/TkT43L9iGR9H8OdQcer8vErifLNTWWREZQW+Fys8aNNmr3ZFnKqvd652wendP6Z07pe2ModPWSitdOxOVG00KNVfmvdy+qqqkmRe35iT1tZU1zpamrqJps/E6WV7nZ9VVcncdK8Ttc6NrY57JqOsZEzvSzyLNA9PJWOVUx8sKeteOvCuzat0VcdQUVvhg1Da4XVUVRExGunY1Mvjfj6SK3Koq9UVDwq56d07KmULLqWY/Q/hRxQt/E/Sq3GKJtHc6NyQ19GjspG9Uyjmrux3XHlhU2MiIeC/Zm1HLZuNlJblkVKa9wSUcjc9Fcic8a/PKL9p70anwp5mLMrUvDhdU6psei9N1OodRVa0tvp1a18iRq9cuXDURE6qqqYBvftcacglfFpzS1wuLkXDZayRtOxfXlTmceiL3ZrTqC0zWq926nuNDNjxKeoZzMdhcplPRTC3EfgrwwtvDnUt7t2kKWiuFHb5aiGWCSRvI9qZReXmx9wmF1hLU3tOcTLtzR2yahsEDuyUcHPIn9N+fwOA4d6r1Xf+NekJrrqO6V0zrnG1yzVb3JyrnKYzy4XywYwcvM1F9EU75wXTn44aPb/AKxb/Zcbxl+jG31qCJ2Kc2wAACJ2KAqbgpAKNxuAHqAAgg7gAB6ABUL6ggFGwAEKAAIUKECBQBQAFAAQFA3BUCFIFUhSAUIQAUABAAAAAAHzHoAAACgUAACF2AAdhkABgZAeoGwAbF2IAg36bfmflvfUxqK6J/zyf/euP1Jb/KN+Z+W1/wCmo7p/12f/AHrjfiz5OLXqi/JT9IuDqY4JaNT/AFXF+Z+b6JlF+Sn6QcH/AP3KaO/7Li/Mvl0R3sg3CHNoCdykXoBq2Op8R5kg4U6tkcvwttFV/unHa1XodL4q5/uO6xVP/wCIqf8AdqB+asaqrG/JDJXAxiLx40fn/P8AP/03mNYkxGnyMmcDV/5dtHJ/z/8A/wCTzq5v0SXoqkxkKuVKhydGN+Or0ZwC1kq/5jj7ZGn51r3P0L9oF/J7P+rlTelYn/1Wn564z1N+PTFZ69lXH92SX/sqf+009v7nh32V3/8ALRKn+qZ/7TT3EnUnk14oidUMD+1e/wD5GIU/1tTp9zjPS9EyYB9qtObgzB/2vT/g4k7L08SNTc9H+yS7m11qZPK2xf7084r0PRvsipza81P/ANmxf703emZ29ls6FXvknYKvQ5tvDXtVxxxcbWyMTDp7VTvf6qjnt/AwWxnM5DO/tWtVeNFMv+qIP7bzBUfRx0nTD9E+CD3zcBtHue5VVKFG5XyR7kT7kQyKq9DHHApUXgFpD/qa/wC8eZGXqYvbUbO5RMms1dDImWSU8rXJ5orHH5ZyriRzU7Iqp95+p9evLbKr/oZP7Cn5XOXmkev+k78VNePSeTufCh7oOMujpmLhW3WBOnqqofpU/COVPVT80+Fv/vc0j/2tT/2j9K3r+sd81J5EaO50/ihGjuEGr2r2W01H9k7lg6jxP68I9Xf9k1H9gzO2q/NKJ3NExf8ART8DI/BPpx00avnXp/YcY4hTELP5qfgZF4Luxxz0an+sE/sOOlc4/RNq5ahTSz6CGs5OqFIALuACogBQpkABAepChQAAAMkAo2AAgGeoAAoCHYKAQQpCgQoBVAAAAAQAAAYACmxCjYANgAGwQAAAAgAO4AAAAAFAoAQUhe4CoCgANwgADcAI1MT4kX1Pyyvrs6kuv/XZ/wDeuP1OauMfM/K689dR3Vf+ez/71xvxZraN+i75Kfo/we68FNHf9lxfmfm+i4ynofpDwfT/AJFNHL/quL8x5dEd63IoUKYaVO+TCGrPaR0ppfWldpeax3WsnoalKV88CxpGr+mcZXPTOPqM1z1EVFRz1k7kbFTxuleq7I1Mr+B+Y9fc5L9qye7yrmSvr1qV/py8yfcqGpOGbX6ctXJ1Pig1F4O6xT/U9V/u1O3I3lVfmdX4kRPqOE2roI0y99oqkRP+6VfyJFr8zscqJ8jIvA53/L3o5P8Any/7p5jrmRzWqnkd54NVTKPjro2ol+h+kmMX5ua5qfeqHRh+kDexV6Fa3lRUUjuqHJ0Yp9oXK+z/AKsT/m8f+9afn12P0G9oBM8AdWIv+Qj/AN60/PmTo5Tfj0z5ds5+yt141zf9kz/2mnuZvY8N+ymmeNUy/wCqZ/7TT3L2QnlOVnSO6oYG9qZueDMH/a1P/ZcZ49DBntU4ZwYgzvdaf8HE8ey9PDj+56T9kJv/AK6aod/q6L/enmty5U9J+yGq/wAONTJ/q2P/AHpusx7GVSbhxfU5tvEvtWt/5YaVf9UQf23mAFdjqZ+9q2RP7sVK3ytEH9t5gByZwh1c36H8BlzwB0ev/Ml/3rzJadzGvAdmOAGjk/5kv+8eZKOV7dJ02lx626p/6GT+wp+WHKqOd/Od+Kn6nXNP7zVyp393l/sOPy1eqIv1r+JvxZrtXDJ3Lxb0j/2tT/2j9LXJlzl9VPzP4Z5dxe0gif8A8tT/ANo/TF30l+ak8iNJ1HiYueE2rU/1TUf2DtucHUuJf/un1av+qqj+wZjV6fms1MRM/mp+B37gquePGjG/6wT+w46Cv0GfzU/A79wSTPHrRv8A19P7DjrXOP0XamGoaiJ0RCnJ0QFIRQpABQCFFAAQAwAAzgdl6miVzY2K97ka1EVVVVwiJ5qRWvGSL0MXS8U7jqO4VFp4U6cTU8lO9Y6i8VMq09sp3bokuMzKnkxPrNS6R4y3VGyXLi3SWVyZVYbJZY1Z8uaZXKuPqNZ+s6yf6jJiiazcdNPp4ts1tZNYxMXK0t4t/ucsieSSxfCi+WUN1pvixSVeooNKa0slVozUs3SGkr1R0FWv/wAidPhf8lwpL/Df1k7cGpUwaFChdxsRAqjsQoAAAAAA2ABBVJuF7AqKpAFAADsAA3GwAbD1HcAAoCgACA2Gw2AAAAAAGCFz1AUIXYACAEApAUU1ImUNJ0bijdeINp0nTzcOLOy53aSqayRj4kk8OLlXLsK5qZzhO/1FiV3dXYla31Py3vLU/T9zcm9ZP/vXHo2vvPtdVkvwWq5Urc//AA1HSM+9VUxhPwS4uzukml0Lc3yyOc9yqsWVcq5Vfp+ampMYt1jBOqr8j9IeD70/uI6P/wCzIvzPEcfA3i4irnQN0/8Ap/8A3mSLOvtVWCy0djtFmutNQUUSQwRe6UruRidkyqqq/WWkeykdnufRp5Gbc/a57+5XP/8AqUZ9HXb2t0auKG559KSjMzxa1mrjtqP+DnA/U1THL4dRVQJQwrvzSuRi4/oq5fqPz/tqotxpMdkmj/tIZp1dYfaZ1xaWWnU1hu1woo5kqGxLBTRoj0RURctVFXo5ftOs27ghxXhqqd8uhbk1rZWOcv6voiORV/bLGX6EuX43fM2tdTQ11BUUVQ3mhqI3QvRd2uRWr9ym5d9N3lkityhitx+W99slZp3UdzsNdGsdTbql9M9F/wBFcIvyVML9Z8LfU1FDcaa4UcqxVNLKyaKRP2Xtcjmr9qIe0uOXAiTXUy6q0osMWoGxpHUU0juRlc1v0V5v2ZETpleip37HkS56R1Tpyrkpb7p242+Ri4XxqZ6N+pyIrVT5KdJWLHuLRPH7QWq7NTvuV7pbHd+REqKSuf4SI/HVWPX4XNVe3XJvL/xz4X6dgkfUaspK+ZEy2mty+8yP9E5fhT61PAENou92nbTWy1VlfI5cIynpnyqq/UhnHhv7MGqr5Uw12skXTlqyjnU6Ki1cyeSNTpHnzXK+hLDWniBrnXPGXT9+utDRLZtD6dj94miVyqtRJzIjGvcnRz+ueVPhb3XK4PP8i5fg/Qbilpq12H2bdT6c07bG0lFT25Uip4GKq5R7VVenVzl7qvVVPBVLpvUddMiUun7pPnt4dFK7/wApYVmf2VE5eM0i/wCqp/7TT3E5yZPz/wBCWLjNovUDL9pPRV1StWF0K+8W5XMcxyoqoqOVvl5nqXhhqfjDfL3UU3ETQ8Fjt7KZZIquNORz5eZERnLzu7plfqM+SxlxqZUwN7WDk/uN0yf62p/7LjI3Em766smk4qrh/YY71dX1LY3wyM50ZEqLl+OZvZcb7nmDXVH7SfES2padQ6Mqlt7Zmztgp6WGJEe3OFzzqu67jxK88omex6Q9kleTXWp0/wBWRf70xrHwO4tI5c6BumP+6/8AvO1aO0b7QHD271Fy0voushmqokhmSeCGZr2I7mRMK/p18jVSPczV5lPoqYaYz4T3/ilev0jFxJ0pDZfAbGtNNHHyeMqqvMipzu7dDjuJ2p+NNq1J7jw90dBdLX7sx/vb4kkd4qqvM3CyNToiJtuYka1519qt+eNUCeVpg/tPMHRtyqZMway0Dx815qRb7qTRFfPW+E2BHRRQxNaxqqqIiI/1XqcL/cQ4tMamNA3RV/7v/wC83GXsrgaqJwD0gibUa/7x5kVq5U8i6Vrvad0bpyisVq0U6e3UTFZDBU0cTlRuVXHM2RF7qp6osFRc6nTdtq7zSNpLnLSxyVVO3okUqtRXMTqvZ2U7mPLtqdNzd1RlkrnL293l/wB24/K7m58/NfxPW2o9We1LdWVNJSaJWgppOeP+LUUblVi5T6T5F2XyMHw8DeLXddA3RP8Aw/8A7zcZrieGDeXi7pFy7Xan/tH6WSOTxHJ6qfnxb+EPGazXajutu0Nc4qyjmbPC9WxORr2rlFwr8KeiOGupfaErdbW+36+0q2Gxy+J7zWvpGRPjw1Vb1ZIqdXYT6JPJYz+1uUOm8UH8nCXV3/ZNQv8AUOa1VV3+36Lutbpe3suF6hp1dSUz0yksmyKmU9d0PLmqLx7U2prbW2mp0Y+noa2F0E0VNRQpzMcmFTmdIqoZkW15fa7miZ/NT8DI3BFEbx00c5f8/RP6jj5t4G8XEwn8ALphOn+L/wDvObsfCnjXpy+UN9tGibjBcKGVJoJFbC9GuRMdUV/XudGHvprsohrMA8PtU+0LVaxtlv1toyGGyTSObVVvurYnxN5VVF+GRU74TtuZ9Tsir0U5V0ighSKhSFKGwG4CAAwAND3tY1ZHKjWN7uVcInzXY6fxH1v/AAI05BLRW9brfbnUNoLVbmrhamod2yuzGp1cvl8zptHwUZqRGXTi5qC4asuknxPomVL6e302evhxRRqmUTtzKvXA/wC0ZhjqKepiV9NPHOjejliej8fPCqYh1dLW8UNe1HDG31U1Jpq0sZNqWqp3K19Q53WOha5O2U6vVNunz3k/s/cNERktht1dpiuiXmirbRcJopWO2X4nORfrQ7Pw90KzQWnKm3SXaa819bWS11bcZ2I2SpkevdyJ5NRE+ovA7HarbQWa1U1qtdHDRUNKxI4KeBiNZG1OyIiG+NOMFM7VaHNypwmqNIWDWmnp7FqO3sraKXqiL0fE/Z8bk6scmyoc9jKAn3VYr0HfL3p3VdVwr1fXPuFZS0/vllusv07lRouFa/zlj7O806mUo15jHvE3R181HJpy+aRqqCh1JYK/3imqK5rljWJzFbJG7l6qi9Fx6HBz3/jfo2Bblf8ATlh1haYk5qj+D6yQVcTE7ubFIqpJjyRUU33WemYFTqRThNL6ssWs9N0uoNO1qVdBUovK7HK5jk+kx7V6tci9FRTms5IsCkwAqghVADzAAAAgAKTuhUUAhFXIBCoo7AgFHYdyBVBCgBkEAvcAbAB1IUAAABCjYCFJuUIE9C7gKbgbAIm5qzhMGkL1UDRy5dnB91VFbg0Igz1B20cuM4NKM65wfVUCJ0Ir6IqcppcqKhEU07l1MaHMTHYrejcH0U0EVqROheyBOwUqImDVn4eVeqeS9UNBe6DTHz5URy8jUZ/NRE/A+jOiERCp3wP6NEiKrjVHzN7OVPkpVTqXYCSuc9MZX7SRtRGhSp2H0+NSr8KofFrcPyfU0gjV0RcmiROZUNWehO6gjUi4bg1c3Q0KM9Bpj58nx5wanpnBqRMkXuRVRPgRAqYToVOxF7KVHz5cofaNEahoTuas9cCFaJPi6FjaiIXA7EVra4+Ujcuzg1IvUqlR8lanMh9X4WPBpJnIVGtwayonQKREBM7FKIUEAoAAL2Otat17pLQ1BHWaovMNAky8sMPV806+UcbcucvyQ3erdR0OkdGXbU9yytLbad072ovV6onRqeqrhPrOh8LNDyL/AMpOt4G12tb2xJ3PmTmbbIXJmOnhRejERqplU6qqln6lcTp67P4k8erbqVun73RWDT1nmWjkutC6mSSrmkRqvYju/wCrToZtRuDSquV2Vcq/NTXsY3VzGlO5qXqaTVsFTsE8h3JuBdgo7ACYRTVnlb06L5kXoR3YaMI2ee2aA9ojUli99pbbZtSW6K+RxTStijiqkk8ORG8yoic6dcGaqeRk0LZontkjemWvYqOa5PRU6Kdb1Dw+0Tq+riq9T6Wt13qIY/CjlqouZzGZzhF8smO7tw0vPDFJtVcHqqqbTwfrq3SlRO6WlrY06u8HmVVjkRM4wvXt6G5zyz0zYDg9J6otestJ27Utne51HXReI1r0w6NezmOTZzVyi/I5siqCFCgHyCAAPMEDcAFQwQoCoAAij1BAKQu4ChC7EIgUgKAACgAILkbEKUAQoEwUAIYGC9du+xjmg4kOrdeXCytpKd1qpnqxKzxVarOXoqr0VHZXsiYJbgyMRDi/4RWTHS6U+U/0l/4GysWsbNfrtWW2hfMstMvwvfEqMnbu5juyoi9PMaOwr07kb1U4jVGoqHS9mbdLgyZ9OszIXeCiOc3m3xuiYPlT6nt08Mc8Mdc+KVqPY9KKTDkXqi9hvI59U6GjP2nU77xEslgZSOrKavVtRJycy06s5E3d8X0seSdTtTHtlhbLGvM17Uc1cYyiplBsI+uMtKjVOipryobxIrNL+40zqGlRrpqx9R4fgt5UVyuz0XqqIidDVR6/azWNxsF3bQsgp4VqIa2nn+CRqJnlVHb4XZV7Flg7oq4XAMdWLiPFUU9JLqN9DQOr5VbSsge570ZlUR0revInZM56qvYyIrkRvVUQzLqtZpT6WDVG5HN7odIodX3at4iXjTEFtpJGULHvjesjmufhG4avdMqru5Ud37Dudd0zqdupaOpldb5qCopJlp54JevK9PJdzsLRuiKhUTKBxqToUTGEJnc0TzRQQyTzytihjarnveuEaid1VTgYtY6dnoIq1txRlPI1H874noiN9V5cEtHYsZTJOZMnQdL69rLrcrnHd6SCit9O9Up52xzKs6ZXlVOipjCdVTzOSqte6YpL1Q2ue5tZNWqqRuVjmsaucIjlVExleiE9pg7YqZTKDt3OB1jqGTTGlZ7nBDHPUo9kUMUmcPe52MdOvbPY3trub7jbmLVRwU9wYie80sUySLA5eqNXdFwaHJd2mlEOgf3QKhNc3Gzsoqd9noFYyorXSK1YVVURVXuipzKiInQyAxMoSXV6NiN6qp03V+vaXSN4tlumttRXSV7XK1KdzeZq8yNamF75VTj6/XVzpOKFu0jFbqdIqyOJ7nzOd4kSuRVVOnRVTGCaYyFuVUU0sXmd6Cq96bRTOoo45KlGKsTJXK1rnbIqp2Qs5S8K1U7FVOp07S+uqS/U1c6vpf0NU0Evg1EdRK3ka7r0Ry469F6L1JeOJembWjYqaWW61T15WQ0bFdzL5cy9PsyTYruqphpoXqdU0xqi+3uoqI7xpWqs8SJzwSvRVa5N2uz1R2/bBvdT39NP6auV1jSOaeliR7IXO+k5VRGoqJ165LbDHPdupp5kVTYWSurLhaIZbpTQ0NwVrXzUrJed0LXdlci9UXGynWtF6uuGqqm5c1obDSUkyxsqY5Fcki56JyqnfHVVzgW4R3dOxpVD5U1TBVQtmp5o5onKqI+NyOaqouF6p5KfZQiGrY0oXYoYz2JyqPFhjws0rI0VcfE5G/idD0/xFhrai+Ov01vt1HbqlKeObxFzIquVGrhfyA78vRAifCbC41i01pq6yHkesMD5mZXLXYblO2xw2hNS1uqtLJdq2mggcszomthVyouETqufmTfg7NlEUqHUNfapm0npttypoopqh87ImRy5w5O7u3Xsc/Zqi5XPTNLXVFNHQVtTCknh9ZWxqvVM9s9MZE5uLXIYHodU0zqW83Wvr6G8WF9E6jcqe8xo9IpMLj9pEVOnXdMHZ4poqiFk0EjJYnpzNexyOa5PNFTuEfQAhRif2gl5+F1NTSu5aOovluiq3L2SJahqrn0yiGWlaiIvKiImVRETyz0Oua40pRa30JdtK3CR0UNwh5ElamVheio5j09WuRF+oxzYOLbtHU0GleMcMmn7vSNSCO7LE59BcmImGyNlRFRrlROrV3L3MTqs0ImS5wpj6XjXwnpYfFl4gWV6KmWtgqPFe70RrUVVU7NpjVFn1jpuj1FYah09vq0csbnsVjkVrla5FavVFRUXopnMi65vco2JnzIAGxQqF9SKAAxsXY1ImSxGhOiml8iouU7p1D1w7ocXqC+2rTOnqy/3urZSW6hjWaaRy4wibJ5qq9ETdVJ/BjzhLClp1RxL0zTcraC36hWamY1ekaTxJI5ieSI7K49TK5jPgxbbl/BW6atvNMtLcNW3KS8up3Nw6CJyI2Fi+vI1F+syb3N3tIbkKQjSkKAAGwIAAQqIUAKAINggAMAFIUeoAhQRUAAADcFAoBEQFAEKAUEGwKBx94guVVa5KS1TMpqio/Ve8OTPgNXor0Td2OyeamKtCw3ei1Hqmz2OuX3K3fQiliY508iZamXKnwquFyZVulLTT0yzVUtTHHTsdIvg1D4uiJlc8qpnsYp4Y0Tq6z6iu0VS9tbPOrYOaqfGjlRuU5+VyKvVe5m9q52k1XV3vR97ulvuMlPU22ORs0E1FGjopEblEyi4X5nMcO7rXXHQ9tnutbHUVk0bpW4REkWPm5UVyb9UX4sYOn1NU+s4Y6irblb62zXOnR0UsTq17mTuXCcyZX4kVPPJu+HVFpOSltLonouo6ajbJJid6ORiqvTGcKnm3HzM7RynGRObhu7/AK3F+Z2PTtTTs0naEWriRUo4kVFmamPhT1Or8ZZOThw7/rkP5nYNPWm0SaQs8klspHyPo4nOc6Jqqqq1Ope6Og8aJ45k0y2OdkuKt6qjZEdj6PkpmCepgoaCatqXIyGCNZXquyImTDnGKioaNum3UdJDTq+qcjvCYjebCt74MxSwU1ZAlPVRNmhVzVcx3ZcYVMpv8i+PdSsN8Nbh75f9UXesp5Khat7OeFlN4r8vcvKvXsiJjKHy4oTsr7VQ2uGoqp6mKpSR7JaSKPkRGr+6iLv27eZpslZa6W/a3/StVSUtPJcWMRapXoxzudyonwdcnHaafSVGtNUNtVPR1UNXAsMSRMmmjVrlRFVuOuPmY+Y07FBeGz3q23mzxXW9cjXtfRsp4aeJIkREcqNxmRc9uvTBki4e7PZDLUXWe3NVMNRKhIObfqi91QwFpqf9VZ9O08kFNdaO6TLHLHTPlmh5cZV6IvRir0VPJMnpBaaOaJnvEMUyomerEcmcdcZNeO1Lw6jcrzp+zW2SvrNW1jomYTkgrWyPcq9kRqdVOmWJaSfjbK6hulRLR3Ki8eOoZLh8iKxF6uT1b9xq017jS8d9XLUtp4oI43LmXlaxvVnn0Q167rKWy6s07rm1OimoWP8AdpnU/wBDpnKJjp1a53byJv0d9t2kLRab7Nd6GStSqnVVmWSqc9sqr3VzV6KdiTohsqa5UFQ+jSGobMlax0sDmdUexERVdny6p9a4N6vc3BwGoNa6b01WQUd3rnRTzN50ayNX8rc45nY7Ic+2RksTJYno+N7Uc1zV6OReqKh0rV/Di26tu9Pc5bhPRTMjSKXw2o5JGp279l6r1O409PDR0cFJTtVsMEbYmIq5VGomEHKOK1Lpyk1TYpbTW1FRTxPe16vgciOymy56KnopjCsmqZeIN40I6sun6AgpmNbQ0Dk8R0bY2/A3dM5XOO5mWaeGmgfPUTMhiYmXPkcjWtTzVV7GF79bLjfdcVV/0ilTSQzOZHUXOWZsKOTCNxC1youFx9Je+xPJY7/avDo9LQx2m23qyRMdI1KJ8bXSdEX4lV/NhF7ouTrHC+jW+U9y1BfFbdKxKlIYpqtiSSRI1M9HL2Tr2Tsb2mq6SxWqSGeoq0p6Ryw1UlTdEerHu2l5cq1V22QmnbvRWLWjdG2uy+FS1kSVqzMq/GVFVuefK9OTGOxn80fDiNBDQXCl1PS3aCC40aR/xKT43VCo7EStbnouVwqr0xuhxGm6yGzMvjKKV1511USOZNyIqsR7viXlXssceervNMIauJ0NtqNQOp/0AlbcHWmSZ9X7w5nu7GL8LuVOiqi+fyOv2ust9FpJIWW91BeIdO+PR3CCRWulRXZkyidnIvZSW8rjvltobNpzQFbbv0fcL/W1zHLWpFSva+qe7vhXJhETK4yfTh7T6zt8stvuzny2NkLXUT6puKhMr8LF65TlToqLnG3Q3GmLrqa6cO6e+T35niuppH8q0jVVeVFRMuz36dzTwxuV0v8AomWou9dJVuWZ8LHv6PRuOuXJ1VevRdjX5iODZZqjXPE6s1GlS+mtlmclNRTNY1/iys7qiORUVEVVyvmiHCXahrW+0FaIH3aaWoWOLFUsUaOb8Lv2UTl+4y4tqlp4IKS1V622lgjSNkEVPG9E9cuRVMV3ekrI+P1mp5Lk+Sd0cWKnwmNc34X4+FE5fuJgyJV6Olr7tR3Oo1PdG1NGn6lYvDjazK9fhRuFz2XJudaT6hpNOSXDTc/8co/1roFhSRKhn7Tcd8p3TBW6Vk/hDFqCTUNwfUsYkfIiRtjdH+4rUTGF+0+upr/FprT1VeJYJp0gaqo2Nufix05l2bnHU1eEcHaLpW3eRtalgjkxBGtVSsVjOWpenMrl5+7kYje/VOY6zxAqat2tdGuktElI5lSnJEska+J+sZ0RWrhPrPsy43TTvBFt/patEu1U9lfPM5qP53zPy5FRdsYT6jmKvTNfq6DTmo629xwVFLFHVQxxUacqOcjXKi5d1TKehO4rk5K/WcmrI1Sy0rLHy8kjXVTVnR2fppjphO3KdLulBSXP2iKWirqZtTTvoGufE9FVrla1yplN8L1OW05fdQVfFe/2OtrYqmhpY+ZGpFycqpy45EyuM83XKqcZcaGCu9oqlp6qHxoltyKrOvXDHeRO6vTjK6H9GcWtS01npntqpKDwaWJnNhHOjaiud5NRFc7K9tjtVk0vpSHQySUPg3JWUz1fVse79ZIjFyuM9FRdl69ji9PU8FF7Ql5pKaLwYo6FeVnVcZbGu5un6TqdMV2sr5BXtZa6ujmkjpGKvR6t6q5OyY6omPMYNvwSSGDRFdVvf4aOrX8znvw1ERrfNcJ3Uyd+k7aqf+0aT/x2f8TH3B2kb/c0YksbXsnqpXK1yZRydE7fUZBbbrbj/wBnUv8A4Lf+Brx6StC3S2J3uVH/AP2Gf8Trd44iacs19orXPVNm8dMyzwva9lMi9Gq7HfK+XZOp2VbZbcf+zqT/AMBv/AjKChYvw0NMieSQt/4C6Ntcpra5af3q2S3FjkR8bo6bx24XyXt1MRaPfHa5dUTzaSmvD31SLTQNga9ETmdlFXrydNlM01zLpyU7bQ+jjw740qGOVETblRqoYV0FR32tuOrY7TdYbTKtU3xp0iVzkw9y/D16Iq987C8UjutXPHX2a6UlLqOsp6mCifLJbZKeJj4GKxcNVqsyjduh1fhHp9aiy0eo0vFdDJBLJD7qxyeC5nRVaqKnXK9fqOz3nR61d1/hbNdUfPT2uSKZsLMNqHJG5ObOejevY23BtOXh1HhO1XL+Rm9rHWeJd1ZcuIdhsSMbPT0U0aTRvVeV8kjkyi48m4+0yjX2eKKtc+ntNwrEky5zo7i5jWrnHKjVemE+XQx3xHoKa26m0ZHTMVqSVr5ZHKuXPe6Rqq5V3U7JqW+MbxNo9OS2Vlw95pkWNyVDonNcrnZyucKmE+ZqcbrNfPU1LWR6eqvdtO1XOqI1Vr7q5kCNVUReZUf5dMep2rT1tpbVZYaaktzraxU8R1K6VZPCcqdURVVeny6HQNespbVpGorKnR0U0fiMZy1dY6WLKru1FypkLTssc+mLZURUa0UclOxzIFk8RY2qnRObcTtXKAdgaRFzg0zQQVVMtPUwRTxL3jlYj2r9S9DUXIg4ej0zpy3VDqmg07a6SocufFho42Oz55RDEtJcf7jHES5Wy980OgtS1bq233FUVYrZWPX9bBKv7LHr8TV7dfnjOK+htq630N0t89vuVHDW0dQxY5aediPZI1dlReijTG5gliqaRlRTytmhenM2SNyPa5PNFTooXOUyip80wYt/uE6RolkXTd71RpaB65dS2e7yRQ580a7m5fkmEOHqOFuqNEXJNU8Lb/V3C5Oby3G2ahrXzx3VucoviL/JyJsqYT78rIm1mwqmHqbj1YLdmn19p2/aMuEfSSOsoXzQqvmyaNFRU9VwcpPx/wCDsVMsya7oJumUjgbJJI75NRuR6msmdzR4sayOjR7Ve1Ec5qKmUReyqmyLhTDsvFfU2r+ag4T6Jr610nw/pu9wuo6Gnz+0jXfHJjyREyfGj4DtYjr7Xa+1G3W9Q9Zaq/0NT4SvVUx4SRLlvhJsipn5dhn6azXG5rt0UxXrbiNqCLW9t0Fw2o7fd9SuV1VcErHO8Cipmp2kc1fhe5cInl5dT4pwt19XU6Ud246ahlol6OZSUMFLM5vksqZX6zuOjtB6Y0BbpKDTdvWDx3eJU1Mz1lnqn/vSSO6uX7k2Qs4O3UJb/wAe5U8FnDfTNNK7tUS31z42eqsRiOX5IppoOF181JeaS/cW9Rw6gko3pNSWOgiWG20707Pc1fimcmyu+8yy7CgaYidsFIUjQAPQAEAAAbAgEKQqKQpABeyAAPUAAACAUDYbEADcbFDYegIBRuCBV9AvchQgQFAD1GwA+VTSwVtHPSVLOeCdixyNyqZaqYVMocDatFaatFG2jpbVE+NrldzTp4j1VfNy9zsY7ExWLdZ6M1NdZ47VaKG2Otkyo91UkTYZIFRfoqqL1THXonU73aNO2mz0tNHSUFO2aCJI/HbEiPd0wqqvfqcwqkGRHSeJen7nqXR36LtMTJKl1TG/D3oxEamcqqr8zkLRp+7UljoaObUlWySCBkbmxRwqxqomFRFVmVT5nZXIioVvRCZyrGmudCX/AFDLZ20t496ZTTK+RazkYkadOqcjUVVXHYyTE3Dm5XsqGp3VQ3oWTKMb2bQlU6v1Wt9oKZ1Jc6jxaZs2JUVUcqtcrU/45NtpDTGr7Jdr7d5KS001TcFZFFE1ytiia1V+JGs27YbnPmplJ3U+aNTJPXOhiGXhzrCwXmrvOmblT3Ca4sc2r8RjIZEV65dyZyiIq+XVE8zu+pNO6hvVttcVq1BJZZomIyrSKR3I5OVM4RO6oqYTt0U7Yi4bgiKWSI6DaOFumrXWLX1zJb3cHLzOqK9edFd58nb7cnZb7p+36h0/PZa6LFNM1EasaIixOT6Lm+Sopy69VyVOxMisSaE0FqvSeuI5p54KuzxwywpN4y9GuwqI1i9WrzImdu5ltO4ToFLJkwoFA2Kj41EEdRA6OWGKZO6MlblqqnVMp8zGzdBajulg1F+lbhSQ3a81MMvM3LmQtjXomU9OyJ2wZPDehM1XSpNBROuN6uCVUdTPdaKOlngqYcwyOaiIr3Iioq5x9Rwei9Kakh1pV6l1FSUtuRtMlHS0lO/mRrERGpjquERE3XK5Mor3yaUT4uxLB1a96VfVUmo62mVKi53KkSlga5Ua2NjU6MyvmuVVTYP0nXQ8InWVtHTy3ttsWkRWKnVVdnlR67He1XpgmemC8I6Dp7TmpbboKGyTVtHDK2nkiWLwPE5Vdnpzo5EXv3wchw705c9MaPdbrh4HvSzPla2ORXNTKIiIq49NjtnLhFNTVx0JJi1xD11EkiYp7X/40v8A9p1O4aL1BXcQqHWHvVsjfStY1KbmkVHcqKn0sevkZDd1UZLg6vfKHW1xpKeK23e32d0UiSOfH4kiyY7NXKfR803PrqG3Xe68PLjbESnmulRSrGqRZbG9698c3ZFTzOxr2NPYYjGNXpHUjuB0GmFp2T3ZnI1IklTDWpIqoiuXp0Q7ParZqWksVBRSXejjfBTsiViUXPy4aiYzz9fnudqVfhwaGoTFdG0xpa827iLfL/cJKeSnrY+SN8a4V65b15P2e3mfe5aFdcuJTNT1dRE6gZSth93RXtkc5EVM5TGE6nc29FNbl6FkmI6VZdC0ll11W6lpqyTlqIvBZSqiqkaKiZVXqqqvVPvNnxBsOtbpRJR6buSzUlbzRVVPMkbPDYvXo/HNy7KnVTvqJ1ya85JnGK4LSdiTTWk6Cy+Kkr6di+JI1MI56rlyp6ZU5sDcoKowC7FHVNV6f1Je66hdZNSzWinaxzKlGPVM9ctciJ3Xunc4+zcLNO2qR1RVvqbtUvXme+pfysc7zVjei/Xk74i4Um5MiOs6stl7n0zPBpirdTVDYvDbStazw5Wr0VvxJ8K47KmDRoDTdbpnRkFtuKx+9LK+Z7Y3cyM5sYbnfsdqUqL0wM501jriDpy833Umlp7XSpLDRTukqJHPRqRt5mrv37bFv+mdQ1/Fq36htzIYqKmga1amVUciO+LKcmUV3dDILkype6YJiuga201qnUOlH2ynrKGqkdLG7kSFYOy9+ZXKn1YO42aklt9gt9BOrfFp6aOJ/KuU5kbhcG+7ELJgpACgNhuAKTcFCCrlMExhMFAEVqOjWN7Uexf2XJlPsU2rLZbI5lmjtlGyRf2207Ed9uDdgupjS5FcqZXKJ2TyLguwI0qLgi9QAiFBFCqPUECBQQKoAAdwAQCFBUCFAAAATcFIALkEAoG43IABCigAKAABkABAbAgApNlAFGwAUGw2AAABAAACFAAgG4AFQgF3CjYAB5gAUgQAAUgBSFGwUAIEAAFUilAEKQoQAIAAAFGxAAKMEAu4A3AeQGQAAAUXuQuxE8wA2AAAAgAAoAFAEBQgQu+ABCghFAUFRC7jA7AQo2ADYDcBQAEAeY7AqAGw3AAL2AAAAB5AbACIXYBQbgBAAAPQpAACAANgFIALsQACjYBQbABAAAB5AANwAAIUANiFAE3KQoADuNgG4A3AdwB2Ad0HYAACFAAdwAAHUAEA9AoQoAEKQIoIUB2AAAEKAQegAAm5SBVIXYgQ3CgbhQL5DYbEAAu5QIC7gNhuAgQAAAAANh2AADYAAAAqFACAACg9BsNghgdxsAACgAg3GB6ABsQpA2A6gohUJsUCF3GwAAAAQpAKQoAAhQBSAAAAA3AADcDcB0AAADYbACFAUAAQAAADcoEKQoE2KTAADcKAqqTcAIAAKAbAAB3ARCgAEAAAhQA2AyAoAAhuQoAhQoAmAUBUL9YAEBcgAAAgAPQAANgAAADcAAAO4DBAUAgwAAABFCk7qCoAECqMABEKAAGwGQACAAhAAKAAoANggMgAAAA9QAA7EKACgAAXuQeYDceo9QAA7BfMBgINgA7gBQGwAQACFAFRSeoADYbhe4FJ2KRQBSIFAKvUbgoECgKAIUABsAAUhRsAIUgAoAECBfMBVCEARQCBQuwAAAbBAAdgAA2AEKNgBCkAu4IXYgAnUpQAAD0AAAABQbjsPUIeYAIooAKiFHYAAAFAFAQAAAhSAUF3JuAClTqnbsRQGQO4AAdhsAAAUJuUdwgAAGQAAAAAJ3GwAeg8gUCAAAAoADcbgKhQhtq2q9zibIsSvaruVcLjBOhujTucT+noc4dBInyVDWl6pHd2yt+ontF9a5RF6Duce28UK93vT5sPol0oHL/hCJ80Ue0TK3pDbpXUbu1VH9p9EqIHL8M8a/JyF2GPooJzNXs5F+tCp8ioDcfUoyAA6AABgdQICkChSbl7hBATcuwAAAAAFMEKAgQuxAqgEAFACAA2AAAKhQgCBACCjcgKqggCKFAQBuAPQKhQAAIUAAgIA3AKgAAoFAAAAAAAgANgB8aqqpqGkkq6ydkEEScz5HrhrU9T7GiaGCpgfBUQsmiemHMkbzNcnqhBj2/aptE2q9OS0d5ikpqed61KxSLytRU6c3md3oLxa7qj/wBHV8NV4eOfw1zy57ZOraj03Sv1Jpt9BZIvdkqHrVLDAnJy46c+NjttHQ0VGjvdKKCm5/peFGjc/PBmbLWrjdApDbIAAAAAhdyFAhQAAHQAB6FJsBQoTuFAEKRe4DYdioRQIXAQAF7kKoRAGTb1zGyUEzXLhOXOfJU6n3XucTfKh0dMyBvTxFXmX0TYzbkWTl15Vz1Kigm553ZqLsQZINROnkRAvcDUiqnZcGpJZG9Ukci+jlPmncKB90rKpO1RIn9I1tuNc3tUv+vqbVApdpjfJdq9v+ORfm1DW291qY5vDd82nHbEL7VMjl232dF+KCNfllD6Nvy/tUqfU84QuB709Y55L9F+1TPT5ORT6NvdIvdkrfqRTroQvv5J6x2RLxRbvenzYfZt0oHf/EInzRTqxOyl96esdu98pFblKmP7T7NVFRFRcovU65baVKuflf8AybU5nf8AA7JhE6ImEQ6eNt5YszhdiGr0NJtlSAoBAMkApAUBuTcACjPUbDcKbjzIUIepCkChQQCjAIEUgKAA2AUAIEUAgFICgCbF2IFUDYEAAFQBABQAAAAAAAO42AAbAbDuBc9MZJgDIBQMgAAAGwACgJsUIh17V+t9M6Es6XTU1ybSRSO8OGJrVfLUP/cjYnVy/I7C5VRqqhhrRdtp9Ycftc6rvSJWO0xVR2W0QyJllInho+SRqL051Ve/csiV83ccbwqJUw8F9by0MiqsM7adnM9vnyd2/JTcM4/WmJEW6cPddW7zWSzq9E/2VMz8jv33faEa/wDyjvtU1kZ5Ybj9pDhf4qR1lXd7e7/ndonZj7lOUh4/8HKjCN15QRO8p2SRf2mmTnwxvRedjX/zmov4obKfT1gq0X3qyW+fPfxKWN2ftQZF2uq0XFjhlcFRtJr+wSOXsi1zGr9+DnKfVWmaxUSl1JaZ1/8Al1sTv/MbKr4Z8PK7PvWhrDLnzoI8/chwdRwM4Q1CKkvDyzpneOFY1/qqgkhrvcdRBKiOinilRd2SNd+Cm4RHKn0HfYYon9nXhJKuYNMzUS+dJXzxY+xxt09nvRkC/wAQvurrf5JT3yZET6lyPU1l12W92uT6lCKi74+ZiVeB88aL+juLOvKTyzckkRP9pD6M4V8RKVFS38d9QIiJ0bV0UE/34Ji6yuitzjKfaaVVMmJpNG8daVU9z4wW2qRP89sTMr81ap8ZbX7R9L1i1Foa4/8AS0MsSr9ij1TWXyoYdjuXtIUqfrdI6KuP/Q3CSJV+1D5ya449Uj0944KUdU1O60d7aufkjh6rrMau64PhW0SVtKrU6SN6sX18vrMRt4q8RafrdOAuo2L50lXFMhzVo4o1l5hqYKzQeo9OyxtRUdcIGo1+VwqNVq9VQxZk5WXenLvaqKqKmMGg2C3uiVMu8dn86JTWl2trk/wlEX/SRUPM7t6i9AbRlxoHrhtZD/tYPs2op3fRqIl+T0IPsDTlqp0ci/JS4XvhSikCkyQagnmTp5l2Air1IUgFGegyQCjJABqz0ITJqQDfWqr93rUaq4ZJ8C/kdoROh1O30L6qpRyoqRMXLl8/Q7Yn0UO/+Pcc/MGxF7lOjCAY6lCoF7FIA2BcdAEQBSoBAUgU2AAFAAAhQEACAUAbhQABAAbAAAA3AGwAABTAAIJuUgKKAQCgBQG4ACG4AwAA2AAbD1AADcAAAFPQDcbhAhQFABkId1a3zcifeYi4EIszOIVzVVX3vVlYvMu6Mw38jLauRrmuXsiov5mKvZ4asnC2pr1T/D73capPk6dyJ+BqJWYEXoReg7FX6KqVGnPQqKca++WeKtkopbtQx1Mf04XVLEe35tVcobmKphmXMM8cif6D0d+CmRuSFyqJlGqv1HzV656tVPqNYPoimlUypEkTspUXPZSYa1M6IVSY6DIGnv3LhFQir8WDVlMdxBp8Nu5PDb5J9hrTCkz1LocjUTKJ1OB1DHIqQzNcvImWqmey9zn3dEOLvEkTba9r+rnqiNT18zn58xrx7dY5stRF6mlWxuTDo2L82oaVX4sGrqeZ3fCSipHdXUsK/wBBDbutFsf1Wij+pMG/d2CdgOM/QluX6MT2fzZFQv6Fpk+hUVTPlKpyO5qA4z9FSon6u61TU2RVRTT7hcWr+ru71/nxopyg3A4z3e8t+jXwP/nRYIv6canajk+1MnK4NIHF+Ne2/St8D/5koStuTf5Szv8A6MiKcoVe3YiuLW5yt/lLXVN+SIpp/TECfylPUx/ONTlsqid1GVXuqhHGJereveVzc/vMVDWl0t7s4rI/r6G+cxq92tX5oh8nUtM9Pjp4nfNiBXyZWUj/AKFVEv8ATQ3EcsTnfDIxfk5DauttA7vRxfU3BGWe3c2fdkT5KqBHbrG9ropoOiqi8yY32OWRH5xyOx/NUxrceH2mtY0aW26VFypfCek0S0NY+B6rhUX4m+i9jhU9nmz0/W2cQNcUC5ynJdlcifah6vCb464eV5ZlVPPp9Ro525xzJn5mIGcF9YU+UtnHbV0KfspUJHPj7TQ/hxxspUxQcdZJkTslZaI35+eDeJrMfRd0NWTD7dN+0ZTszDxD0pW42qLS5mfrap8Hu9pekeiJTaCuTUXrh00KqPVNZm7gw8mpPaFpVzUcL9OVzU7+6XlWKvy5kKnEfi1Srmv4D3F6J3Wju0Mn3KT1q6zADD8nGi/0uP0nwT1tTeaxQxzIn2KaW+0JpmJF/SmkdaWxU/y9leqJ/sjKazFgGIWe0hwozy1N3uFE7dKm1zsVPn0ORg4+8HKhqK3X9ujVf2ZkkjVPtaX1NZNB0uh4rcNLk5EotfWGVVXonvrW/jg5+n1JpyrVqUuobXUK5cJ4dZG7K/U4zi7HKgKuF8iAVQQbhVBChAeo2AUAAAAABuNgEABuACjcAANwFAFBBE7FNJqKAIUAAAAA7BAdQNsgAB6gNx6gANgAFAAEAAAACBQdymkI21fK2CgqZnLhI4ZHr9TFUx97PMXh+z7paTGFniln6780r1ydp1vVrQcPNSVyd6e2VMnfyiccTwVpVoeBei6Z3dtqhcv9JOb8zU6Zvbv6nCavuE9q0LfrnSyrFPSW+onjkRM8rmxqqL9SnNnROMlY6g4H6zqWO5XNtM7UX+c3l/Moxnw54JcPNScLdO37VenI7ve7nSNrquunnl8WaSTLlVXI71OxS+zlwqc3+K2e4UDv3qS6TsVP6x3zQVKlDw00xSI3lSG10rMeX6pDsW5m2rJGHWez5pqn623WGtLau3gXp6on1OQj+C2oIX89t43a2p1T6KTTxzIn1KiZMxblEtMjDycN+LVIn97+PNwkXZK20xSJ9xI9M+0PSdIeKWna9P8AnlnVi/1TMWEBfZMYelX2lKRF8OTQVzRPSeFXfb2JHqT2iKVP41w60vXqn+a3hY1X6nGYey5IrUXumSauMPrxG4yUr8V/AipmRP2qG7xSJ9+D6u4w6npGo65cD9ZweawthmRPscZbVrcY5U+wrU5U6ZT5LgvsmMQxe0HYoulz0Hre3rv4lme5E/2Q/wBpThhA9ErZr3Q5/wA5s87MfcZey9P8Y/8A2lNEsUcyfrWNk/ntR34oPaGMbwe0Pwbq2Iia5o4HLtURyR/i0+juJnCu8z+LBxLsqqqYaxapiI1Prwd1nsNkqkX3mzW+fP8AlKSN35HDVXDbh7WNVKrQ9hmz35qCP8kJcvazY2VPcNI1nK+j1tZp0d25auJc/wBY5eC2wVP+C3ajn/mSI78FOs1XAnhDVo7xeH1oaq91ijdGv3Kca72dOESLmn0zNRr501wnj/Bxn08V9/J3ySwVuP1bopE9FPg6y3JnT3fm+TjpMHs/aHo6hstuuWp6FWrlEhvc2EX5KqnOs4Yx0yYpdcasjTydcef8UJfDxWeVcotruDV+Kkf9XU+a0dY1V5qWVMf6Ig0je6RqeBr+8ux2SdrJPyN2206qj+jrB0n/AElK38jPpGvatg6KVq4dE9vzapo7bKculPrCPte6Kf8An0+ArtWN7stk39FUJ6RfZxGUC48zkpKzVDf5TTdBU/zJuVfvQ27rteGdZtAyyY/yMzHfiT0/p7NrguOh8ZtVsgVfe+HV+ZuqxQNk/Bxw9XxN0bRt/vhpXVNIvn+iZXJ9rcj/AF39PZzq9EDeqnTZONnB6NeWsuF2oPP3i21DMfaw3MHF/ghPGjo+IlJCq/sz87FT6nNH+vyPeOzr3LjocPS694U3CTlo+JVlevktUxPxwc5HW6VqERaTWlmmR30cVca5+xxP9fl+L7x8tiK7CHJstcVS3+KXWiqP5kiL+ClXTtwVMtdE75OUnp5fh7R9dP0vi1Tqty/DF0RPNVO0O+I4S10Ffb5XLJG1Ynph2HdvJTlmydOx6PCWTHLyvLUmcmrufPxEzjKH12yakZTHQ08qL3KoRdi6IsbfIqManVET7CqqeY6eY1ERPJVT5KML+85fmoRepSRXwkpaeVF8SnifnvzRtXP2ocXU6X05Wf4Vp62T/wDSUcbvyObXsTGS6mOlVPCnhvXIqVWgrDIi/wDMWNX7UQ4eo9n/AIO1SKrtBW6Jy7wc8ap6pyr0Mn7IaVGmPP6LeuB2ubLaprvV3fhzf6lKGB1dIss1nqnfQbzr1dE719d0653RV7KmFToqGKfaIY13Cmmp16Pqb3bomLui+8NXKeuEUyuqp4j/AOcv4mb+tQABloAARQQBVwPQbjYqBCgKDYABuQoAhSFAEGxQAAIIU0l3KKEAUImxSFCgAQIbgFAg9ANsgFAAD1GAAAGB2AADcAAO4UAAGP8AjVVrQ8Ctazo7lVbVNGi+rkRv5nZtDU6UvDrTVMjeXw7XStx5fqmnQfaLm8PgBqOJO9R7vT/7c7EMp2uD3Wz0VMiYSKnjjT6mIhqdMXtvNzFXtDzpD7PuqWrnM8MVOmN1fMxDKphz2j3LJwmhoEX/AA+82+lx55mRfyLBlK2RLBaKKnVP5KniZ9jEQ3RGt5ct8lwUw0hqICAoG4AKg3Gw3AYAAAdxuCh2A+YIKRQABVIUCBQFKBCoCDSqIMJ3whS+gDPToqp9Yy/99/8AtKTcqAaHxRyNVJWNkz++1HfihsZrFZKlqpUWa3zJ5SUkbvxQ5EF0x1Cp4Z8PK57nVehbDM53dXUEaKv2IcJWcCOEFYq+Lw/tTFXeFjov7KmSsDA2pkYjf7N/CPlxTafq6NV3prlOzH9Y2z/Zy0VGvNb79qy3Kn+b3mT/AM2TM2SL1Qu0xh3+4nX07OW2cYdd0aJ9FHVrJUT7UNUfDDiXSqvuPHq+YTslXb4ZvvMv4LgaYw+ukePNK5PdOMNrrETatsTU+9qn1Sm9o+ljyl60JccbPp54ld9i9DLW5c7F9kxiFt79omlX9borR1y/6tdHxKv+0hXa742Ui/xzgjHUJutFfI3fcqGXMYCoi9Van2E9jGI14ta1p0zceBOrY8d1ppIZ0+5Q3jzR06ol14a67t6/tc1pWRE+tqqZbwidkx8jVl2Oj3J/SUvsYxEvtIcOIetZFqGh/wCsWWdv4Ipu6b2juDdRyo7WUdKqrjFTSzRqnzy3oZQc1HpiT408ndfxNnNaLXU5SotlHMi90kpo3Z+1B7QyuoRccOEdRhIuIlk69uep5PxQ7Ladb6Qvk8dLZdU2m4TyJlsVPVse9yb4ai5U2dXoDQ9b1q9HWSf+fQRr+RjXi9w20BZOEuodR2bTFBZrvaaZa6jrrdElPNDMxU5FRzds903QssGdUXqXc4rT09VVaWtNVXP56qajhkmciY5nqxFcv2qcpkgw57QEiuteg6BF/wAL1bQsx5o1Hu/Iyqx/PI9dlcq/eYi4zfxviPwjtKpzpJf31St9Ios5+rJlikysTVXuqCrG83JsAZUBdybBV9SAbAAUm5ECkBVUAAAFAAAIEO4yNhsFAAQaUNW5pNRQAAEKAAGwAAABF2INwAHkAA3A3AAAANwAA2AGAAAXsBhj2kEdNwwt1va3mWvv1vp0T/vFd+Rm5E5cpsi4MK8cVbU3DhnaFTmWr1bSuVvm1jVVfxM191X5qa+M3tDDnHlVnp9A2tERfe9W0SL8m5cZjMN8W2tquJ/CC3K7q+/S1GPSOFVEGXl6ucqfvL+JCNXLc+fU1GGgAgAFAEKBsAIPUegAFAEKQpRCgEAAACYKAIUEUB6AepdgIAABSImCgQblIAGwAAAfMCFCgoDug2G+SBgAFDsEAILsYs9oKp929nvV6ZRFmpmQJ83SNQyl6mHfaNRZeD/uSO/wy72+Dl/eRZ06fcWdoy3Zo0hsNvh/ydNE37GIb7B84GeHEkafsJy/YmD6mkYU4hItX7SnCujzhtJS3OsVPNfDa1PwMs0yIkbU8kMS3161PtbWWJuFSh0nUSuzssk6tT8DLdOnwISrG4ABGgAEDAKQooACBNijcKbEL2UgFGwyO4DYbAgFCkKAABBpTuajShSigm5UAABAhuB6DcKD0Cj5BBO+QEAAF8yAAAACogAAABRQAA2A2ARh/ie1KvjTwct6Kir+lKurVvpHCnX8TMyfRRfPqYZ1Tms9qvhvS4RUo7ZcaxfTKciGZ0Tonohv4z9EMM61Y+t9p/hfRomWUlJca1fRUajEX7zM6dzDNfItZ7X1nhTqls0rUSr6OlmRPwRRBl5Ew1E9AVe5Dm0oBAKANwIUAohd8kHoQUgKABABQAUAXGUNLOZzlRGqvyQCgrmPRc8jl+o0uXHoowO5U6kTq3JpkngpqaWpqpo4IImq+SSRyNaxqdVVVXsgGrspTb0tdR3CkhrbfVQ1dLM3nimhej2Pb5oqdFNwnVABC4wCATcpO4FIEKBAUAQFAEUbD1BQA2CdU6gEGw3HQACkICGH+PLfeLRom2ovWt1XQsx58qq9fwMwdjEnFpW1Gv8AhFb3Yd4mpFqFau/hwu6/eanaVmJvRXfzl/EKpEX4Wr5pkO+iqlqMJUuK32tNUyr1W3abo6ZF8vEl51MvwJhiGItGo2q9ofizcETHI620aJ/MhVVUzBEnwoStTp9QNgQQpAFCgBAbhEV3ZFX5AKeo2AQAAoAdMk3KNgIUmwApCkAuwAINKFIhSi4BABcgAAO4HcIBAO4AABQZ2GeoCAAApAAGABgB0GwwAKQEXo1V8grD6v8AfPbFo2qn/s7SL3fXJOn5ZM0r3wYX0wiVntZ63qM8yW+w0FKi/uq5VcqfcZoXc38YTOEUwzZUSq9rfWE/f3HTlFTovkr3q5TMj+kbl9FMO8P2LVe0LxbuLuvgvt9E1fRsXNj7yDL25AUw0AhQAAAAhQICkAAFAhQAGxpU1GAvad4mT6J4fs0/aZnR3jUKPgbIxfihp0TEj09Vzyp81LJqOD4je01NT6jdorhPak1De3ye7++oxZY0k7K2Fifyip+8vw/M64vCb2ndaxx1eqeIaWVsiZ92Wscjo0XZWQpj7zJfs8cGqTh5pOC/XSlY7VF0hbJLI5MrSROTLYWrsuOrlTuvTshndzUdg6dMvIf/AKNvGG2sSWzcZX+OqfEj56lifbl34H2V/tb8O2q+VlNrm2xuy7CtqXOamyfRkT7FPWyMZjt1NL2oqJ6E0YD4f+01pDVFyi07qein0hf3P8JYa1f1DpOyNR64Vqr5ORPmZvuNvpLnbKm2V8LZ6SsidBNG9Mo5jkwqL9SnQ+J3BrSPFC0viu1GyluyNVKe6QMRJolx05v32+bXfUqHQOBerNS2XUV14J6+mdLfLG3xLdUvcrveqbp0RV6uREVFavfGU2Fm9K6h7NF5r9LcTNYcH6+qdJS0U009C17s8jo38r0b6OYrXY80VT1mz1PGuiI/0l7e+objQPatHR1FbLPI1URjWJEjFVV7fSUyNrH2jo2X+TSnCjTNRri9MXkfUQNc6ljduicvV+PPKJ6qLPpr0KqJt1NC8zeqtVPqPKsun/a81g5Kis1DR6UhcmWwRzsg5U8sMRzvtUTcIfagok98ouL0dTUu+lG6tkan1czFRfuJfE16rVU5QnU8jXDiT7THCqlZXa+03S6gsrHYkqWsa7kT1li+h6K5D0Dwx4naa4oaW/TNgldHNCqMq6KZU8WleqdEXHdF2cnRfnlCWLK7yB6gigAIAAAgHYAO6AAoeoJ2Uu4DIHqAIpiTXSe9+0XwnoOVFSBlyrV9FbG1E/FTLm5h66ye+e17pilRP/Z2maqoX/vJOX8i+PaVmjs1qeiBUymPPoF7hF+JPmhr6jB/Cl6Vuu+LFxTtJqZ0CZ74jian5mZY0w0wvwFRZ9Naluq9VuOpbhPzeaI9GJ/ZM1NTDTF7anS+hdiFCmwA7hBBhV7JkHFX6yx363sopayppGtlSTnp3crlxnpny6kquucS6iopLLbVhmlhc6taiqx6tVUx26HeMO5EdheyfgYb1zpGCxWyiqIbpXVSzVLYVbUScyJlO6ep22l4dUdNPBUJfbq90T2ycrpeiqiouF9DEt28Lxju+xEL5/aFOiBCgATYvYdAGwAADsAAAAGhDWaU7lAFAIA3AKA7AKEAAAAABAAA2AHcANgAACgAPMDAAjl+B3yUFxzYTzVE+8Kw/wAMWLVcfeMNzV2UZV0dEmPJkSrj+sZo2MN8EnLVXzihdcJy1Wqp2IvmjGNb+OTMexusI5MoqefQw3wek981vxauXTE2pfARfSOJGmZd0+afiYa4BIkum9XXJOqV2qbhIi+aI9Gk+DLyAYKYaRSkKBNwBsBQCAAUigUbBvbzOi624saB4eJy6o1BDT1S9W0UCeNUO/oN6onquELia70gymcHl67e2fpKnq3Q2XR90uMaLhsk87IFd/RTmU6xJ7aVwWdWxcO4vVrqx6r9zTXqmvY6O+JUTquyHijW6v4w+2ZbtPUUi1Fps80dM9zFy1I4F8Sd31v+E1XP2iuL3Eakfp/QOhZbfUVaeG6poo5JpmtXovK9yI1n87Yy5wU4T0PBfSVy1dra401PeKin56yeSRFioYEXmWPn/acq9XKndeiZNSYlus/qqZTCY8jXsinnl/tG1tdTVeotL8Lb5e9H0MitnvKOSPman0nsjVMqif8A7wZs0tqmy6z0pQ6j0/WJVW+tZzxvxhzdla5NnIvRUJiuZJ3G2AQGd8nQ7/w6orvxY0txAirVo62xsmikYyPK1cb2qjWK7ZGqqrv3O+9jQvXr5DcGDbV7OVqt9p1FRM1LWK/Utw8a51TWIyaWj51etK1yL8KOcvxO38jLWntL2HSlnjtGnbTTWyjiTlSOnYjeb1cvdy+qqpzTcIgVe5beDGhrMIalTPQIXYmj4TU8U8UkE0bJYpWqx7HtRzXtXuiovRUXyU8U3Gkb7O3tW0c9t5otJ39G80OV5WQSP5Xs9fDfhyeSYPbqdzx/7bEECRaNqUaiVH8bZzb8uGrj7SzlK9d4Tl6LlPPzNJxem6t1Zo2x1b28j56CnlVvkqxtXByaeZitRqIVQFCbgEAFIUNgABO5ewQndQLsBgpBNlMNWpUrPbF1DKq59w0tTQfJXzI78zMq/QX5GGdBJ757UPFiuzzJTQ26javl8HMqfahqJWblQ+FTL4FJNOq48Jjn5+SKp907HB6wrG2/Qt/r3u5Up7fUSKvliNxpGLvZ6jc3gpaKh+Oarqqyqym6PqHqi/YZkb9ExdwQp/duB+jI8YzbI5FT+cqu/Myi1PhMVpQNh5BT0CDfICAKQDhtQaepNR01PT1c00TYJknasWMqqbLnY5nfAToCKbAbjuUQoHoAIUAAPUgFAAADcEGlO5qNKFKKBsAA7gAABuAAIAKAACDYBADcAMAZAADcdugADYAQqLh7c9ERyZCm2rZUgoKiZyoiRxPeqrthqqIMYez0zn4c3a4Z5lrtQ3GdXfvfr1ai/cZf3wYo9nWJWcANOTL3qvHqV/pzOUyvjqbrL5yv5IXv/dRXfYiqYi9neJzeClBWOTrXV1bVfPmnd/wMm6jqkodKXetVytSCinlz5Yjcp0PgRTOpuAGjI3d30CTL/Te535k+H1kkoBhoAAEBQBAUgA2d0udBZ7TV3W51UdJQ0kTpp55Vw2NjUyqqbxex5A9qLiFXX+/0PBvSvPUzyzxfpBkS9ZpnKnhU/TyyjneuPIsmpuNhqzj/AMROKF/fo3g5aa2kppMp7xCz+Nzs/fVy/DAz7/U7JoP2RqRaj9M8UbxLd6+VfEfQ0sruTmXqviTL8T1+WE9TNXB3hdb+Fuh4LTCkU90nRJbjWtb1nl8kXvyN7NT5ruZGVPiydOpwy6rZ+HehtPwRQ2jR9ookj+i5lGxXJ/Scir951TiNrvSPD6ppKOPTsV71VdHclvtFDSxuqKhe3M5eX4WZ3327KZNuVdT263VNwrH8lNSxPnld+6xrVc5fsRTAfA6wP1vFqLjFqB0rLxqeSant8zFxJb6NuY2pEq/Rd6/6Pqog29bxW4qaCntN24laJs9s0lcqhtPMtrmV8ttV30Vk2Xfp6Lv0Ptxnim4jcUtFcIKeoclpqUW83d0bsc9OxfgT5L1+tyLsdi1boPWuqPZ2vujL7WUt61E1jm0dW1eT3tI5EdC5+cI2RWoqLtlT66P0FqOh4haa1pd0hSVuk4rRcIVky+GoYrV6Y6ORfiRVz3QumMpUFntlus8FqoaCGmt1PF4MdNGxEYyPGOVE8sfaed/Z4lqdJcUuI/CifLaW31i19Cxy/Rjc7C49FarFPTKdUVPM8w3BV037fdtmRFbFqG1eG7ZHO5FT61zGgg9Nr3wCNXmTJqOaimlOq4Kp1a46qfbOI2ntMSwRtgvNPVSRzucvMssSNXw2p26tVV6+Re6O1YIvfBqd6djR3FDsUY6DcgJ3PN/tdaGuupdAWu/2eidVvscsjqpkaKr0ge1EVyIndGqiKvp1PSBJPibgsHl7hL7T2h6rRtss2tK/9B3eijjo1lfE50FQ1rUa2RHNReToiZReyno60Xa1322MuVluVLc6KT6M9JM2Vi/WhjHWvs7cLtZyy1dTYv0XcJV5nVdsd4Dld5qz6C/YhgLVnAviNwUpZ9Z8ONXVlXb6T9dUMgzFPExO7nxoqslam/TomwyXk349tbEMU8C+LP8AdU0DJWV8cUN8tsiU9fHD0Y9VTLJWpsjkz02VF9DKqdTN4WKQoIoQu5AKQAAoKAIUACL2x5mHuDn8a4mcYbii5R+oW06Kv/yolTH3mYm9ZGp6p+JiD2flSotWubpnLq3Vle9XJujeVqfmb8UrMx0DjPUupOBmtZ2ryubaZ0RU81bj8zvxir2h5lh9nzVDWrh1THFTN+ckzGp+IiOb4d0fuPDrTVH/AJG2UzP/AKaf8TuafRQ4izwpTWyjpkbypFBFHhPRjUOXTsZaANwAAAAZAAAECrsNyF3CA7IBgKhRsABMlIBQOxAKACDShSJ3waiiFAIBCgohRsAJuUbABuQoAADcAAAAACA7jYBTyAAQOt68rVtvDfUtwRUzT2ypk6+kbjshj7jXUpR8B9bTK5G5tM0aKvm9Eb+YG44J0b6DgToumkTDm2uJy/0su/MyCcBoqn904facpeXl8G2UzFTyXwmnPm6y6XxXrEoODmsatXcvh2epwvqsaon4jhnSe48JNI0mMeHaKZFT5xov5nB8fpVi9n/WCtdhZKNIE+b5GNx953qy0qUOn7bRInKlPSQxY8uWNqEvQ34BDDSgACAFAhQAOF1XqGDSmib3qWp6x2yjlqsfvK1qq1PrXCHkH2U9NVWsOKt94j3xy1M1u5nJI9M89VOq8zv6Leb/AGk8jO3tLzzwezlqlYFRqvSnY9c4+FZ2ZOtexzBBHwYrp2ORZZrtL4icqJjDGonXfodPHpm9vRjfhTBfUi9wnYyrp3FFlTLwi1fHSKvjutFVy/8AhLn7snB+z94S+ztozwVy33Fc/PxHc335MjVlNBWUk1LUsSSCZjo5Gr+01yKip9iqYi4CR1Wl7bqHhdc3fxvS9wd7sq95qKZVfDInmi9Uz55TYsSsyo3oqGlG4XB9F6GlOpM+DUxcHlnjzL+h/aX4R3xuVV0/gr9UyJ/5z1IvQ8ce17qOCi1poWniiT3u2q65Ol3a3xW8rftYqmpfiV7GamFX0VU+81bnwoallbbqasjVHMqImStVOyo5qL+Z93dEJmK0r3MbcZ7PcJ9GU2qbFG6S9aUq2XilYzvK1nSaL+lGrum+DJOcmpyI+NWqiKnkqZRRCuI0/f7dqfTVtv8AaZklobhA2eF3+i5Oy+qLlF9UOWQ882W6f3EuLL9C3Zyw6H1NUOqbHVv/AJOgqHL8dM5dmq5enllF8z0MxPh69F8i2cgoyHdwQAPQEGlyElghqaZ0M8bZIntVj2OTKOaqYVF+pVNSoamrhCwrw7wNdWcOfaq1JoZYJWUE/vVPKj0wkcUSrJFMv+jyp38lPUnD3iloziTFXJpi5OlqKGRWT007PDla3OEkRuerF2VPrwp2ipslpq66asqLZSSVU8DqWSd0LfEfEveNX45uX0yeJeJ/C7VHALWkHEbQFXK2x+P+qkTLnUKu/wATKn7cS9kVe/RF64UvFp090quVwTBjHg1xctPFfS7qqJI6O90SIy4ULV6McvaRmeqxu28l6KZPXyMWKAEIqkKQCgAAAQAr0ZmRezEVy/UmTEvs2xO/uLxV70RHV9zr6r55qHJ/5TJV9qUo9NXarVUb4FHNJldsRuU6L7PkDqf2fdIte3DpaV06+vPI92fvNzpm9somIfaJVJOFNLbu63C926mRPPNQ13/lMvIhhvjwvjycOLUnVKzVlLzInkxr3fjgQZPgRPFeiJ0Ryon1Lg32xsqRMt5vNVX7ze4MtgACAyAAATsECgAAIFIUB2QZIAKATARcdAQoUAAAAEGlO5qNKFKKCAgoGwAbAIAhsACqEBQG43ChAgAAACAAOwAUGwUgAxZ7QsnJwD1DF0zUupab589RG0ymYi9oFzpOH9mtyY/vhqK3U6ov7SeLzY/qlnaXpl6igSloaemTokMTI0+pqIffcrk6r8yYNVliH2i5V/uNzUCL1uFyoKT581Q1fyMrNby5anZvT7EwYk4+PSW26GtWP8O1ZQMX5NVXGXl+k9fNy/iSkQDcGGgAAACAXcmcF2yExhSjEXtIMZJ7OurUerURIoXJzeaTsx9Z0f2MqmSThTfKdzUSOG7ryqm+YmqpwHtccS6OK1M4X25yS1c74qu5ORekTGrzRxfznLhy+SInmZj9nzRM+h+CtpoK6nbBca3mr6pqJ1R0nVqO9UZyobkyM3msrqQoMiKmTGOvqpujtX6b1+jWMpPHbZLvIrevus7v1T1XyZNjvs9TJ6dzGnHylfVez7rJkTUV6UCyJnbkex2fn0LCsmL1QiHW9AXd994aaZvErnPlrLZTzPc7urljTmX7cnZBQXseM+POnX6t4n8Q2Mnm8ayaXpKyKJrUdzIyXLm+iYcq9PI9mbYMAOp2UftoV9JXRpJR6i0vyJG9Phl5OjmfYi/aWFdz4B6lZqrgbpmu8RHz09MlFP1yqPi+Hr80wv1m/wCJGrK3Sdw0dUMnSC1118joLg9WIqJHIxyMyv7Kc/L1MD6MuEvs3cYa/ROpZ3x6H1JL7xa7i9P1cEnZEcu2EVGO8sNXseheIWkKTiFw/uWnJKhIVq42yU1S1c+DM1eaKRFTZFx9SlqO2x5XovdOh9VTDcmLOE+vqq9QS6O1giUGurG3wK+kkXC1LW9G1Mf77HJhVVOy/M76upLUup10y6dYrn7slWyJ7Vak0WeVXMXs7lXGUTqmUz3JmRd1xOudEWPiBpKs0zf6fxKWoTLJGp8cEifRkYuzk+9OimHNG8RtQcJb3T8N+Ms7loEXw7NqhyKsFTGnRrJXfsqiYTK9U7L0wp6MYnMuTiNT6asWrLDUWHUNshuNuqEw+GVN9nIvdrk2VOqCXIVy0Usc0DZ43tfG9Ecx7FRWuReyoqd0HNlTzc/h5xf4QPfU8J7z/CrTDVV38G7s/mkibntE7p9yp8lU5Sx+1Bo73tlo17abrom8J8MsVdTudEx385E5kT5t+sWfiSs/p16g4awaq0zqWnSfT2obddmKnN/FKhsionqiLlPrQ5ZHorlQmK19wVEwRV6gRE+I2l4tdvvVnqrVdaOKsoauJ0M0ErctkYvdFN2ncP7DpX58ahob17MftAwVtkmfNZp2eLA2Tr7zRudiSF/m5qovXzRq7nvi319NdbZS3Kif4lNVwsnid5sciKn4njD2x7vS3PXumNMUUPi3CipJJJVb1XM7kSNnz+HP9JD1/pO2PsujLJaJXK6SioYYHKu6tYiL948ukjmgCGWlABAAAEBQB1DidXJbeEerq1cYitNR3XHdip+Y4S0nuPBjRlKveOz0yL8/DRV/E4Dj7Ue7ez7rJ3XMlEkKfNz2od/0xSpQ6Ss9Fy8vu9FBHjyxG01Oma5cwvxWVanjJwgt6L0/SVXWKnpFCnX+sZoMM6zT3r2mOH8GOZKGz3SrVPLmRjEX7ijKNGmImJ6Ibw2tKmGoboy0AECqNyF9QAA8wiFyAFNggIBQNgEQKUgAqABQABAAEVpQ1GncpQBSAXYbEKAIAQCgdyiFAAHXa/UM9Jdn0rIGLFG5Guz9J3qnl3OxHxkpaWSdtRJTxvlb2ereqGbL8I+ydikBpAAfMAANwoQoAGI+NKpUXbhhaei+9auppFTdUjY5V/Ey4Yg4kqlTxv4PW7uv6RratU/mQJhfxLO2azOi8yZ9SKGfRQqlRhri6iVXEzhDbVXPiagfUK3zSOFVz95l7umfMw7rtVqvaZ4UUarltPHcatW/KPlRfvMwp9FPkKRQAYaQoAEKQoBPIwJx34/0vDRj9OafbHV6pmj5lc/4oqBruz3p+09e6N+tfIyxrnVMGidBXvVVQxJG2ylfM2NXI3xH9mNyvm5UQ8deznoWbihxRu3EPWP98aa21HjvSZOZtVWvXmblF7tYnxY/mp2yb8Z9Zrs/BLgBeNR3ym4n8UHSyulm9+p6Cqy6Wqeq5bNPns3OFRndemcJ0PYzehUTLfUYwWgCbmpDInY6XxYgjrOC+saeViuatoqVwi46pGrk+9Duq9TGnHS7pZOBOr6zxfDc6gdTsVFwqukVGIn1o5S/R9+CU/j8CNFS83P/AHribn5ZT8jIZ0Pg1QyW/gZoyllREe21QvVETH0k5vzO+fMXsiKY14oaGu1+fZtXaTmZFqzTMzqmgbKuIqprv5SneuyOToi7KZKNbcdMidjDNRdtB8Y7TJw+1xp642a+TNWVbXcad8U0L2p1kgmxyOxs5F6p3TB0Wnr9b+zzc4rK616i1rw7SJv8ddGx8tvdlcpHyqq8iJjLXYTyVD07JzKvX6g1q4Xl7l3nEzhiiW0cPOOVgt2q7HXVcFwt8ispLxRc1NW0UqdVYvMnVOvVq5TyNFZPoS7WyhsepeKFBValsNSr47qysgoq2nmRcKvKi4TLfhc3HK5O6GW+RGRK1GtRVXK4TB1K+cONBaomdJqDR9ouEr1y6aWkZ4ir/PREd94t5xccvBqfTToGvj1Ha5WKn021kSov2OH8IbFMx00V7t0kTPpPbVxqjfmuTHNT7NnBWWfxf4EwsVUxyx1MzW/ZzHFv9lrgy6dJU03UNRFzyJXy8ql46Rlhmo9PTyspor9bXyv+ixtXGrnfJObqL/pjT2prd7lqOx0V2gwqI2rhbJy/JV6t+aKh1O08EuFFoajaLQNnTGF55YFmei+fM9VU7Lqyu1VQWyF2kbFQ3irWRGvhrK33VrGY+kjuV2VzjoSLWF9SeyroipqUuuiLpcdGXaNeeKSjmc+NrtuirzN+pxwy63448F1anEW1N11pNi8q3q3/AMvA3zf0+X00/pZO2XPi9rTQdxopeK2g6W16frJUgS72isWqjpXr28Vqoionr9nkZta6nrKNqRrHUU9QxFRyYeyRjk+xUVF+srLhdHa201rzTMF/0vcmV1FJ8Ltnwvx1Y9vdrk8l+aZQ31Be7bdKu4UtFUpJUW6o92qolarXRP5UciKi7KioqL2VOx5svdvg9nr2gLRfbI1aXQus5Pc6+jb/ACVJUZ6OamyIqo5PJOdO2DvHEq5yaG406B1bTzNipb7M6wXSNO07V+KF6+rHKuF8lVCWa1GbkQ+crmsYrnrhqdVXyTf7j7LhOnkfGRjZGqx6czXJhUXdN0JSPBvC+OXi37YVXqe4JzU1JUzXNWOTmRI4l5IWfJF5fsPdyZyvmeCNW2TU/szcc6fUNiV9RY61z5KZZFwypgVcyU0i/vN2X+a7zPbWi9W2bXWj6DVFhnWWirWcyNd9OJ6dHRvTZzV6KPKEc+ADLQB6ggAgApCkyBiT2iXOfwXqqFq4WvuNDSY80dUNyn2GXoI/CiZH+41G/YiJ+RiDjy5ZtP6OtaJla/VVAxU3VGuV6/gZj3X5r+JudMqYVuT0q/a3SPa3aQ/rSVWPwM0ZxlTCdo/jntU6+nzn3Gz22lT051WRU+4fCdsvU6fChuD4Q/QQ+5lpCkKFQoQAB6AeoQAwAA3A9QqF2IUIgKO4AAgVQAEAARWk1ETuUoAiFQAAOwAbjYANgg3IBR6gAANwEPQAAAUgDcbjYbBQbgBAw7qVrqz2suH0HdtDZrhWfLmXwzMRiGn/AI77X8ir1S26QRv810tRn8MlnaVmZqfCg3BMlRhW8SNq/bE01An/AMDpeqmX5vkRPzMx7Ihhu2xe9+2LfZ16pQaVp4vkskmTMijyWG5SFMKEKTcCjcAow17T1qrrr7PN8SgidKtLLBVytb38Jj0V6/UnX5IdL9ji7WObhpdbFRvel3pa5amsjf2c16I2N7fTDFRfX5no65e4utFay6eH+j/Af7z4n0fC5V58+mMnhf2X6xKX2lqyk0340ljqqasj+Nq5SnavNE53kuUYmV8/U1OYze3vhFwalIqYUj1RrUEDuvQ1ZTsnfyOk624m6X4ew0r9QSVrpKvm8GGjo5Kh70TuvwphE+amMqrXvFHiwr7Nw50rXaQs0yqyp1JeWeHK2Nei+BH35lTsvX6u5ZCsg6b1zU6g13q1IpKWPSWn/DoffH/D4tYmXTrzquORicrfnkw1xP1F/d61hb+FXD9619hpatlVfrzEirTxsZ2Y1/Z3dcY+k5Ux0TJmJODehXcOrToWvtb66zW6RJ0jkmexaibqrpJeRU51VVVVReh3Gx2CyabtTLVYLTSWugj+jBSxJG3PmuO6+q9S6je0lPBR0UFHTRpFTwMbFGxEwjWtTCJ9iH2JsUwoObAOkcQuIVt0Db6B9RSTXG5XOoSkoLfA9jH1EndfjeqNY1E7uXoUd2cuVNSdEOjcPOIVHr63V6pbaiz3W1VK0lwttU5rpKaTunVvRzVTqjk7nedh9By5I1ERcr2J3Oi8UeIsPDrT9BUpSw1NddK1lBStqJVigY93VXyvRFVGNRMrhFUQd8erV7EREwY14ecRbhqXVOo9IagordBerH4Mr5rXO6WmnilTLVTmRHNcm7V80MlC9gnQ0uTKmoEVw+otN2nVenLhp690qVVvr4lhmjVcLjZUXZUXCouyoYOTRvGfhBJSLoS/P1vpCiX47DXcjaqOHdsT8dcJ2wvTHY9FJ3yaHoirlDWpjzr7V+bh7PlLWPhkpah1wpZGQSt/WNc5rssXHZyZ648jbceW1lxk4N6aTD7pVXinnczPxfAxiOX5ZVT0BfbDY9QWhaHUFJFU0UcsdSrZVwjXRuR7XZ2wqGL9ScZeA9vvNHfrtqK03K727nZSzU0K1MsCP+lyq1MJnHmWdJe29sHEWv1J7RWptJWqeKr01ZLZGk8jGIqMrVk6pz79F5cebV8jLDEz1PLtk9pbgLpZ1RQ6bstxt9LUTOnmkpqBrfFkVernZfzKvzMyaI4v8PNfKyPTmp6aWrf/APBVC+DUZ8uR3f8Ao5JnK/G84l6EtXEbQ1fpi6Rt/Xt5qaZU+KmmRPgkRdsL0XzRVQ8e+znra7cNeMVVw41CkkNHc6paKaBUylPWNXlY9E2R2OVfNFRdj3g74nqi/I8Ge0ZDTWP2qKC52eRI6yVlDWTJF0Vs3Ojc/NWoi/WJdR7x69c9wEVXfEqY5sLjyygMNoAUgEKQoApCDEvFjlqeIHCO3KiOWTUbp1aq7RwOX8zL7VyxF80yYa10i1ftKcKKJMOSnhuNa5PLDGoi/epmZqfA35HT4yi5wphXQDnVXG3i9cFVHIlxoqRF/wCjgXp95mzHVPmYN4QuWp1HxQuKp/hGrahiL5oyNqJ+JPi/WZoU+A+p84ujD6GWkKAA3GwHoAwNgAgUgAAAABgBROwAAD1ACIUAAACK0p3KEBRSFIBSFJsBQNgAAAQG4GwUwPQD1CAAAAIAABNgqjIGwRM4RTE2kme8e1LxDqM8yUdntlKi+XMjnKn3GV3/AEFX0MW8M81XGXi7cV68tzpaNF9I4EXH9Y14pWXAv0V+Sgip8KhGF9Ffxn2nuKVV393pLdSp6fCrl/IzEhiDhVy1XFbjBc06817hpUX0jhQy/gnl2sUAGVMgAABsCjBntUajqLBwJq6WllfFNeaqK38zFwvIuXvT5K1iovzNj7JGi6SycJ01S+Bi3K/yvkdLjKtgY7lYxF8sorvmpw/tmUc03DLT1axHeHBdVY/HZOeF2FX/AGfvMlez7cqKt9n/AEi+imY5kFH7vLhMckjHKj0VPPf17m5xGL27trPWGntDacqNQ6luLKGgh6cy9XyO2Yxvdzl2RPwPMzONnGri/dZ6Dg5ptlntED+R9yq2teqfz3v+Bq78rUcp069/pf2mfaPlsUFwlp9KWdX8rmdUip2O5XyNTsskjuiKu2NkPXvPo3hZoGOOWaj09p62sbG1XrytT83vXvuqrko6Nwx4ccRLNqSp1VxG4kVt8rpG8jLfSTK2jROXGXswiKqbcqJ55UzExcvznOOh5v1F7XOjKZq02jNPXTUtYue8a08aevZXKnyQzBwz1NfdYaDo9Qai0zJpytqXPX3ORyuXkRfhf8SIqI5NlTJL+rHdFXJADIAbgAY24t8IrPxYsVJS1tY+33C3yLNR1jI0kRir9Jr2L0e1cJlP/wBGSQnbBYMf8OOHs2jFutxu9+kv9/u7olrK50DYGckbeWONkbejWtQyA7p0Pm9zIY3zSyNjjY1XOe5cI1E6qqrshjO68euEVplVlXr22yPaqoraZXTr/URU+8vNGUGpnqda1toiw6/sMdnvrJ2thnbU09TSyrFNTSt+jIxydlQxZWe1pwhpURlLWXO4vVcctPQuT6/iVDa2f2sOHNxuUsFxo7zY6VvRtbWU3NErtmryZVq/MYjKGg+HNg0BFcP0ZLW19wuU3j1tyuM3jVNS7bmfhOibIdzU21LUQ1dNFVU0rZYZmNkjkauUe1Uyip6KiopuCKAAC7kx1KVAPnK2OSN0UrGvY9qtc1yZRUVMKinQbTwe4V2WTxLfoGzsei8yPmp0mVF9Fk5jt2oLhPadP19zpbbUXSelgfNHR02PEnc1Moxud1PL8vHb2g6mCSst3BV0FKzKqktJUPdj6+VfsQsSvRtVorRtfSOpKzSdmqKd3RY5KCJWr/VMIcS/ZW0xd6Ca78PWfwbvsKeJFTRvX3ad6dUTCrmJy7OauM7HX9Ne0LxmqdeUFkvPCvMdTKxjqaKjqIZmNcqZej3ZbhEXPXCdO56yk6uVF7Do7eKtGe1He9GaLuumtfWysuuqLS5YKN83wue5MtWOod3yxU+l1VydO/U4jg3oPWPF7jA3inrFj32iGrbWSVM0atbVyM+hDE1e7G4TK9kRuO59OMVJaaH21LOraGmq4q2e3y1lLJGj2Pe/4XI5q9FymHdfme42wxwxNghjZHFH8DGMaiNaidkRE6IgtyEXKr1XuvcAGG0KAQAABCoABhm5yLWe2LYKfoqW7S1RN8lkk5fyM2mErU1Kz2xdRzdF/R+l6WBPRXy5/MzcnY6Mp+0nzMD+z8i1Gibzc1XK1+obhUf/AFEb/wCUzdcp0pbTWVKrhIYJJM+WGqphj2dIlbwNsk7kTNVLVVPz553qn3EvSztmZifCajS36KGsyoANwAGwAAABuOwAAAAAAFCFAQBChQBBuAABBNygpUTuAAoAAAAwEAMAABgbAB1AADAAUGANggAAoAAiKmcJ5qifeYo4IO96ruJd06/xvVlSiL5oxjGfiimV1VGq1y9kVF/MxN7Oqtm4a3O4JnNdf7jOqrv+uVPyNRKzD6BU7fNPxKaJXckbpNmorvsTIRhngQ1Z4uIV2VeZK3VlZhy7ozDPyMxGH/Z0VZuEb7gqY9/vNwqvnmdU/Iy+S9rFABFAQpAACFHXNeaNtuv9A3TSd0TEVbFiOVE6wyp1ZInqjkRTx3wA1VetCcSb7wcvrvAbdHz0sTXKqJT1zWOa1W+kiYT58vqe5nLjPqeCuMDnO9tmn/QTGPrEuNuRGx9MzYZnPr5m/Gs1yXsoajodHcWL9pTUcjKCtuULaSJ06o1PeIZFzFleyuyuPNU9UPaWpNNWLVlkfZ9S2inulBI5Hup6hnM3mTsqboqeaGB+Nfs2Uuv7rNqnSVZDadQyOV08cqKkFYqdnKqdWP7dey74XqYtS4+1pwvbHRPp7leqCFqNYjoW3KJUTsiPT40+WUL2j2Lp3SeldK0K0mmtPW+0xqnxJSwNYrvmvdfrU5pnTPXOd1PGUvtI8brbWWir1Joejslnkro6aolnoJofFyqczUc93wry5XKIvY9nMRFblq5bsvmhmrGoAEUwACoBAAMO+0zT3Of2e9RLbKiSFYkhlnRiqniQpInO1cbds/I2XC7QvB/VXD+yaqoNAWF762mY6bNK2TkmanLI3Ds4VHIvT1My19DSXO31Fur6dlTSVMboZoXplr2OTCovzQ8qO0vxN9m7UFbcNEW+bWPD6sk8aa29VmpF88JlUVE6c6IqORE5kz1NSpXp23aV0rakatr0zaqBW9lp6OONU+xDD3tVOoofZ8uySxNR8lXTNh5Wonx8+fwRThv/AEx+HsdAq1mnr9TViJ1pnRR5z5cyuRDoN3qOIXtS6jtttodPVOmdB0MvjSVVSir4ir0V+cIj38uUa1uUTOVUZyPSvB19bJwU0dJcHufULaoOZzu6pjp92DvZtbbQ09rtdLbaNnJTUkLIIm+TGtRrU+xEN2ZqoAAq7BANwiSJlp8Eev77vtMXe0BxMuHDHhqy62V1N+mKurjpaVtSznbu568uUzhqfeef7V7YWrbbTQO1boGknSpZ4sM9PJJSpIztzNRyORyZReqKXE17ZY5FbjnVVX1Ota31lYdB6YqtQajrW0tHA34UynPM/aONP2nLsn1r0Q8jVHtfcQb1K6m0noi3wSLlGpyTVsiZ7dG4TP1GwpuD3HnjZe6a88RrhU2qgj+JktxRGrG1cZSKnZjCr647dVLg1cGrXeONPtH3DideadY7dbahK2RE6tbIictPAi74REVfRvqe5Gqqp17nmTgbXxae49a54X2RPdtO2ima2GCV6OklqIlYySdV3c/Kq7HRE5U2PTadE6mPLtqG4G4MqAEAFJuUAR30VKReqYAw9oOJar2m+LNwVcpBHbqNv/hcyp9qGaUXoYa4Qq6q4lcXrl3bJqFlOi/9FDjH3mZDpWI4DXFS2j4e6iq1XCRW2pdn/u3HRuCFL7pwM0ZHjCutkcv+2qu/M5rjPUrS8Cda1DVwrbVOiL6q3H5n10BRpb+HWmaBqYSC10zMf92n/El6anbt7fooaiN7FyZaUEAFA7BQBAAKCFAADcIAAAoAAAAKDcAAACAUg3KikKAINgpewEBSAUgKAIEKBAUAQAIAGwwMBQDYBFIo3AG1uMqQWqrncuEjgkeq+WGKpjH2bIFi9n+wSrnNU+oqVVd+eZynedbVSUXD7UNWruRIbbUv5vLEbjr/AAKp/deAOiouXlVbbHIvzcqu/M1ErI5xt+qEpNOXKqVcJDSTSZ+UblOSOn8T6tKHhFq6szhYbRVOT5+GqfmVHVvZ7pvdvZ70iiph09O+od6q+RymUTpXCWi/R/BfRtJ+5aadftbn8zupirFABFACFFT1AGwHXdcart+h9D3XVdyVPAt0KyIzOFlf2YxPVzlRDx/7NekrlxJ403LihqJFmp7ZUOqlkd2lrZOrWp6MT4vTDfM7J7ZeqKtP4M6JpnPZBM11xnRHYSR3N4caKnovMv1p5HorhLoyi0DwvsunqRjfEZA2apkTvLO9Ec9yr81RE9EQ3OIze3d+XC/IrmqnxI5UVfI1eppXqTo7YU9pfSM2q+Bd1fTxOnrLO9lziai5XlZlJET/ALtzl/onLezzrX+GnBOz1NRN4ldbm/o6qVVyqvjREa5fmzlX7TKM0MM9PJBPGkkUrVY9jkyjmqmFT7FPGfDS6y8A/aQvPDi8yuj03e5mpSzvX4Wcyr7vL8lRfDcvnjyLLwle0u4IiLy9SmVAAFAvoNshQiY69Sq3LkVFxgFUsGzmtdqqZUlqLZSTSp2e+BjlT61Q3LGIxERqI1rUwjU6InyQpqGibjBe5AKQFAEB0zibr2h4ccPbnqir5Xy07OSlgcv8vO7pGz7eq+iKOx5q9pPUVo17xdsnCpJZIHUUscXv8GZfCqp8JyOiT6TUarMqi5TK+SoepbHo+yWPSFq0u2hgq6K2UrKWNKiJsnMjUwqrlF7rlfrPIXss6Or9Z8T7rxO1Cj6ptvle9k8idJ62XKud68rVVfRXIe31TBakbWht1vtsXg2+gpqOPZsELY0T7ENy1vfmXOSp3Lgmq8d8cNMah4T8aqLjhpSB09uqJ2vr40zyxyqnK9r8dmSt32dn0PRvD7iNpviXpht805M/lY/wqimmTllppMZ5XJ8uyp0VDs95tduvdirbPdaZlTQ1sLoJ4nplHsVMKnz3T1RDxDwVmr+FntX3Dh9LUuloayoltciKuEfjL4JMefb7VL3DqvdAHYGGgEKQAABCphZGJ/pJ+JNyK5GKj16I34l+pMlGKOAnLUWnXN0Tqtdq24Sc3miK1qfgpl8w97N7XO4NR1z/AKVddK+pVfPNQ5PyMwbm6zGLfaEnWL2f9URMdyuqo4qZPXxJWtx953W2QJTUVNTImEhhjjRPLDEQx/7Q6q/hnbranVbjfrdTcqd3J46OVP6pkuNESZ6N7I5UT7SVY3SFIhTLQUEAFIUiBACqFCdwAAAQGwGwUAAQIUgVQAvYACAgpdiDYqKAAIUAKg3KQAUmxe4Ag2KA2IAEAAFAUgF2BMFCINwUDoHGiqWi4Fa1na7C/omZiL6uTl/M7Bw+o0t/DLTFEiYSG10zf/pov5nR/aJkVns/akjRVzUe7UyY/wBOdjfzMp2yD3Wz0VN/koI2fYxENzpm9t3vgxjx+qVpPZ+1lI1cK+gWFPXne1uPvMm5MP8AtISP/uI11JG3mdXV1DTInnzVDf8AgSDIemKb3LRtko8cvgW+njx5Yjahy5pjjSKJsSJhGNRiJ8kRDUZqgAIoAAAG4KPFvthWa42/X2ltYsj8WjkpkpW8yZa2aKRX8q/zkXP1KerdA6wtmu9EWzU9qka6GsjRXsb3hlTo+NU2Vrsp8sGvXGjbJr7Rtbpi/QeJSVLctkanxwSJ9GRi7ORft6p2U8a6Jv8Aqj2YuL8uldVq+fTNxejp3sRVjkjVcMq4vJU7Ob5IqL2RTcyzGXvJehD5U9TDWU8VTTStmhmYkkcjFy17VTKKi7oqKin1Mqjk6GBvaO4RRa+0lHqOiklivFgikka2GPxHVMGOZ0aInXmRUy3603M9KXs31Qs7Rgz2deMEHELRcVlutSn8JrTE2OdHO61UKdGzp5r2R3kvXczknVM7Hijjpw5vvCfXsHF/hyslHQrP4s8cDctoZ3L8WW7wydUVOyKqpuh6M4QcX7HxU00lTT8lHeqRiJcLcrsrE799n70ar2XbsvUubydMmqRUGclIIACAgLgiAAAUUmw7KXYgE9R2PnUTw09PJNPKyKKNivfJI5GtY1Oqqqr0RE8yjTU1EFLSzVNTMyGGFiySSSLytY1EyrlXZETrk8AcUdc3v2geL9u0jpLndaIp1prdGuUbIq/ylVImyYRVTyanmp2fjnx5m4hVDuG3DqKaqttTUNpp6uHPPcn56RRp/k1djqv0vRO+beAfBKPhbYH3C9NiqNU3BiJUyt+JtLHtCxfn1cqd16dk666idsmaD0batAaGtelbQmaehi5XSqmHTyL1fI71c7K+nRNjsy9jShqM6rSak7kQirjHmqkG0udZR2631FdXVUVLSQMV800rkayNqJ1c5V7Ih4W0HMvFL21naptcD1tsVwfcufGOWCJvKxy+XMvL9p9+MnEXVfGvih/cw0RFM+zwVLqdlPGqs98lYuHTSrtG1UXCL0REyvVenp3g/wAIrNwn0q6kppErrzWo11fXq3HiKidGMTaNvXCd17qb6idsmZz1UgBzbACEFAAEOPvdT7lpy6Vn+b0c0v8AsxuU5A6txGrPcOFWrKtXI3wrTUrldsxqn5lg637PMLofZ90mr/pS08k6/wBOV7vzMqnROD9H7hwT0XSqnVloplX5qzK/id8Q2yw3xyzU3HhlakXHvWq6dy474ZG93/AyfT/Fl3mqr95izim/x+N3CG35RMV1bWLnfw4UT/zGU6VMRt+SGfJY3aBS7kI0FGABCgbgQoG4DYAgFIpdwAAAEXYFAAhRsBMFIUCAoIAGQVBO5SFAAg7gUm43AUGQAhuUm5QIANwqkG5QBCkAFIXAQBABiD2h38/DS2W7qq3C/wBup0RN/wBdzf8AlMzqvVfmphjjbipufDG0quPe9XUrlT0Yxyr+KGZs5VV9VN/Gb2J3MO8feSosei7Qq/HcNV0EaJ5o1yuX8jMSGG+LyLU8TOENu+kkmoX1Ct8/Chzn6siDL7l+Ny+qkGc9QYaAAABAQUAblEU8P+1tqCTUfFix6ItbEqJbZCkasamXOqKhyfD08mozp6nuJERVTPZVRDwVpD+//t2umv0baeVt8q5kjb28SJjljTr/ADWqa8Wa9t6Os0undFWSwzTeNLbqKKle9OznMaiLj0zk57c+cOMonocNe9XaY08quvmo7bbcf5zVMYv2KufuGGued0NKr0OCsWrtM6nhfJp/UVuuzWJlyUlQ2RWp6onVPsOaR3Ql4WPlVUVLX0k1HW08dTSzsWOWGVqOZI1UwrVReiop414p8EdVcJtRM4jcHqisjoqdyyy08Cq+agRe6Y/xsK7oqLjfKdT2m3tk+Mrvi6llxMYH4Ne0jpzXtNDaNTT01j1M1OTke/kp6xf3onL2Vf3FX5Kp6ARctVXpg898U/Zk0prqSa8aafHpvUEmXuVkf8VqXeb2J9F3+k360Uw/Q684++z9PHatZWqS+6cjdyxuqXLLFy//ACqluVb/ADX9E8jSPcaqgTqYM0h7T/C3VUccVZc36brnJ1gubeVmfSVuWr9eDNlurKS40MVZQ1UNXTSpzMmgekjHJ6OTopnF1uFIFc1V6LnAFDYIAvbJBUTopoVyIuDqOsOJ2htAqxNV6kpbbLJGssdO5VfLI1OmWsaiqp5o137YFTVzvtXDHTsjppF5GV9wZzvVfOOBuc/0lX5Gs016o1ZrPTeibBNedUXWG3UcaLyueuXSr+6xvd7vRDw/xD4v6649akbozQ9srIbNI/ljtsP8rVoi/wApUOTojU8s8qb5U5TS/AXixxevUWqeJt3rLZRSYcs1cvPUyN/dii7Rp5KuE9FPXuhOHWkeHNp/RmlbUylY5MzVD/jnqF85Hr1X5dk2Q0jHHA3gBa+GcDb7e0guWq52/FM1OaOiRU6sizv5v37JhO+dFTBwF/1hpTTNRHDfdSWy1SSJlkdXUtjc5PPC9cHMUVXT19JFV0lRHUU8rUfHLE9Hse3zRU6KhmrH33KF6dwzqZUNnc4J6q11VPS1Hu08sL2RzYz4blaqI76lVF+o3qoaH9Gio8B8FtSzcNfaLr7JxDhctyqVW0vrp1y+mkV6K12V7sf0TPk5FPe6ZXKKmMHjL2y9NUlNe9M6tpWtirK1klFUK3osnh4dG75ojlTPonkeneFl5qtQcIdJ3mufz1VXbIXyu/ecjcKv3F8v0juBQvcGGkBSFDYAEAxxx2qFpuAGtZUXCrbnR/7Tmt/MyPuYm9oh/wDyF3ek3ramjpU9eedqGp2lZH0pSJQ6OstGjeVKeggjx5Yjac0qnypY0hpIok7MY1v2IiGtdzVRhbWK++e1LoOnauVoLJcapyKnZH8rEX7UMtU6YaYklxX+15ULnLbbpFjOn7LpKhfyMvQphDN7WdPqXYgIq+oIAqghUAAAIAAAUbHD3+7zWijjkioJatZFc39X/i+ndeiktxe3MKip3TBDoOjtQVCuZa5KWoqkllVfeOZXJGipv6HfieN2aWYAL2BpAAAAoAUABAABUAAAAAADsApsANwhuAAoB3QoRNi7DcBQmQAhsBsAAGQBh7if/G+NnBy2IvT9J1dY5P8Ao4Ux+KmZ2/RML6mzV+1hw7p+VFSitFxqvlzfAZpRMNQ0yphvXjkq/aV4U0HdKaO41qp/3SNRftMybmGbo9tX7X2nYeqrQaWqp19FfMjfwLEZdZ9BPkahjHQHNsQm5QAAGxQBCgF69DyF7QvCnVli4h03F/hzSTTTJMypq4qVnPJT1DMYlRn7THIic3fr36KevdzS7KuRUVUxuglxLNeGLlrX2l+LsqWa12S42elViJLDb6Z9FG7ZVfLIucL5Zx6HJWH2OtUXKVtVrPV9JQudhXR0rXVcvyV7lRqL9p7ZVyqzCqq/NT5YNXy/EkeJdbcDdZ8CkZxC4damnrYqNFbUSpTNbPSxu6K5Wplr2bKuOny6mcuC3HuwcS7bT2u5zw23VcbEbNSOXkZVKn7cKr3z3VndPVDNcjI5YHxysa9j2q1zXJlHIvdFRe6HlfiJ7JVHdbvJeuHF3isU7n+L+jqjmSBr++Ynt+KP5YVE2wNl7HovVmuNLaHsrrnqu809rgx8CSr+slXyYxPicvyQ8m6p9qbW+rNRtsXCHTz42quI5ZqX3mqn9Uj6tYnzyvqnY2Vv9lLijqLUUFRrzVNNDSRLyvqFqnVk/Im0aKmEz6qmO/U9W6G4c6T4c2Rlr0tbGU6Y/XVT0R1RUO3c9/dfkmETZC2xJHnLRPtO6x0/q1mmeM9m9zifhH1iUa089Nns98adHM81aiKnfr2PUlTfdMz6cfdaq6W2axzRc7qiaaN1O9mM9VVcL8u507ivwg03xYs8MNzkkt91pEVKS5wNRz4kXuxyL9Ni+Wy9lQ8v3T2R9Y293hTa9sMNjR+VnqppIWt69+RycufrEuw6dX4sXrhBqHV9RQcNtAVE87kcxK2gnfFFPL5x06NdzNTquU5c/LqYqtl9vmnpWyWjUVxtNZC5U8OCR8XKudsL067KiHv/AIJcP+F+iIHx6T1BbtSaiVvJWXBs0b5sY6tY1FXkZ6JlV3VTueruH2gtR01TV6g0haq+Zsb3+NJTokmUaq55kwuxajB3socRdY6xuWpLZqjUNVeY6WnhngdVPR7o1VytVEXvheh6rPFfsYRImttYyR06eElJG1JOb6P61cNx6pv6HtVSVqIhH55VwUboi+afiZH548eK+PU3tR3Wi/RdZd2UyxUDKSgykszo4/oouFwnM7qqJ2z8ztOmOFPtD01E+q0pZLZoWN7UwxkkcNS9E7I6R3NJ/tKho4T1Ul89uG8XN/RWVdyl6eTUViHuVEY5ERfpYNo8a6O9ojXfDfVUmjOOFFVTRsVGrWrEnvECbPXl6TRr5p18lXsZQ177T3D/AE3ph1VpW7U+pbzUR/xWlp+bkjVU+lMqonKifu917dO5kXXvDTRnEahiotWWhtYsGVgnY9Ypoc90a9OuF8l6GObD7KXCa0Xtlxnp7ldWsdztpa6oR0OduZGtRXJ6KuCbFx560twN11xksN94lahvD6epqkkqKF1RCsj7jIiKvRMpyR9OVqpn0TCGTfY11U39D6g0fW3Ny1UE7KukopXfRjVFSXkRfJ3LlNu/mer2xRwQRwQRsijjajGMjRGtY1OyIidkQ8vcVfZy1A7WbuIHCCvbbrs+VamWhbN7u5sy/Skhf2Tm65avTKrjvgupj03d7rb7NbZrlda6ChoqdnPLUVEiMZGnmqqebtUe2Lo2y3N9Hpix1eomxuw6qfKlLC7+ZzIrl+aohjm48NfaU4w3GjtOv532u1UCo1Zqzw4ovV6Rx/yr8b/eh6L4e8CeH+gLckVPaIbvcZG8s9xuMTZZJM90a1ejG+ifWqk4g5jhTxa05xXsE1fZ2yUldTORtZb51RZIFXsqKnRzF64cnljop3+VyIndOvQ8Z6p4NcU+E/Eep1jwVZLW22o5kbTQI2SSBjlysL4nfyjEXq1UyqYTdDZPqPbL1BSyVatutCyjR03I2OCkfLvyo3CK/wBGl4HUOJuttQ+0LxbtmkdO2V9PT0U8tNRxOysi5ciSTy7NREbnGyJ3VT3bpqxUumNK2rTtF1prbSx0sa/vI1uM/WuVPzfucuvr5xNS62/TF2s2rqhcVKW2GWF81QvRZEaiJ4au6K5EXlzleh+j2k4L7TaIslPqepSpvkdFE2ulTHxzcqcy9N87mfKcLHMkBTDSAbgB2HcnmUoGIeP7vE0Zpu3IuFrtT26L5oknMv4GXlMP8Zo1rtUcKrT0xUaoZK5PNI43OLO0rNGe/wA1/E090UJ1T5qql7IpUYU03/Gfaj4k1HZKO3W2jT1y1ZDMEXYxBw+VKnjBxcuKZVVu9LSc3pHTr0+8y/F9El7anT6AAgAACFACnQDIAZHYAIBU5mOavZyKi/WgGwHFWOyxWKhkpIZ3zI+RZFc5EReu3Q5VdwoJJi9gHYFAEAFAABQQEFABQGwAAAAAAAAAQA7jbADcDuAKTPUpAoAAhsAAoARV6AYgjZ777Ykb+7bdpBfqdJUf8FUzQYd0snvPtU6/qFwvuFlttK1U25+Z6p9qGYVNsLnqYXtMS1Xte6mqXdUt+mKWBPRZJFd+RmVVw1y+hiDQjXVftDcWLm7qkH6PoGr5csaux/WEGW17gA5tAAAEKAABAKTBQAXr0JjCF2BQIiYdkFd9HJAeuSu6RoY/4k8WNK8LrD79fajxq2Zq+6W6ByeNUr6J+y1N3L0+a9DznS13HP2k6mRtFP8AwN0Tnlc+NXtjkTy5uj53fLDfkbk3lm16I1Vxg4d6SSrgueq7atwp4HzJQsqEdJIqNVUZ8OURXKmEyu55e0FoDU/tNX+76y1zqmporNBOkEdNS9cOVOZI42u+FjWoqdVRVVftM36R9lrhfpiJZbpST6nrHNVHS3BUSNMphVbG3oi+SrlU8zEvDe8T+zzx8uvD7Usz26bvMjVp6x/0Woq/qJ/lheR/kqehZk4hdc3xP4B6T4V8M6jWuiKm802obFJDUR1rqrmV6c6IvM1ERET5Y9Tj9Pax9qbiVpxbrYKWyOs9YkkCTujp4892O+kvMi9z0nWaTvd+1VdpdR6kSp0xUUj6OnsVNCjY3Me3D5JnrlXv78uMIh5Ysd+1B7LfEys0tqKkqLloe6zeNBUsb15ezZo9leidHs3xlNjTLNns88GrnwptF1qL9X01Tdbq6PnjpcuZAxmcN5lxzKqrlcJj5mc9jgtN6lsOqrLFedO3WnudBKmWzQP5kT0cndq+i4U5xsjeXGMmfrQhFXDm/MiSNR+V6IcVqLUVl0xaprzf7nBbaCBqvfNO7lTCbIndy+iZVSZR4k1Dw24y8HNd3/iJpinpJqCB9TItwR0UrUgkerl5o39UVMoi9NuhzelNecbvaJuLLDarzBpK02+Jv6Sr7exzOdy5RM9cq52zGqidFVTaa31zrH2lNXx6D4eW+aj01FKks80yK3xERek06p9Fifss6qq+a9s22fS1y4HxWCk07S0tx0X4at1BPIjYqmGbutc56r1jROis/ZROmVNssa0GtOKfA/i5Z9E6+vy6p01d5GR01XKvNI1jnIxJGuX4mq1VTmYqqmO3meuGpy580XB4Wr7vqjjNx2l4h6c0VWao01pioiZBQsmSDnjYquYmXftOd8atRFXGEUz7pv2kNIV1+/g1rG2XHQ98V2Fgu7MRK5eyeJhMZ83IiepnyjUrNqLlTWi9D4se1yI5rkc1yZRUXKKnmfRVMSq0ub1yXGOoQKoVp7ka3DsmrcoGp3bOfiVMKu+PmaU6oMgW6iApCKb5AHfqUPUFJkgimH+IqpU+0Dwgt6dVjnrqxfk2JE/MzCncw7qFzar2t9F0+c+46erqnHkr3I38jXj2lZnZ9BvyQ1Yz081KiYRAqo3DlXCJ1VSxGD+C8iVtRxEuydffdXViovmjGsahmWPoiGFPZ5ar+GU1bjrW3m4VCr5/r1bn+qZsb9El7ajVsACKDA3AQA9AFPUABADcAFA7jcKKCDYC7EKTYCkKQCgEUCggIKAFKgAAoANgiF9SAKoAQANwAgAAKpBuAAACgG4AEX6DvkpSp16eaon3hGI+GHNU8bOMFwciKiXGko0d6Rw5x/WMxmGuBr3Vd04n3ZyJ/GtWVDUcnZUYxjfxyZmN1l8pPoKn1GJeEq+86y4r3NO0+plgRfNIoGN/HJlxydW+rk/ExBwFVZ9KapuSrn37VFxlRfNEk5U/AnwZZKF7gw0AAAAAIUAAAQopSIOwBeimPuLvFG0cLNDyXisa2quE6rDQUPNhaiXG+6Mb3cv1d1O+1dTT0VBPXVkzYKanjdLLK5cIxjUy5y/JEU8W6SoK32mePtTqfUEDl0bYl+Ckcq8nhZXwof5z1+N6+XTdDXjGbW/4QcJbrxh1BLxa4tyy11JUS81HRO+FtWjV6Lj9mBvZGp9LHl39jwww0sLKeniZDDG1GMjjajWsanZEROiIfKmghpYI4KeJkMMbUYyONqNaxqJhERE7IibH3cPYxH9VMacYuENp4r6S9zkfHR3qjRX2+uVuUjcveN+Oqxu3TZeqGS06mrPQk71a8V6V4xcRuBN6i0PxZs1XcLQxOSmqmu55Yo+yLFIvSZifuquU807GddP2zSXFrTmpK+6X+n1tYr1VtfTUiIrEtUbWcrGNRfijl7qrumVO/wCqdKae1jZZLLqW0wXOgk/xczerF/eY7u13qh5kvfs1a70LepdS8EtWTsf1VaKabwpsfuo/6EiejkRfU1LrOGr/AGcr9w2pbjrHhbxGqbJTUsD6menq53ROaxqKq4kb0d07I5ufU2dm177W0NsoKqPS8eoaOop45YahaKN6Ssc3LXK5jkXOO+evmcVeON3EuGy3DRPGbh/WzW+ugdTVNTRwOpKnkVU+Jq4WNe3l18zIWn/a44U0lsp7c+03y2w0kTIYmuhjlTla1Gp1a7v08jSOt1ms/azrp4KKSzWvTT7hJ7tTrMyCBz3qirhiyOVVdjK9OvQ5Oyey7qDU9yZe+MOv6u8yo7mWjpZnSfUsju3ya1PmcVxN9ozhFri0UVGlFqNtRbq+G401TBFDG5ska9kVz1wip0Xobebjpxz4lVMlBwu0JLaqWVVxVeEsr2ou6yyIkbfqQDJWnteaM4N6fvWmNVWKl0hU2ebmhhoGOel5idnw5YlcqukcuMO5l+Fd0QxZJcuJXtT6gSgo4pdL8OaWZPHei58bC9nL/jZPJqfC3f17Ro/2Xrpd72zVHGjUst7rXL4jrfHO6RHL3xJKu2f2WIiep6aoLfRWu3wW+20cNFR07eSGCBiMZG3yRE7GbcakcfpTSVg0VpWl07pugbR0FMnRqdXSO3e937Tl3U6fxv0NYdYcI9QSXShifXW+gmq6Sr5EWWF8bVeiI7vhcYVO2FMmp2EjY3wvikY17HorXNcmUci90VN0JpjAXsr6sm1Bwagttdco6qts1TJSIxX5lZBhrouZO+Pic1F8kRNjPiqeKeKnDHUPAzVqcU+F1XJT2ZJUSelT4kpOZf5N6ftwO7Jn6K4TyU9NcL+JVp4n6Kp79bkSCqYvg11Gq5dTTonVvq1e7V3T1RSX9WfjvidiDJTKoUAAQDcACFXsUAnYDcANwUBnHXyMOUUXv3tkXKVXZS3aThYieSyTLn8jMLvor8jEOjEWq9qXiXVovM2kobbR/JeXnVDXizWZ13OPvdR7rp641WceDSyyZ8sMVTfr3OscQqtKHhfqqrVceFaql2f+7VPzAx97P1O6HgZpd7k+KeGWoX5vme78zL7fonQOE9H7jwf0dSqi5jtFNnPmrEVfxMgJ9EzWlAABAAA7ADsFNwAENiFAADcBUKAAIUAQF2AAAAAAQAAVAbAAACBQoAELuPQAAO4CABdgJ6AYADcAgUKMjIQ9Ai4c1V7I5F+8G0uEyU9sq5848OCR+fLDFUDGPs7Ro7hncLiidbhfrjUKue/69zf/ACmYTE/s6U6w+z5pqVyYdVJPUr6q+Z7vzMr7m6y+dU/w6WSX9xqu+xFUxJ7O8Ss4G2iqd9KuqaurVfPnncpkjVdW2g0TfK964SnoJ5c+WI3HS+CFK6j4DaJgemHfoyORf6Sq78yXonbIoAMNABAKAAA3AAEUblKCGl646r2LnB5w9orjdcNJzQ6D0M9z9TViNSonhbzvo2v6MYxP8q7PTyTG69Emp0472nuLLG2t3CjSkj6y83NzYrh7t8ToWKqYgTHVZHrjKbN6L3Mq8COH1Rw54TUVpuUbI7vVvdW1zW4+CR+MR535WoifPJ0XgN7PzdEyR611m/37VkyLJHC93O2gV30lVV+nKucK7bqieZ6HYq8uFRPqN25wkTHUrl6FXudU1xrSDRdqp6uSx3i9TVU3gQ0tqpVmkc/GeuzU9VMK7XH8SqV6YPMlFx14p651TctJcPOGtPQXK3ry1kt4q0d7p1x8aJhEXOenUzlomDXVNpjwuIddbK28+O5UktsasjSLpyoqKide+xqzIm7XZsZU1t6IqHUNZ8QbDoKlt8l3Spqaq5VLaSjoqOPxJ6h6qiLyt8kRcqp21y/F2VPRSTjle+GiRiParJER7FTCtcnMi/UpwEmhtFVNY6qqdIWWaZ3d7qGNVX7jsS9giYTJBwrtG6PWJrP4J2blYuWp7hF0X7DlYmJG1sUbUZGxMNY1MNRPRE6H1yRE6jRqf1QmOgd2LsBEDl6E7hQra11tobtbaq2XOljqqKridDPDImWyMcmFRTxBWUepfZY40/pCmiqLhou6P5MouUqYM55FXsk0fdPNPRVPdSdjgdVaSsWttN1endR0Tau31TcOb2cx2z2L+y5O6KWX4latM6osWsdOUmoNO17K63VTcskb0VFTu1yd2uRe6L2ObPDmmbxqD2YeNFRpXUT5avSFzekjpkT4XxKuGVLE2e3s9qd8L6Ht+CogqqOGqppmTwTMSSOSN3M17VTKORd0VBYSvoADKoNik3AABe5Q3BMl7gCk3BBHdWqYn4V8tRxe4wXDuq3imps+kcH/AOTLTer2ovmn4mIOAzXVP90O8vXmWv1ZWYXzaxGtQ34s1mVTHPHKpWk4B62lRcKtskjT5uVG/mZGUxL7Q8qpwOulI3vXVVHSY8+eoYgnY7jpqm9z0zaKP/IUVPH9kTTsLfoocfSsSNEjRPoYbj5IifkcinZDLQBuApkAeoQ3Gw2AUAHqAGwQBDcbgeoUIUgAuxCgABkAAFAoJ5ggAAqA2AAEACqhFKAgAnYAAMBABSDcKbAuepAgBso2ChCjAQ2Ot68q/cOG+pq1Vx4FrqX5/wC7U7J5mP8AjVU+68B9bzZxm0zRp83IjfzEG64L0q0XArRVOqYVtqgcqerkyv4nfDgtFUyUXDzTlInTwbbTM/8AptOeN1l0bjBVrRcENaVCLhW2epRPmrMJ+JyGhaRKHhvpikRvL4NqpWY8l8Jv/E6r7QdUtNwB1Vh2HTwx0yeviTMb+ZkK2U6UtkoKVO0NNFH9jEQl6J23YIhTDQCbgCkBQAG42KATyBOygdc13q63aD0NddV3Rf1FBCr2sTvLIvRjE9VcqIeaPZk0TU6v1JduNGrVWrrZKuRtD4iZRZ16yTdf3UXkb5dfJDd+1/qqeqTTXDe0v8SrrZ0rZ4md168kDV+blcuPRD0VoHSdPojh5ZNLU6J/e+mbHI5P25V6yO+tyqa6jPddmb0ZgqEQqmWgJnHRyt6pnC+oUiqiNcJ2jzp7L1LFO/iJqZ7kkq6+/wAkTlx1RrVc7v6q7J3LjLxjt/Degt9NST2+pvddWRwtpqiX4YYs/rJZEauWoidvX5HUfZOrln4d6lp1a1Eiv0zkVO68zUXr9h16/aD0nX+2zZ6GewU09NXWuS51UUyK9lRP8S87kVevVE6duhv6yyJYotL8S+N1v4iab1FR3u3acoJLfJCiP/UVL1y2SPKYVFbzJn0Mkz6u0wzV0Gk1vlIt+mY6RtA1/NLyomVVUT6PTr1wbix09joqeot1kht9JHTP5JoaBrGJE9W9nI3s7HXr1PNNtbfvZ01NWXHU2nKG/wBgvdzVj9UQy/x9qSL8LZGu6rjqqonfr1Fmwj1UnVDQ2op5ZpaeKeOSaDCSRteiuZlMpzInVM+oje10fM13M1yZRfNFTKHiriXNril9qXV9g0FdUtNXfKGKeeobIsfLDHD4r15uvKvwKmfXG5PHla9rOVG469zW1MtyeJF9oziNV6FsFZYZop1sMEEmo6+eJq+8PfLyRxdd1b1XHVVyuxkPjR7QV101qSk0jo11NRVCQxT3K61cLp2UaSN5msRqIqK7lXOV80RB68mvSjndeimtHIqfV3PG1P7TWtLFwvqKnUNDBV324VCxWOsmp/dmzQp0dPLHnqjVwiY7rlF7HGaR4pa80vqir1heNbXDVulaamd+k5nQuZSTVTmL4VPTK5Ey7nwnMiImEcuMCeJa9tNVFfjJqVDxrw+4m8WNd8UdN1FBqmar98q1ludnpaLloLbRIuFR71Tq9UzjHbp1VVweyt18tiWYspsE7gbEGN+MfC6h4p6EntLvDhu1Nma21Tk/kpcfRVf3HJ0X6l2MH+zLxIuFmvlXwa1gslPV00r0tzahfihkaq+JTdduiub9aboeuE3PGvtU6WqdKa+sHFjTjFp6ieZjKiRqdG1UWFieuP3mJyr58vqan4l/XshFyiFOu6J1NT600LZdVUjPDiudKydWL+w5ej2/U5FT6jsamGkIoKBAoIpQKMjYgAACK5I051XCNy5V+SZMSezcx7+DyXF+ea4XWvqlVf2uadUz/VMk3+qSg0zdq5e1NRTy/wCzG5TpfAGB1P7P2j2uTCy0azr/AE5HO/M3OmayeYe9oFfF0jpm2J1Wu1Pb4uX95Ek5lT7jMJh3jOvj6u4U2/P8tqZs3L5pHC9fzKMmUy8znL5vVfvN8cfRdYmr59TfmGwuxCgB5jzG4Q2GQNwoAAgAAIPQpAqkBdgAIAKAoQBgAAANgAG43GQikwUgAilGwUAGAAAVURqqqoiJuq4CBex1XU12morpp+KlrfDZUVvhzIx6fG3HZfQ7Tzscqo17XfJyKSXTAqkBQA3AAABQDcBDcxN7RcvJwA1DCirmqfS0yY356hjTLJh/2h1WXhxa7a1MuuOoLdTo1P2v1vNj+qWdlZetsHu1qo6bGPCgjjx8mohucYQqdHO+YXsaZYX9pF6u4TQ0COVFr7zb6ZPXMyO/8pmFUxlqdmrgw7x7atWzh7aEdj37VlG1fk1HOMw5y5y+bl/EzVgnYo7AioUEAFAAAABsR3b1KMEHjzibZr4321tN3itsFfcrU+ooXUy00Cva5jE69e3wv6rlU6IexFRUyirlfPzNLMtcqIq48jU41uxMRO5ehE7ZCr1MqqGJ9R8V7/BqCtsWjuFmodSVFHIsElU5iUtKj07oj3fST1TCGVw9VczCqq/WVHj3gzYOPll01fYtMaesdkirbm+V637xGyMciYVGMx8TUzjm3O51fAviLrvW1tvnEnW9DDHb6d0ccmnYlpqhOZc8nNhPh79e56OYm7lVfmpc4ca9kxg+8rJwJ0/T2XhnwzvGqJ7rK+eeq8V0uZeyLM9EVyqqduyY3OHsXDLX3E7VdBrDja6Ght9uf4tu0vSO+Bjs5R0yoq+SdMqq464Toei1VVb3VPkp8Wpheg9jGpU6Lg8/ycK9UXr2kta6sr4I6Kz1tlfQUFbzo/mfJCkX0U69E5soegsZTB8sYfkzuNZrAsHs0WyDgHPw5ivaRXSrqY62qurIVVJZWL8Kcuc8iN6Ime/U4aj05rbhNxV1RW02g6/X1gv1PTNhmgkjdI18TEaiSo/fKL1x5YPTDVI/qpr2Zx5Z1Fp/ijNxE05xYu/C+ju8cFG+iqNNU9Q2Z9IzK8jviRWq7C5wiKiHK6wtPEvi3w5uFsj4bxaSgtstPXWulq6lni1c0bl5o+RuGtarVXGUTrhNz0arU6dDXG1EzlO5J5LjDOnOKer6i50Flk4E361zzSRxVc7fDipoUyiOk5sdUTquDNGfISLlUTb5k7C3SRSbAEAx9xl0imteD2orIxrVqfd1qaZXfsyxfG35dlT6zIJ85mwvppWVDUdC5jkkReytwufuyJ2PM/scapkuGhL3pOplVXWiqbUU7XL1bFMi8zU9Ee1V/pHp1eqnin2PHKnE/WLYHYpUofof/wCx8K/UmftPavqa8kgAQw0DYKAGAUgAKUgHT+KNY2g4P6wq3rhI7RU/exU/M+3C2kSh4P6PpE/xdopU+vw0VfxOte0BOsHs96wVruV0tK2FPXmkamDIdgpkotNWuka3lSCkhjRvliNqG50y5NDDXE13vPHfhNb06+FLcK1U8uSFEz/WMyp3MLatclT7VGjYFTPuWnrhUJ/oq9yNRfuL8PrKlE3ETU8kQ3xtaVMNN0YaANiAUDICgACAAAAAAAAAUAKADYCFJuUAAoAgKCAANigANwAAAIAAgbavoKW52+a31jFfTzt5Xta5WqqZz3Q3PcEVi7U+jbDbbjYY6OnlYytrfAmRZlXmbjbPY7raNKWOxVT6m2U0kUrmLGrnyuflufJTmJIYZeR0sLJFjdzMVzUVWr5p5Ka07EnjJdNUbgGkAAAAAU2GwGwAxHxoVai68MLX0xVavpnO+TI3r+ZlsxJxIZ73xq4PW9eqfpKtrMf9FA3H4lnaVmJOqZ81KoamGoNyssMcYHsdxS4PQVEjYaVb7LM+SReViPZCnI3PbKqq4Tcy8xFVfhRVT06nGaq0np/WliksWpLbHX0MjkfyOVUVj07Pa5OrXJ5oY4X2cOHUX+B1GoqJfOnvU7cfaqizRl5Ud+47/ZU058+n1GJHcBLdE3Ft4i66ocduW8OeifU5D5s4O6spWqlv46awhTZJ/Cm/FC4msvo5q/tJ9ozleioYhXh9xkpv8B46SyonZKyzRPz88YDdOe0RT/yHEXSteibVNodHn/ZUnquswYUnZcGHVT2laR2Ui0Fc0TZHTwKv4ldqT2hqXrPwv07XY7rSXlWZ/wBpCeprMWxMmH28ReLtMuLhwHrpE86O7wv/ABPm/jHqekcn6R4H60gTdYWRTon2dy+prMnY1J2MNN9oKwxNX9J6F1xbnJtLZXO/BSt9pXhcxOWsqbzQu8qm0TNVPuUmLrMGepqVcqYrp/aC4OVKp/680kKrtUQyxL97Tm6Pi/wsrnIlNxBsLlXsjqxrF/rYJlNjveMIaO6nCw6x0nVYSm1TZ5s9uSuiXP8AWOSgrKWoTmgq4Jk/+XK134KXDW5wF8iplyfCir8uppdlHJlrk+aKSrGpCKVFREyq4NPM1V+kn2gXPTBEQZwpq27DKapoXuXJM9SUVNwvcNQL3AY6FToNiZ2KG4Um5qwQQAFBTYXmhmuWnrlbqaVIpqqllgjkd2a5zHNRV+Sqb8qCI86+zpwa1Pwuu2p6nUy0qvq2w09M+mk8RJWNVXOdnuiZwmF9T0SiGnCc2TVsN2qEKCCBCkADcpAKQDuoGH/aNe93Bx9EzvX3WhpceaOmRV/AzJEzw4Ws/dRG/YmDDPHvlno9A2tXdazVdGnL+8jcuX8DNSJ1d81/E3OmUMJzOSs9rm4JtQaSiZ8lkqFX8FM1u6NUwfp3NV7VHEmpXq2jtlupEXyzh6oPgzDTphpuEPlD9FD7GWgAgAABVBCgAB6hAAAANgAAG4AAACF2IFUAAAAQAAUAgAAbAAEAG4AAKAAAQCjcAAAAHqAFAAERTE+pMVXtScO6ZUz7jabnV/LmwxFMsGI3O979sKmYmVbQaOe5fJrpKn80L49pWZE7F7EBUN8jcAAmFJhPIoAiI3yCdOxSAVeqEwi90Qbl2AmNsITkXZyp9ZqKNGhEf/lHfaaHwRyJiRjXovfmai5+1D6qBo42bT1hqmr7zZLfPnv4lLG7P2ocLUcNOHtWq+86HsMme6rQRov3IdsUDRjar4FcIKv+V4e2hFXeOJY/7KocVL7OXCF2fd9Ly0arvS100ePlhxl7HQuS6mMLf+jnoeNf733rVltVO3u16l6fbkq8CK6DC2zjBrmkxs6ubKn9ZDM/ruXPTqNMYYdwn4k0rc23j3f0VOzaqiilQ+P8BuPlM/mpeM9vqkTs2ssrev1tM2BEQaYwu+1e0lStTk1Loe5Y/wAtRSxKv2EZcPaTpUVJdMaIuKJ/kq6WJV+1DNOM9zTyIql0YVXWnHukdip4MUFWid1o723r8kcF4rcSKZEW58BNRMTd1JWQzGakY3yT7DVypsTheWEv7vFVSri5cINd0jU7uSgbKif7KmpPaO0Uz/D7Bq23qnfx7LJhPsM1rnsiqn1qRUymHKrk9eo4OWG4PaR4RTKjZ9RVNC7yqrdPHj5/CpytPx14QVOPD4hWhuf8rI6P+01DI01BSVCYno4JU8pImu/FDiarRmlK3/C9K2efP+UoYnfkM1HHUfEnh5XNzSa6sEudkuEaL96oc1TagsNXhKW926oz28Krjd+Djr1Rwk4ZVefeNAWB2e+KJjfwOIqPZ/4OVCqrtA26NV3gV8ap/suJkXayO2Rj+sb2vRf3XIv4GpUd3Rjv9lTEkns3cLeZXUlBdKBdvdLrOzH9Y0/+j5pyFP736z1tQKnbwr3IqJ9SjDWXsqidWqnzQ+avRF6qiGI04K3unX+93GnW9MidklqI5k/rIHcNOKtN1t3Hq6P8krLZDJ9uC3xNZcRyKvdPtPoqdDDbdI+0BTL/ABfixYq3Hb3uy8ufnyqanUftKUrfgumhLl/Pp5olX7DPqusw7Aw6y7+0fTNxNofR1wxvT3OSNV+WUPk/XfHWkVEquB8NUid3Ud6Yv2I4eqazNuUw2nFrXtPHzXHgNqiPHdaaohmQ0px6igXF04Xa7ocfSVbX4iN+tq9RhrMwMNr7R3D6JUSuo9S27z96skyY+zJvqf2ieDk6Zk1iylXyqKSaP8WkyrsZV3L0wY9puNvCSrcjYOIVkyvZH1HJ/aRDnINf6Fq2otJrSxTZ/duEX/EZTXSOKvLVcVOD9udhUde56lUXr/JwLj8TMbVy1q+aZME6juFFqH2n+GlHbbhT10dsoq+umSmlbKkeURrVcrVXGU7GdkTDETyRDfxGl3ZTB3DmX3zjXxfr1yq/pWkpEXbEcKmct0+afiYJ4LReLeuJlyTCtqtW1SNd5oxqJ+ZFjNcXRqH03NEf0TWZaUhQA7AhQAQAANwAgoAAAAKAbgB6gbAIAAKbAbgIAAigAKAAAdwAEAAAAAUAGwQAAAAAPMBAABSATsYk0ynvftXa3n6/xCwW+l/21V/5GWnfQd8lMTcNW+Px94wV6/s1FvpE/oQuX8y+KVmNSbF2IVAAAOmQAAAAAAACkADcAoEAGwBAAABdibgNxnA2ADuAAHqCgCKANwKQAAMdBuAG47gAMITCeRQARE8gNwAIrWrsn2FTuAJy+S4Jyvz9N32qahuXTGhY0enx/F/OTJtp7XbKlOWpt1LOnlJAx34obwDTHWarh/oatVVq9HWSdV3fQRr+RwtZwV4T16fxjh9ZFXzZTJH/AGcGQANMdV0jw80XoX3ldKacpLS6qVPGfC1Vc9E7IrlVVx6djtSjzCgOytVfNDBPs/Ks3D+53Ff/AI/UFxqM+aeKjf8Aymba6dKa21VQq4SKF8iqvo1VMO+z7AkXBDT8uMLVLUVK/wBOoeuSXpZ2zDH9A17Ghv0TUZaUbD0AAABDA9AAAAAAIAA2ACnYAAQoHUIDcBAAAAAAigAKgAAp2BQETsCgCAAAAUCYBSAC7D0JsBSAAAUgEcmWqnn0MS8GHpV6x4s3NFRfG1S+BF9I4WIn4mXW9Xt/nJ+Jhr2dGrJpTV1zXC+/6or5kdn6SI5GIv8AVNRms17kz0L3JgC7DYnZAACjcYADYKXYCADYCkAADYBAKQKAAHoNwAA6gX1IXYmQGxe5B2Aq9yZL3JgAXYigANgAAHzAAAAAAAACAAAAVACgF7k3G4AADcAUhQOt67qvcOHOpaxenhWypd9fhqdO4LUyU3BHRUSJj+9UL1+bsuX8TkeOFS6k4C60nb0VLZIxPm7DfzN9oOj9w0Dp2iVcrBbaaPKJ5RNFWO2NTCIauhE7IUy0bhAAAACG4ACg2GAEBgAABuAoANgAACAAAAvqRQAAIqkAKigAAQoCpuAAA2KAIUAgE3KCom5QQCgEApNwvYAfOolSClmmVcJGxz8/Jqr+Rif2ao0/uFW+r6Zra6tqVVN+aofj7kQyNqaoWk0leareGhqJE+qJx072faNtH7POjmNT+UovGX5ve535mp0ze2Tx2AAELuMAQDrkoE3KpMDcAF7hB8wG4QF2Ag3HUoE2KQABuX1JuAXuAAL2IAA9SjHQAMEKTYB3QFQIBAAA2BUIBSAdwAAAbABQABFAoHoABQNwIXcEADBSAYm9oyXk4Bagp0yrqt1PTIibq+ZqYO/W2BKekgp2phsUbI0Tyw1E/Ixz7QyeNw9s9v5Vd79qK3QK1O7k8ZFVPuMosREmeidkcqfeKsbhCkTGCmWj1AAADYZCAACnc0vekbHPd2aiuX6kNWx1m/yaubJUpa6S3vofDXD5XqkmOVebp9pKRzNqulLebYy4UXP4L3K1OdvKuUXC9DemNtEz6r/g/TtttNb5Lf4zsvneqP8ApfFhPwMk7+hPG7CzKEKDQADcIAAAAoCmwACAAIoAvYbFQA7BAA9ANgoUhQC9ibD1CgCjsE7ATcpAAKT1GQgMBRuAyAArp/FKqdRcH9YVbXcrorRUuRfL9WqfmXg/TLR8EdF0yphWWinynzYinYbvbKa9WKvtFWiLT11PJTyIqc3wvarV6b98/UYi4S60j0hHDwg13PHa9QWVvu9vnqHcsN0pUVfDkievRXcvRW9+nzxrxYrOi9yGhHOkbzNVHN82rn8DVl/7q/YXEXHUDt36fMZTHVUIoPQ08yeY52gaiepOZvmXKAXYbgATA9DUiGlUApC7EAFIhcANlIFAFQnYqE7gPUDYuAAAAETsVO6jAAhSbgNlALgAQvoRAABcAT0AAABQA6lIgAAABkYKQB5AAB1GSk7gYf41p7xduGVuTvU6qgd64ZG935IZPhXmyvmqr95i3ie9tRxu4Q23GeSurKxU9GQ4z9rjKVN0Y35EqxuSjGRkimRsAFAAEAAANMjElhfE76L2q1ceSpgq9yoBxtls9NYrUy3Uj5Hwsc5yOkVFdlVzsckARUBQEAQvoVQbgBAfIAAAAAAJVB2AKAA3yEAChQEQoEKAoEUpABdibgbhBe4AAAACFBAC9lOqar0fpnWVAlBqiyUt1p25ViTs+KNfNjk6tX5Kdr2NvKzKKFYYk4A8P40/iM2o6DG1Pe5kT71NvHwShp3L+jOJeube3OUa25+IjfT4kMxuhVcmnwcdUG1MjFLOGWtKbLaDjpq2PH0UqIoZkT557mldIcaaNf4lxw8dNvfbMxy/XhTK6xLk0rEq9C7TIxS2h9oqBcwcQdKV/pU2t8ef9lD6/pP2j6VMLSaCuS57+LNEplFIlahp5Fz1J7U9Yxk3WfH+mX+M8MNOVyJvSXlGqvyRx9HcUeLdM1PfOA9bLju6ju0Un2JgyOsa+RfDTsrU+wvtU9Yx0nHDUdN0uXBHWdOid1iiZLj7FQ1p7RGn4VRLlofW1uz1zLZ3ORP9lVMg8qtX4VVvyXB9WyyomElkT+mv/EexjHjPaU4WKqNqbhdaBfKptM7fwapyMHtAcHahM/w+oYV8p2SRr97TtcrPEX4/j/nIjvxQ2stns9U3FXZ7fPt+tpInfi0vserZ0vGLhZVuRtPxDsD3Lsta1q/Ypz9JrHSVdj3PVNoqM/5OtjX8zp9Zw80JVuVanRVimz+9QM/I4afglwnqGqsmgbS1V6qsbHM/BR7Hqy/FX0E6ZhrqeX+ZK134KbnrhMIqou6dTAz/AGfuE7lVYdNTUbl3pbhNFj7FPi/gJo9qIlBetWW9E/ze9y/mNhlZ+XmTryu+w0LInkYFh4M1dE5HWvi5rmjVOyOrWyon+0huF4e8SKdc0HHjUCKi9Eq6GGZPrGxMrOaSIas+RgxbDx2pERtLxftdWif55Y0yv1tU1RO9o2lfn9P6HubE/wArTTQqv2INhlZxQphJdTe0TSr8ekNF3FvnT3KSL+0am8ReNVOn8c4Jx1XmtDe41z9qDgZr6EynmYUXjDrmmTNy4EaoiRO6008U34dys4+UsOP0lwx13RLuq2tJET60UvCM1hexhhPaQ4cx49+g1Fbv+tWaZPwRTd0/tIcG5nox+sW06r/nNHNF/aaMGWy4MfQcbeEdSiLDxEsSZ2kqkYv2Owc1ScQtB3DCUWs7HOq9uSvj6/eMV2YpsIrtbZ8LBcqOVF7KydjvzN4x6vblmHp5tVF/AYmtYU0/F+4v2F6p3THzJiqgL0RMkVU8wG4Q0o5vmVHJkAFL0CgTcJgFxgCF7EKBCk7FAhQQCqQoVOgGFNYvSp9qTQcDXIi0dkuNSqfzla38jLdOnwNMP1auqva+laqIraHSLceiyTrn8jMcP0UJWp0+oAIBCkAvzAAAgKFCFQBAEAFIUAAAFAAgQKQAAAFAAQAAUAAEOwG4UBsUiFChCgAQAIbgAKYAADYABAhQBCKiKXuAr5rGnkPCTyPoAj4rCnkTwU8j7gDbrChp8BPI3RdgNmtP6E8D0N59QwgGzWn9DQkHob/HoTlTIVsVpzR4HXscjyoqE5GkGw93zsaVp/Q5HlQcjQji1g9AkKpscmsaGnw0CuMWFR4SnJrEnkafCQGuO8HJFiVOhyXhIPBRdgOMRjtwsfTq1PsOR8BPIngJ5AcZ4XXKNx8kNWZG/Re9vyeqfmch4CeRpWnRdgNg5ZJG4c9zv5y834mzlttBP/hVvpZ08paaN/4tObSnTPYjqfKAdTqtGaOrWq2q0lZZkX9+gj/JDgKng5wsqnOdPw/svMq5VWQKz8FMke79QtP07FGJJuAPCOfPLo6Omcq/SpqqWJU+xTbLwD0JBn3Cp1HQeXu97mTH2mYvA69jSsGeuBtTIw6nBKnjci27iTrqhVPK6+Kn9ZDdN4Za0pY+Sg456uj8vHjhmx9qGWEgxsR0Q2mRif8Aglxpo0RaHjgk6J2StsrHZ+aopfA9oimciw650jcETu2otkkWfraZUWJV7kdCvce1PWMZpfPaJpU/WWPQtyRN2Vk0Kr9pE1/xypf8K4Q2utRO60N7Z1+SOMmJGu5o8H0yX2p6xj5nF7iBT/8AtHgRqFvmtJWQz/hgj+PbqdP75cJ9d0aebbckifc4yAsWF6NT7DcMV6N6PenycqD2PVjeP2ktBx/DcbTqi2u8qmzSpj7Mm6j9pDhBJ/K6qkpV3Sot88ePtad7e+ZUVFkevzcq/ibJ9HBMqpPTQyovfxImO/FB7Ynq4il44cIqzHhcRbK1V2ln8L+1g56k4iaCrse6a2sU+e3JXxr+ZxVTpLSta1W1emLROi9+ehiX8jgarhHwwq3Ks+gLE5V7q2l5F+5S+x6snw3a1VCI6nulHMi9ljqGORfsU3jFR/Vio9PNq5/AwfNwE4RzLzfwLp4HedPUSxL9zjbJwF0HCqrb5tRW5V/zW9ztx9qk2GVnvCp+yv2GhXp5GCk4MxU2HW3iXruhVvZEuvip/WQ+ruHWuY2qtBxy1XG5Po+8wQTJ9fRMl2JlZw8RFK16L8PfJhBmmeNdHH/FONMFTj/PbEx2f9lTa1WjeKupWrbtX8WUZaHpyzQWG3pSSztXu1ZF6tRfQbDK+2j6iDU3tD6+1XbHpU2qjpKWyR1bfoyTMXnlaxd0Tsq+ZmmLo1DremNO2bS2n6WxWChZRW+mTEcTOvVe7lXu5yr1VV7nZY0w0zea1GsEKAAAAAgVRkAIEAAoTvgAKAd1G4QBAFUAACkAQBQFQFyCCABSoDcBABSAKpAPQIFA9AG5AUCFAAgKAIAACkLsAoAAIAUIEKQKFIAigYAD0IUAQKC9AJtgYwBsAIpQoVOpdhgoE7AAAQ1ECGCYQoAmEGEKMAaVag5UwagFaORPIeGhrwNgj5rEmCLEnkfUdwr4rCnkRYE8j7gI2ywJ5DwEVOxuShWzWnTyJ4GE7G86EwgGyWnynY0rTY2N/wBPIYTBBx6wL5E939DkOVByJgDjlg9CeAvkcjyJ5Dw0A4xYVyRYlTscn4aYJ4SeQHG+Eqk939DkvCTyNXhp5AbaCNW4yb1vY0IxENZUXchSAUBRsAAHcCFAAhQAA2ACgACIUbBAoPUAAFGQA2AwAgACKAAqHYABQAuwRAoHcCgEUKApAKQACk3KTIFIUBEGxcYAEGwAAhQAA2yAAA2AAFAg9AACkwUdQGOgA7ABsAFQFGAAA3CJgoAEKAABABSAAUhQBCgARQBuFUhSBDAwUgAYAwFBtgAAAAIXYbACFAAAAIAACgBAAwAAIUBQbgBAAeoUAHcIAAB3A7AKAAABkAPMAAAAENwAFABuACABDYABQDsAgUmShUAAAABDIGAoAfUOyjIDAwEKBFGw2AAABQZHoAh6jcbAANwAAA7KAHoAAAG4AABQAoRAAAAAUG4AAAbBAhQFMAAARSgCFAAbEKTcIApAAG4CiAFAg2KAINgUCFCgABgbhAAAABsAAQbgAAAHYeoAAD0AncuxAFAVRgCF9APUAACAoAKA2A7gB5DsACAbgIdwBkANgAoAAAAUIbAYAAAbAABsAAADYAbgNgAACABTAA7hAAbAAAFEG4wAh5gACk3KpAGw3LsTYANhuABCgKAhQgAAAIAqgAAQpAKAAAACBANwoNwNwKAFAEAAoGB2AAAANgAgNwAAG4ADcABuB6jYCApAqghQAIUIAAANgQKoAICgAoBQAAACG4A3Cm4ACAA2AAdBsAGQMABuAAwAAA3KQBuAPkAAAUz0GwGwQAQAANhuAAwAoFA3CAA7gOwA9AHqAAAL0wQAAAAGBsAAAUAAQAwAqAIAAAAoAAnYuw3ARAAAG4AVSAAUAAANgAAUdghsFGRkAvYAAAB6AAUgDcegAAbAegABQAAAUBFKBCgANwAQAUhUABnqAGANgoNgFCHYAABsBvgAAPMAAUKnqB6AAAAgAoApOwADYAAFAG4AbgAAAA3AAAegTuPUBsBuAHoAgAbBAAoAAggUfIABsQoEKAFAAACAAMgAAAQIpCkAoAAgKgIIAAoUdgVDYAAAAAACgEGwwAoAAgMgAAAAAAAAABuF7gAAAoQoCGRhQAoBuCANwCgAAgAAAQAKAAIbADcAPUKPrCmwAAZHqAEBsAAG4HqAAAVCgeYAgKECFwAoAoQIDcAKbgFXoEQuwTdSL0AAAABgdwAHYAF7DuEAUIBsEUAAO4GwCg2BQiAACAF2CnoAAh2GwUACAoEL2IhVCgBAighQIUhQAACm4ACGAAAHcBAAAAAAAANgAHYBQAABuAEAOwAAKAoBuAgAAAG4AAAB2AAAAAPMhQoUCAIBC7AbhAYAAbDcDcCDcpAqghQAHUb98BHHXe92yxUnvdzqmwRquGp3c9fJqd1PnZLxJfKdK2K2zUtE9MxS1DkR0vqjE7J6qYeuda7V/EOGOZ6rSvqkpom56NiR3XHzwv2md40ayNI2NRrGpytanZEToiGPHy2tWYiopDWvc0r3NIAbAqCkRUVcZ6myud0orVSLUVsyRp+y1Ornr5NTdTqtPS3K6XR16fXwUl2hVFo7e6RPhj3bInfLs/UZt5xcd57E7qcRQ6gpK6ZaWVFo6+PpJSzdHIvp+8nqh962iqqt8Tqe6VNCjUVHJCjV5/VcoXfwxyDlx0yEXt1Op3Cku1PerTQM1JXubWvka5yozLeVuenQ5SmtFfBWxySagrp2MdlY3tbyvTyXoTb+DmPUiuRFOv6nqblKqWC10sck9fTSqsj5eTw2phFx08lOEmvVdDaa6xvt7KauiZHR08cU/ic7ntwnXGyZUW4Sa7634kyaUVebB1anr7zYbTSw1Flpm00Sx0/M2rVy9VREXGDkrvTw1Nxihp7u6gucTVdEjH9Vbvli9HIXeBzD/hRFwTOeqIdJl95nqrnLNJe6pY610DY7dLhGIjUXOF7JlTbVST09C6oi/hFSSMliw6tn+B2ZERUwi9ehm+S4yA1Mr2NasciKvKv2HB6wlfSaTuM0T3se1G4WN3Kv007LscGtJM9Mpp2+rn/WH/5NW5cTt3TK/uqnzQ1IdKs8M1NrOmhdSV1Ex9HK5YqqpWXmVFTqnVcHM6imZT01PLJX1lG1Z2QotLjLnPXCZzsSXjRzi45sZKqdDg4rHVq9c6kuvT/Tb/8AafBrKy3awoKF13rKuCop5pHMqHIqZbjHZE8y/wDiOwKqIVi57HUdXXWnhkprPUSuhhqnI6qmRq4jhTqqZTdypg0JWVlyZbmu95oaqpc9YKeCZY0SnRU/WSZReqJt6k3lrHcXLh3UIvTJ0pWy1HIsFfd5EqajwaVG1uFljT6Uq/D0anX5nYbi+7U8Uf6LjpZka1fEdVSOauETovT7xqY5RqFcmEMf3O5Xy40NkrVgt/gy1sT4Fjlk+J3XHNlOxzs101KlxW3e5Wx06ReOqJM/CNVcZVceY9oY7DlMh3RMmyq6SqrIo0p7jNQOauXOha1yu6dviOPqLdXQQOln1bVxMamVc9kSIn3DRzydWg6dZH3y4XZtRBeaqazxL/Kzxsb7yvk1ET6PqdyXsWXRCFBUaVXB1t2tLbNeW2i0Qy3atVVRyU6okbMd1V69OnocXxNvM9t07HRUsixzV71jc5FwqRomXY+fRDa8J7bFBYqu5cieNPMsWf3WNTt9vU53y/5esazjWQ2+IsbVka1r8dWtXKIvz3Ka169TQqG2UABRdgAAQAACkGwAAKA9QCgQbjYAMjcAKAepALsCYKABABQAEB2G4CgGwIGwAKgEAAbgAAAAG+AQeoUKQoAAAAAgDYBQAAAADYgRSF2HkFQpCgBhOy9lGwCPOFRFVae1VNEuW1FDVK5qrvh2UX5Khn6zXuhvtsZXUMiOyn6yPPxRO3RUOJ1Poq36lc2oWRaWuY3lbO1uUcmyOTf590OlxcN9T0Ve2Sju9LT4/wAdFI9q/YiZOMnl49R0tnky43qmSKcLZLJNbIkkrrrVXOrVMeJM9eVnmjW7fPuc0dJ/WADcKaHD3K2u9+ZdLfbKWrrlwxzqmRWoxqJ0VvfqcbUUN3r5eeq03aZZUVFR/vTmuynb4kTJ2tvY4a9011rIo6K3TMpop3ctTPzYeyPfkTzXsZsI4a2VD9T3SoS62aiWG3SIyOpikV/NIndrVVEyib7ZOfudjiuU0cr62up1Y3l5aaoWNF691RO6n3oKClt1JFRUcSRQRJhrU/FfNTa3WC+1s7KSgq4aKicz9bUIiumRd0anZPmJOOR0W40MiX+R9urLjV0toaj6p7qlXOarlw5rF2VG9VO3U9ioJFp66ku9zmidyyMctY5zXp36p+RytrtdHaaRKOki5Ykyrld1V6r3Vy7qpxS2Sutdd4lgqo2Ucr+aWiqEVWMyvVzFTqnyM+uLuvnem1k2tLVHQVbKSZ1JOviOiSRMczcpjKHH2y2vl1NfY7lUJUVUbIsVMbPDVquYqczU2VEOTutlq7jf6GtiuEtFFTwyRufA7Eiq5UVETKKmOnU31tscdtnq6n36pq5qrl531Co5fhTCdkQubTp1+eS6fwdp7fdmOdUwXKGD3he1S1HZa9PXHf1Ow6mS1R2t9bc6RKjwHtWNG9Hq/PRGr37nFpbtRXG40a3ZaGCipJ/HxTuc50rk+jnPZDlK+3S3K8UUk0jPcabMqxbvl/Zz6IWdJXSKyaN09UlXUS0tNJfnNlcyRY1RvhJ0VU69zVI6kbb7zHQVslVSMqaPkV8rpOVVcmcK71O1UNj8KtraiuhZIr7g6rp+ueXLURF+ffoadQUF2uXLQ0sNFFQudFI+Zz1STLXZVOVE6+hn14XX01nS1Vy0rcKKhhWeeXlRrGrhXYcir1+R1OnZb5Pe1/gzdV9yVW1Dv0gqpGqJlU+l5Hc7gl7llbDaVpYWPReeonVVdGvo1O5aSwU9Bp6ptcMrnvqGyLJPJ1dJI9Or1LZ7XU3HCWSgcuoaO60trqqSjWke1Xzz+Lzc2FbjquD661Z41mpoud8fPX07eZi4c34u6L5nwmpdYLYW2VsdsjjSFIFnbK7m5cYyieZyd0s0txssNDDUJHPA6KSOR6cyK5nbPopL1kX+rT6aa1zv7+3lcL/nf/4NaWCCgu0F5lu9XI2mikYqVkvOiI7HXPTBI11g1VylnVf+8NvcrdqW70TqCvqLdBSSqnirA16vVqLnCZ6GuM6Rx+rZKx8kDYZqR1JFH72+CR6o6flVMIuEX4O3zNpFHUxeGkktTV1lLVSSQ1NFEsvLnCviei9kyuETyObulhmr31MlPIxHLQ+6Qsd0wquRVVV+SG8fRXehrZ5bQlGkdQqSSe8OdnxETCqiJt0Qzn1dddhniqPE/R9NdY1hqualclLltI7P6yNVz1YuVym2TsV/pq+up20FFIyGKd3JUS5+Jse6NTzXt6HG0lJqu3sqGQyWqTx5nzqr/ETDnd+2xv7nbLhdI4IVuS0lOrf4y2BuHSL5NcvZO4+H102rkqKaWls9rl/SMFFXxuhe7oka9eWDm7O367HM0tFVXLxb/QXPlvKy4lhlRUjianRYHt74TZfPqcxVWJjLfaqO1QRww0lbHO5ucfCmcrndRd7D71ckulsq3W65ImFmYmWyp5Pb+0X1w1zbU5Y0z33OtauYklvoI3tRzH3CBHNcmUVMr0OyJzIxqOdzORERVRMZ81wder6K/XaamgnpaKnpIKpk/itnVznI1cp8OO6lvSRz6MRvRqIiJ0RE6YQ15H7S+qkKLuACoxvxZoJZbXbrixFcymkdFJjZH9l+1MHH8NtS0tuWazXCVIYqh/iQyOXDUf2VqrtkylUU0FbTSU1VE2aCVqtexyZRyKY2u/CyTxHPstwYkTu0NTnLfRHJ3+s5eXjZ5e0blmZWUEXPZFXJMpjp1MdWLQl6pnNZddRTNpW//DUkr8OTyVy9k+RkKKOOGJkUTEYxiI1rU7IiGvHb3Ga1Ao2NohQNgBSDIDHQD0HYB6jyAAAIAAAAKQpAqkKCIhQCqDYhdgAAApAAgAAoBuNggAAoAAgQpAHYfIpAq+gBAKmxV6IbSvrqS20E9fXVEdNS07FkllkdytY1O6qpj+lvGsuIaeLpuVdL6ZcuGXOaLmrK1v70TF6RtXZy9TO/DGS+V3LnlX7AqK1uVRUT5HR4+Fmm1XxLrV3e8Tu6vlq7hJl6+eGqiGifhtQ0arLpm/Xiwz5yng1TpY8/6TH5ynpkm38OP13hFyuDUvQ6FbdUXrT14prHr2KBEq3eHRXqmTlp6h+zJG/4t6/Yp32RcFl2aXtChvVuSmkRQAFCFAEL6ECgXAGwAZ6kXqo6hALsEGwQATBVAF2NKoXI2CCBVwoQKAz1yE6qTPUqdwqK3rk1Z6BSdwieYb0UKEIrU7qhoxk19MGncqDEwa1XoTBFXoBoVMqpqa3C5CGrYiir1Iq8yYCkTuVBiYU1qvQhMgaFTKmvsgQKRVR2DSvVcghRTWi9MEQL6BGle4AQKuwXsAEEIpSbgUEQuwDchcDYKhQOoDIACAAAAAKYACAMgfMAANwoEKQoQ3CgAAAFACAX6wNgoAAEBRuAVDAQAKbgbgID1A8wpgAgRcdAuETqqIcNqjUtFpTTs13q4pKhUc2KCniTMlRK5cMjb6qp1emsHEbUMSV191e/TXifEy22mFjlhReyPkd9J3mS0bLU8S654j0uh3rzWGzxMuV4Y1elRI5f1FO706K5UMmRNSNrWtajWomERqYRETsieh1jR+jX6Ufd6iqvM95rrpUtnmqp2I1zka3lai47qibnaUTBmT6rWvXqfNUyprG5RsLxZbdqCxVVmukKS0lSxWPTdvk5PJUXqi+himy6n4mLBJpCj0ulddbNM6kqLzcpFhppI0/k3pjq96twq4MzIuD5uy5yZ647ehKRj10XGSlh94jrtLXB6dVpEgliz6I9V/E3+ldf01+utTp6626axakpG801uqFzzt/fid2e07mqGOuKlmdJYY9YW39Te9NuStpp2p8To0X9ZEvm1W56Euxe2RvUG2oayO4WqjuESYjqoWTNTyRzUX8zcqdGQFQYCoC7k9MBBOxFKnYYzsoFQil7ExkB3CjsuAq+QDA2Ljp2IqgTcDtspU6hQpVTpnBpRQhgIETqVeigRQncimrsBFIXuVUAIRQncq9VAmSFwVE6dgIhcjsQCblQY9FGQqqRO5e5pXooGoi9yohF7hBUIncvcqJ6ANjTnqFXoG9V7KQakToRUKvcqp06IUaRjoQ1J2A07mo09i56ACkVMJ2GegEKMFAg7AfUFAUmPRQgNxsML6gEAL9QVBtgAIIC49BgCeoC9FAADfsAIB3KFAAAAIBQCAUDYEAAFQQF3IAAAAhSBWmWNJYnRq9zEdu1cKh1HU2rdO6JSmW6V1ZUVtU7FLb6dFmnqV/0WJt6r0O11NRFSUc1VO7lhgjdLIvk1qKq/chjfhTZn3aKp4n36NJb3qBzpaZX9fcqPKpFEz93LUyuPMzex84l1frPW+mKy76KnsNktNRLWqtVVxvfI/k5Y+ZjerVRVzuZUd2Q+WER2UQ+mckgqrlCFTsCiFINwCqTco3Ai9jidSUdTXaRvNHRwrNUz0UsUUaYTmcrVRE6nLqNh2MT2vVVLYqK02DWNBdtMzthjp4qiocjqaVyNRMJI3KN+SmTqOBsMa8s0kqOwqK93N9h87pabffLPUWq60rKqjqGq2SJ6ZRU808lTZTp3DR9Za471om4VD6mTT1S2OnnkXLn00ic0efkmU+wzJlW3XeZ4EnYjXSSR4XOY3cp84aNsEqSJUTvwnZ8mUNyo2No0yMSSN0auc3mTu1cKhtW29jXtd71VLhc4WXopvNwMBeq5Nn+jm5Vfe6rr/8ANN4pMgaWM8ONsfM53KmMuXKqfCajbPN4i1NRGuMcscmEN0RQPlBTpTtciSyycy5zI7mwaamlSp5czzRcuf5N3Ln5m4QKMG3gpGwPVzZ55FVMYkfzIfSeLxoljV72Z/aYuFQ+iAI2SW1jXtclXVLhc4WXKKb5O5C7BWzfb2OVVWsq0yucJKbiKNIomxo5z0amMvXKr81NahAjbTUjZ5UetRPH0xiN/Khrhpm06uVs00nN/lH82D7KBivjUQe8ReGskkaZzzRrhT5R0DY5GyJV1LuVc4dJlF+Zu1AwXzNgtsYq9a2r/wDFN8vcAaY2+HG1iOc7lTGXLlVPhPRtnlWRaiePpjDH4Q3AGD5U9OlOjkSWWTm/yjubBrnhSeHkWSSPrnMbsKau65KBtIqFsMrZEqah6t2fJlF+o3Lm87HNyqcyYyi9UNRANl+jGdvfKv8A8U3yJhETquEx1AyMG0loUlmdItVUs5v2WSYRD6wQJBH4aSSSdc5kdlT7BAPlUUyVDWIs0sXKv+Ldy5+Z84aNsEvOlRPJ0xiR+UN0pANEsfixOj53Myn0mLhUNsyga1yO97qlwucLJ0U3gGDSvU2bbazutZV/+Kb5SIMCNiRxtjRzncqYy5cqvzPjNStmk51qJ4+mMRvwh9wqlR8IKZKdXYmll5v8o7mx8jVPClREjFlkiwucxu5VPqCK2sVE2GVJEqaiRU2fJlPsPu9nPG5nM5uUxlvRUNSFXyA2S25vL/hlX/4pvE/AdclQDZOtzXyOkWsqm8y5w2XCJ8jcwxJBCkaSPeibvdlftPpkDB8KmlbUq3M00fL/AJN/Ln5mmCkbTyK9J55FxjEj+ZDcL3CAaZWeLEsavczP7TFwqG3bQNa5rveqlcLnCydFN2EGAvc2SW1m9XVf+Kb0AaIokhiSNHPeibvXKnxno21EiPWonjwmMRv5UN0adwPhTUqU3PieaXm/yr+bHyFRTJUIzM0sXL/k3cufmbgAbenpG071c2eaTKYxI/KH1nhSoiSNZJI+ucxuwprQZCNpFQthmSRKmofjZ8mU+w3L2eJE5iuc3mTGWrhU+Re5RitkluY1yO97qlwu8pvdwAAIUoEKQCkBdgAAUAACANwCgAAgAAAKQK4TV1JNX6Hv1FTP5Jp7fURsd5Ksa4Nhw0uFLceFGmKmjTES2+KPl/dc1OVyfainavxMXpprWGhbvW1OhYqa8WCumdUyWSql8F9LK5cuWCTtyqvXlUzbnJmsnKuVKinQ01drWSJGQ8Lrg2pXv41dE2JP6SbHK6L1FWaht9ay60kNFd7dVvpKulicrmxuTq1UVe6K1e5nVx2lOxVCENMg2AQKFRCInUruiBDcrujTY3G60VmtNXdbjMkNJSROmlev7LUTP/4Oh0/F+hnoIait0dqmidMxJGN/R6yo9q9UVHNXdCbM5XLWSY+uToWjZmXbXOtb/TrzUjqiC3wvTtJ4LPici79XY+o2klz1rrWB1DabNU6VtEyYmuVwwlS5i90iiT6Kqm6ndrLZ6Cw2WmtFsh8Klpm8rEVcqvm5V3VV6qol3DMb8oGxtBAOoChC7gIAAKbDIARVIF7BAGw2A3AdgAoABMABsBuAABNgKAgAhQgAAAKAAIAbjcAAAGwACgACAIUKeoAAbAECBSblAhQQAUhQBCkApCgAQFCg2G43AKAAAKhFCAIhQopCjcAAAAHYBApChUXuACBuCr3JuVFIUigABuACgBQ0rhSl2CIuOXGDpt80ndmagXVmja2no7xJGkVXTVSKtPXsT6PPjq16bOQ7knc1IuCZva9MdXLU3Eq1259yq9GW1aelxLUMp6508ro0X4uRqInXHXc7jZL/AGnUlphutmrY6uklTKOYvVq/uuT9lU8lOQcnXKHQ7nwyt012lvWmbpWaVu0q5kmt64imXzfEvwr9WDGWdLwyBt0Ijk69e3f0OgJYeLUCJFBryz1EbeiSVVr/AFjk9cOxk+b+Hl4vDkTWmubhdqbOVoaJiUcD/R3L8Sp6ZLd/EabxrS+X6+rp3hr7rUz0bua4XSoTmpYMdoUX9p7l6LjOPw+0mq+ItPC2Gp4YSVVSiYdJR3KLwXL5pzdUQ7lbbXb7PbordaqKGipIkwyGFnK1v/FfU3qdU6jL+nDGMOk9Xazr4aviLJR0dnp5Eli0/QPV7ZXp1R1RJ+3j91Ohk9HKjUa1VaidEROiITbCAsmHZ2//ACADQAdAAAAAbgBDYeQTuNgAAAAbAAMFIAAAU3A+QCCgDYB3UDcAQoAUIUAAAENx6AAAQoDuo8gOgAAAAAABChTzGw3AQA2C9wAA3AEKAoB5kAuwIAHdCgAMdAQoAbgAFIUBDsAAAA9AA7jcbAFAAAAKFCkyAAAIAAKhuAAAA3CohdgAA+oAIhQAqFQbl2CGSL1JuUBkABQhRsA2AAAABAeQAAAAC75HQigCggFIC7kVAUFREAKBAgG4UAAAABADYKAGw3AVChQEAAFAQZCKCFAADIUGwUYCAAAhQAqFACAACg3A3AmxQAgAAoAgCHYAoEIvRSovU4nU2obVpawz3m8VPg00WERETmfI5fosY39pyr2Ql61XLN6nCXLWGlbRIsVx1BQwSp0WNZUc5PqblTqVBatWa5alfqapqNO2SROaGzUr+WeVuyzyJ1TKfsodwtulNNWaJI7ZYqKDH7fhI56/Ny5VTMtvRjjIeI2h55mwR6noke5cJ4jnMRfrciIdmp54aqFJqeaOaJ3aSNyOav1obeqtFqrY1irLZR1DFTHLJA1yfgdVn4dUdFKtdo64T6br29UbC5X00i+T4l6Y+Q2nDu2+C7HTdP6tqJr2ul9T0jbZqFjedjGrmGtYn+Mhdv6t7od0xg1LpeGnYbAFQAAUCAAAAAA3BAHcAqGAB0CgACAAAENW5F7gAOoUAAo2AAbAKDYAAAgAAJ3GwAAbAACgRAUgAF3IEUgKFQpAEFAKBEAAAF2JuAAGwAABTIG4CAAAAAAANgACAAQoAAAAAAAAAbgBQAACgIAKCFTuAIUgRRuTcoU2AUqJ0CGOhxVw1HYbO7F3vdBb18qmoYxfsVcnRb9dtR611hWaI0hcHWm22zCXq8xpzSMe5MpTw7c+Orl2OWsvCzQtlVHssEFwql+nV3H+MzSL5uc/Ji2/Fk/XZ6K+WW6uxabvQ17u+KeoZIv2IuToVjpm8QuIdZqquTxrDp6d9FaIHdWS1DektQqb4X4W/I5u88LNCXdiv/g/Bb6vuyst/wDF5onfvNc3Bz+mrBQ6W0zQ2C28601HHyNdIuXvXKqrnLuqqqqo5t5PnDlMYL6BV6hCiqRe+CkA67qzSsGqbOkHiLTXGmd49BWM6Pppk+i5F8lXoqGjRuo5dR6bSarhWK6UkjqSvgRP5OdnR31L3T5nZ2qY3v8Awjsd81JcL1Jf9Q0D69zZJKe3V608SPa3l5sN7qqeZLxzD+MhsXOdvRTWYkqbFxB4cU63fTuoK3WdjgXxKuzXVUfVNjT6ToJk6q5E68ru5kmx322aksFHfLPUJUUNbGksT8YXC90VNlReipsqGpUrkdwTv1KVQAANxgAAACAoAKAATsAGwx1GAgAPIAhSAAAAGBgKOwAAoVAAAAAQKTcoEBdgFF7AgCCAFChNik7AUbABEAHYBsAAoAAgMFJkAAAAACgATsEB2ACmwAAAAIAAAAAoNgAgANwABQJsBuFAAAKEKAgPUBQAACgAA0uXCHC3zV+ndM0z33m90NFOkbnxwzzNa96oiqmG9+51zXV7vlTd6LQuj52095r4lnqq9ycyW6lRcLJj99y9Gob3TfDbSOnY3PZa47jXyp+vuFxT3iedd1Vzs4+SGNu8GcNvwhpEh4YW24uVH1V4WS51Mid3ySvV3XzwmE+o7zjqWOOKKFkMMbIo2IjWsY1GtankiJ2KvcuZMDI3CIUCYGwADIAAJ2IqZXJU7jGwBzuVEVNuphXR+qtMaK1jrfR13v1BaqeC8LU0MVTKkaI2ZiPe1M9ERHfiZpd1Q4qo07YK+eWausVuqpJseI+alY9z+mOqqmV6Eukb+iqqSuo2VVFVQ1UD0y2WGRHsd8lToffHUxvduGi2WSS+cMaj+D93YnO6haqrRV2OvI+NejVXsjkxg7DonV0GsdOtuLad1HWQyOpq2jf9Kmnb9Ji+m6L5Gt+U/rswAKIXcBACAAgDcL1BUEA2ABO4HqAAUbAANgAAKAIAAAx6lAVAUgAbjYANykG4RR8gTIDAG43ADuPUACkAFUhSbgAAAAUoEA3GQAUpFAAAABkBQABDYAoE3AAU6ADYIADAADsAqFA3CAG4CgyAEAPmM9AAGQAJuUBQKBuECFVCbBVGMqjfNcAIuFymy5CMf8N8XW9a01RKiOmq7u+hjdj6MNOiMa37VVTIKoiGONATpZNZax0dVI2KZLi+60jc/wAtBMiKqp8nJ1MkL1RFMTpb2iFVDSvfJqKIUil2CIF6DYqhUBdiACL3NRMAEKiYDUyHdCjS5VXoY6tNP+hePN8pIPhpr5ao7m5idEbNG/w3O+aoqGRM9Tolrey88ar7coG81PZrdHa0lavwrK9/iSN+aIiGb2sd8IUG2UKQoU2A9AAACBDYFAE7gpAKQF3AmwG5QJuAE8wA2GCgQpABQAAIAFAAENgNgABSbANwAAAKAJ3A9ACFIAKTIAAbDcAAB0AAAKBAAAACC9gO4CgACBNioECnoAAgAPUAAPQAAACAAANgUCAAAAApuAAG5MFBEQoIUdY1Vo2i1M+krWVc9svFCqrSXGlXEkWe7VT9pq+SnGwy8WLbGsM1FYb+1vRs7ZnUsjk83NwqZO8lzspnPq6xnfa3i42x11fBTWW1NpIXT+FTvdUzSo3qrWqqYRVRFO/2e6Ut6slFdqKRJKeshbMxzfVOqfUuUN5jYx42mu/DmuqZLZbJ7tpSpkWd1NT/ABTW56rl3I39pi98bE6XtkZxEOoU/ErQ9XD4iajpadU+lHU80T2r5K1UN9Y9baZ1BdJbbabm2pnYznb8CtbKm/Iq/SxvgbLUyuxKRRlF7AopCnCan1PadJ2V90u0zkYq8kMMac0tQ9ezGN3VQOazgL2Oj23iroa4ojJr7Da6tOklJckWmlid5ORyY+8Xbitougf7rQ3P9O3J3SKhtLVqJZXbIit+FPmq9CbP0yuzV+orDZqumpLteaOgnq0csDKmZI/ERv0sZ8sofKp1PpungWoqNQW2KFEzzuq2Yx9p03Tuj66+Xes1fxEttLLcKuP3ektUiJNFbqbOeRc9FkcvVynYabh9oalqUqYNI2lkqdUd7si4+peheTh16s1zXane+08N4HVszvhlvMsatpKRN3NVf5R3kiHbdLaco9LafitVI98zkcss9RJ9Oold1dI71VTmI4ooImwwxsiib0axjUa1PkidDVgk8c5NUEKbAbAZCAAIpuXcgKighQoQoCJuUABgDuhAq7E2A2CAA3AdgUgUAAAbDYAAPIBD0HQD0AFIoApCkAAo2AgKABCkCgKQIL6DAAAAABsAAAHYAB6gAAAAGwAAAANwFAAAAUgAF3IAKQbgBgIUgAdwAHkPUuxNwG4AAhQAoBsAgQoAEXOy4KArZy2q2VUniVNupJ5P3pIGOX7VQ43UOk7PqG3xU1RG6kmpl56WqpMRS0zvNip+HZTnidyZBj+J3FDT+YpKeg1hSM6NmbJ7tVY/0kX4XKfddeXiPLJ+HGoWyp3RiRvbn0XPU710Iqr2yuPmZ9fymuhS33iRdm+HZtG09nY7tVXeqRVann4bO6+hurHoVKa6t1Bqe6P1Dfm/yc8zOWGl9IY+zfn3O5pgD1/TXH19js11cjrpaaKvVOy1NO2RU+tUPpb7TarSxY7XbKSgYvdKaBsefsQ3uRuaQXqQo3KoCFCAJuUKdgAEMAeYIoACoADYAVSYKBNikUoDsQAKox1IUAQuxEAblG4CJuC7EAbAAACkAdAAqbAMgABsUhQoNiAAUgCAKQAO4AAbgeoADcANwAFAAEBuBuAAAAAAANwgAAdgA7BOoAADcAPIAABgdgKQpABSABsAAAAAAAAAAoBgbBAbgBQhQA6EKAgQoCgACAAChAUIAhQpsPUeoAAAgAbjcqA7lJuAA2KBNykHqAAAFJ3AAblIAAXsNgFUgG4FBB2CG5SdygTqXJAAQF7EAF2IUCAoAgAAeoz1AAAAAAAABAqgAIAFAgKAIgAQAC4IAHUAB1AUAEHzAAdwO4AegAAAbgABkoAEGQBSAKAAIAbAAB2ABAMgAAAAAAEKQC5GwAAAAAAFABtgAB8wA9BuAAAARSbgIAG5QBCgAQo3IA9AnUFAidgBkCkBcgQAbgUgCABuUARBuUgAq+hFAApCgNyFAVCp6kChAICgQAAAAAGw7ABsMHEX/UNBp2hZVVySP8R/IyOJMucuMr32Q+9mvNHfbW24UKvSNXKxWvTDmuTuik2dLz25AAbFRSOc1jHPe5rGt6q5y4RPrKcddLRRXhtOyvR8kML+dYkcqMk6dnJuhBu4KqkqkVaaqhnRvfwpEdj54Psh0q60NFatY6efZqaOlqKiV0cscDeVHxInVVT0O2V9T7nbqmr/AMjE6T7EVSS/q4S1lHFVNppKyCOZ3aN0iI5fqNx2U6LpvTlDd9DJW3GnZUV9yY+ofUPTMiOXKtwu2Ohy2i6+e4aUppKl6yTRK6B717u5Vxn7BLfpjsM89PTQrLUTxwxp+3I9Gp9qmmCogqYklp5o5o17Pjcjk+1Dj6mxWy43VldcIPenRx8jIpV5o2/6SN7Z9ThLVTU9u4h3SitkbYaP3ZkksUfRjJFXphNlG0x3DfB8ZKyjjqEppKyBky9o3SIjvsNhqO4yWnTVbXQKiTNajI18nOXCL9R1WFugoqWK3V08E9ZJy+NUyI5VWReq/rOyLkW4SO/gjURGphERETCGo0iAAADg9Qaotum2QJWpLJJPlWRxIirhO6rnshyVur6a6W2C4Ub1dBM3maqphfJUVPNFJs3FbrceoBUB1AAAdh2AAAKDIAQyAPUAAUCF9SFAg9Ck3AFUigAAAAG4AbADugDchcgKAAANwAgAAAAAAAigHYepUAAAKnYgQCk9Sk9AHcDA2AAABsANgAGwUAAAKQvqAqAAIAeo3AJ3KAFAB3AEACKQFAm4A3AbAdugCgHcBHD6h07Q6joI6asdJGsTudkka/E1ey9+6KfayWajsVqbQUXOrEcr3OeuXPcvdVOS2UEybq78AAUDjL3eqGxW91XWyd+kcSL8Urv3U/47HJmyr7Ta7r4aXKhhq0iVVZ4rc8ue+CX+Dr1g92krZL3d7nRPulSnIyJkzVSmj2Y3r38zslypXVtqq6Nv0poXxp81Tp95sY9Labie18diomOaqOaqRdUVOqKcx3XKkk+U11LSF5o6TQUKVc7IJbbE6Goje7DmObnbv1NxoakkptJ07pWKx1Q99RyqmFRHOyn3HJ1NgslZW++1VqppqjOfEczqq+vmcmmE7CS8aa67qHUEdo8OkpljfcqjpDG9yI1n+m9dkT7zXYaa2UFOsLLrT1twqX+LUStlRXSv9E8k2N7W2KzXGo95rrZT1MqojeeRuVwnZDTS6fsVFUx1VJaKWCePq2SOPDm7dCSXTWw1tSTVmiq5kDHPki5Zka3uqNXK/ccbWV2n5+Hcqxy03ur6XljiZjPiY6Iid+bmO6L2U4qLTlhirvfo7PSNqEXm8RI9/PHYtltWXH0sUdRFpy3RVmfHbTsR6O7ouN/qwcioX1G5UNwAUcBqTStv1J7u6qllhlgyjZIsZVF7oqKcpbrfTWq2QW6jarYYW8reZcqu6qvqq9TdgmTdNBsAUANhsEACgQbjYAANhuAKRAAAKgEKQq9wGxEC9igT0BSAAoUAAAAx1GApdgBB5DuAAAAABQbAIEOwKQAAoCmwGOoCKTuPQdgACgANwAAHcAABsFAAA7AAAAUIAmwUB2AAAAuwEA2AUL2JsAgCk7gAUm4DPUbgbgB6gAAQvqAIChQAKEAAFPUABAAANgAFAQoEKAEAQAUAgVQBuAAG4QAAUKQoRPUpBuATooUKNwKT0HqNwKNibAAFG4ApMAoEUAAAAAyANwAG4Cg2AADuAncB3GwAQwBkbgUAEVMgDsVAAYAAeoAAbjsA2HcF7AQegAAAAEAAUG49AEABkKAegQAAAACFCJsM9AAG5SAAAoUAMAAAAAHoAFABsAAAQAADYAbBUKAAA2IBQgG4AAIEABkAAAAA7BQABAAbAMgACkA9QKTcABkAABgDsAG4TuAoANwgAAAwAFANiBFyANwoBuNwJ6FBAKEGwCCgbDYAACKKUgKgUhQIOwHcAAAAUeoADIChQABApAAAAUAGwAAIEANwAKQoUAJ6AANxgIAhdgG4AAuxAUCADYKADcIeoAAAAANhuQChAAoAAAA2CHmAAAAQAOwAU2AAQUAbBQIAAAGwQGwAFUmAUCbDHQAAqDuo7jcAAAA2G4AAAABuAqAqDYAAACICFAEKAIUAANwAgoAIqkKoKiKAAA8xuNwG4HqAGQNgAAAAbAegU2yBgBADsFADYAKDYYAQwEG5QqFBAAKTAQGQAoncbgdggAUCegyUgUAAQ2A2AUwEA3CHYAAAAACgAQoAUGwAQQAAFG4GwBAvkAAG4AAAABgDYACgCAFCoNyk9QgAAA3GwApCk2AADfIAAbhQDsNggAAAACgGQAGwGQIUAB6DIAQAAUUbl3J3CKRdwMABgDGAoCkCG43AAIUhQICkAAKACgFAnYFJsAAUACkAU9CggRSAAUg3HmA3AKAAAVAUgAKAAAG4QAHQBsAAA7AAAOoABQNgAXuMAAAAHYBQABSegD1A2ADYDYKAA3CgABuFUbEAQ7DcKNwAAAegLsQCkAADYAAAAAA2AAbgAAAoAAgQoCgAAAAAACAACopAUANwAIhSFAhQAAIUCFAAhSFAEA2ApAAAAAbgoCmxNx3CBDceQAU3AKETIA3CqAAgQAKEKAhkIBuA2G4AAZKQBuAAKQbFAE+QKBC+oJsABQBM9AUgADJdgIB6AAUbgCFAAbE2G5e4ELsQbAUgAD5AblAgQFAnoCkAAABgDAAAbgANgAAGBjqAAGAoNgAgB6FAhSABuACKDcAqCAAAhSKUARRuNwKCdyhTcBRsEPUEKBCggUBQAJ0KAJsNwUIDcAKAACAeo3AABAgNgUANwAoCKAh1AGAHYAANg5yMY57lwjUVV+SGmSRsUTpHo5Wt6rytyv2HDTXF1yqP0ZStWHxOj3y/CuN0RCW4ua5Ggq/e6KKoXCK9OqJ55N0dfkeun6zwHZmpJl5mIi/Gxd+hzlPUR1MKSxo9G9viarV+8kvyl/X0GADSACdQAKTYAUEHcCgE2AowXY04ADcACk9AUAQBAqkKQACkCAAAdwPqADcAbAPIDJQG5AAAAApE8wAHmAFAAbDYAPIFAnYpO47IBQQbAANwBSABTcBAAAAQKQbACkAF3G+SF3CgAAd1BNx6BF3IChTPQEARQT1HoBdiABQoJuAwUEApAUCDIAQA9BgAVSAAAo3AbgbgB6gAAAABsLnRMrKV64xMxOaN6d0VPU349SXlXDWaN1VEtzql8SeReVrnfsonTocznqfOCFkELYo0w1vY+dWyqdFikmZE/wA3tzkTiHbZ3avWimpGo7COk5n4/c7HJoqL2XKeZ12N8FOtW29sc6oczo9eqOb5N8jc2enukUTPFlRlP3bFInM9G/PYzLyucOa7BeoBtAAANggADcpAEdTv7bot2/VNndHhPC8POPu3ydog8VKaJJ1zKjE51Tzx1Pp1wMGZMuruhCg0gAAACFAEKQKbAD0CAQAAAAHqCjYCDJQAIAAKTYbAANigQFIA9ANwBckAAAbj1AAbgAAAoAPUIAAigCgqGBuAAA2LsBANwBdwTJdgJuUIo3AmxQAqeYGwQIbDcbjYAAAKAQKpBkBDcABRQAENxsAgF2BAAKQAAnQAAAAAATuAA7jYKBewARsK+gStlpF6Yil5nfzf/wBm+KgIoACobDcAAAAAA2AIBuPQAAMgABsBdyFAAgAFIAgAdBuAG4GwABOw2GwVSFRSd0CAAAoIAKAQCk3A9QG4G43CgG4CAAAAAAAAoAAAAIACFCIANgoNgFABQNygg9AvYpBAnYblAbkKTcqAG5SKgKAJ3BSbgAnYbFKIO5SIQAUgE3L6gABuN0G5QAAQAQEUBSbFQG5QBAFG5FACFFUDyCkAFIoADcpRNgCkEATsNygAUCbFBNyIDcpAGwQo3KoQoCICgioEKAiDcFKqbgbjYgAKUonQBewQgDuUAQDcpQINykEBQURe4KRCABsAAGwKA2G5QICkAEKNyACL0RQSj//Z";

/* 角色表情圖示（取自設計稿） */
const FACE = {
  smile: "data:image/png;base64,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",
  think: "data:image/png;base64,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",
  happy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAP1BMVEUAAAD09PQXGBj19fVcXFydnZ2oqKhwcHDn5+icnZ3a2tudnp9hYmJvcG8uLy6xsckAAAAAAAAAAAAAAAAAAACsr8JRAAAAEHRSTlMA+/wO9fALBFydolukYpYXe/uglgAABupJREFUeNrtWul64yAMBAtxOu37v+2OhJ1gTGrSY3+Fb4/ENR4kxGgk15j3eI/3eI/3+N/DBwz/3+DC/j/RYRXHr7+Kl9O6pnKEr+NPMJNzi4zVUgsXc/4DTGycolVMR4bSJ/4hW9fgLFFn80/xCp7s2EZDlvHRRwe4uogKyWR+L5xI8TjvTkzLR16cWcXiJEOAnf81Gwn2iNcQkEG+GbOyBdLiUo71DoFMv+ZVbxLso3tYADYSUVKTcTADcCIvS/75AQnVoWKgP4chic11SV7v+Q08L86SP8eQoKBQ1NxaEEo/xqPbHofrwF3tJTWRf7qJXkxbU2IYeD0+Flau9d+2D3iOI8wgmybiAYAj1nsNrwAH+eEarkbNCq7dTso39k9DU+PQX1Ml6cHYWKd850QSNq4gFe0piBOFr0ADDn8dgGT/Ks+BlpelPNZJ1vDXgDKECHLWgxRetNGDl128L1No5ZIqQThBSEe49lVmRQiYJbVTKE4kPOUC4dqbUGEIr7GnyZ66lDgtfQy/aGIAoMutTfRKEARJL0wvHYoVVByG7Dq57ilyOgKeH13NDDPzQeXxVcBRmJSPjzKBqLxjX9jE8x5W8klCJOU6/F4G1BzfB2YgsOuNOV0HLFxqXgIkkwXws7sMPJwzmvHQTYLuBUCfjcv91Sj7OjuEiefFsYeF/cODXmvso+dVRRBdKUnDz+KR6IXT3eLSKTdR1eTz4tgLUfTrD1QW97krOfzNeZeOp93CDyQ/uqnEGCQ18eFW1SnV7u06lgO+vNHOt2dEKLBlit+8gTc4ts6g/YEwkaSGIcqmwAK+7+ZI0mFJi70Maq/+PLCM+EcQKa6OWRetmhAcUCJp5TGiJa2A+GoXkda5YzWsn91NrvBirSZmIaKEqxhCAwWf6KwqnhJkJ4b6ZQnP6alKC1trRap+LAIklZtbhfJiHOUG7wcEOeT5Y/ITC9RqMRBD1BnwVD0SbWwkvu4jxJsZQLr1RQlYgMWDRuJcnJet1ElNGENWMGuNmFvfBCF7CldH3nSAlTWyPFaVZ8NABLqkXdaJf4Vd/GEP+cpAjZmOh50Uv6L7KENal+dxl9MmZVRJkZzbK4/iYTepLEPz3bgUW01KT9gM2gmToZeVd5DMoFN5ggUfZZd2Jora57cD8nUnyvuy6HqyFhhk4OEraiPd6Ww+a9XlwYj8KKVprEXbEHdbK0V6AilNUCly734QBUckNzWU0wUwFXd7FIRBFfBe08gpmUmIZCxLGiiJuVBrBSgnuXLMCXygee3cOAeXZmFa3daJXMjY6sLVMbdmjraj2rJa/I8D+jAb4inJarUjtiwT6mdLO7XYxmF27S5IDXiwUEyPhzwmDZT9M2uLbErgMQ6QkQzsfTuF6vkyhzV0+wSHYFVINyTpeqoCEmorksjGUel3R1RPnrYp+Ju2IuDvtuD7agdhoIaCEGSnHfTx2LliJDWhKB66yGZro1DvHGD1aAKchPZghrL4Hvh+mOpNzdGrCWbOwgoIEyKNMpjTxIgD/qQGlO2IPLWFG9EIKLJqfLKLriZGNxBlJGIOQJkne6ja/kC+XTw9a7iQyGoBHLoUwkOzJhzupoSp195n7SqT9vAGikx96pYhNbu9RWztoen5ValW5zC4TQ/UoAzWOzieUgeej6UigncxwhPFTzC6AVsk3kY+xRaBhAYxQd5Wd9sdMU9so5eEITGBvVjWcdVF44gKEKv8AITbTbx+l6NaeJvxpP1BxpiR3EZJtzR4MPFStm1PWu5LHJcHz0q19WCgnTqMNcvZu4k03XLVQ9ziVZ1+TeClmcZSscxVsmANdzTQTOZEbqe5JdIcouhQczLQT8x1B784x5OIvUNZWqATKTi3R8luhDHRKklLHzGXwrsCcgeodeUFohd5081zczLqDChC82tEUR4nPITMjaZk2wlw60g87WFK+pNXbd0snmsqKFvwaa6UhOMuregmYfN+jmx+mjtQfF6tGLnuGbJ7CmU3xLNzb3SqND0jcn0Pekw38rW+rrSjgb03U42TaLsTdYeEkLf3FEma35/CaXhPneDa7hw9wd3LlDsJam7XHw42nudI2NMOeHqIYj5qcnsHNI2h26z5l6a1jWCZHw9Bhue7jQdApzm3agTePb9/mIzS2rWqWqhuZv1aV+AOgB++1Aq0drqqB3BLfeM/+y5hiwYxSjZCPvMWHjgER0CRG9DMVnsIOmzcfp9gkT7HNKJlrWeMNtalbZKRN5RU7h0g8AiXu2TRMgGLzHU2ho3f+oWJxI7zgYm6bEWNmjPZfHdsHWZ5aR+VuaUN5OlcD550Rm2iYNB3X86a/p3680X6X/iFDKK/+hWd93iP93iP93iP9/gf4x/juSxd9PvqJgAAAABJRU5ErkJggg==",
  surprise: "data:image/png;base64,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",
  cheer: "data:image/png;base64,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",
  thanks: "data:image/png;base64,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",
  tired: "data:image/png;base64,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",
  sad: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAP1BMVEUAAAD19fUbGxtdXV6pqalzc3OdnZ3m5+eioqPa2tqen5/R0dFra2xnZmgpKStAPkAAAAAAAAAAAAAAAAAAAADCQ8bPAAAAEHRSTlMAD/v2CAXqXqGeYeGiYpv4uRv/fgAAB6JJREFUeNrtWut2szgMtLB8w6R9/7fdGRmSQEgwLbtnf9Tnu6QnDbLk0Wgkx7m/9bf+1t86WsL1n1kL2v5X2W7i33FOHx7ijzazosG2cr1RmkljxKpJXJh9tU0kGgtytT1J3g+2/JQQ1jHRbMImahzxg9Nrj08izXnv+L/PrvgoLuV5Ez7mdK1FF/FYRJOrxMGP4+DdOFuzf2NaAn3Bgn947jgjQ6T6r+Si0ldsQlM1t8drLKoiHYoffLIf1ICisboKR6u4BlZG2ie5wKIdDBz0PCO5IxZwkZzFPbBZ/RAvMQccjpEP03WQH9sxVAUpwzD+Nh2DkwWHccMvTkJQfd6aTMDRb3O9tFzA3+fovQlGHoaiv3ARUco0VUUSMKIHz9KA3ZWFfn7GLdmdwIEwHNUO8WduquABsfEHfAR09GNUkTtMSzcmce4HFoPI3Z6lWfS3j4mt7cB55EiXn4Q1M/cW9CNa9fbxMRJAt1y0WX5Q2rHfvBQd87Cmz5GSVi11JA0W0bMZP5PL8rQ4RDl4yLIdAanDx1MWER8/TI8zC07zMTdLEwSBpwl74VROMKJBdz3oICh+Ws5kB2kDUZFnSaMnP34Kqu0TP9YpyhMJ5zADYtyvbj2eagOZ+01IH+fTB4LbRQbVPUTi5zWc4jchMe4YVHfz8RgMrKPnPLQ8zC9PVgq1cOzh+TPEQu5uDWpIeE5HROGhH8aT0mL3DJP/lj6UenoY+gOKrMgv9oAY76Vvx+NAhaMnsjDvQSaRJPV449KkcyfZBDfR3qtBocF8F22HsEFUe/i0+bf3QHId3iqy6IAPvC5msUf9N12/d+CL5kffpLoIuVZ23wHHHwPHALNLMq2JAPr4GFj+lobnyaO+71gFSQz+OGntnPZyDa6w78zUSbeUJjZo6G/S5L++rNF56f0dsnaU44jCYH0FoiCIPqZAddPEOCRTzDlCGEhkW5M2lUT66MbYq756aHQO2YBmUIK3BvRmzeiEwypVikNgXxm81+BrKWSumAyv2WYXjN9kXQ4FMkxad1q2Hh6XjHdnKNxIRBhbZ9rGNmytmj5Gptya33fqM5h2SCm6sqcugsu+CWu0OVjtFwrlqvUAxEhrs6xpFjxi7OJTbHDAIeoL7KDF8jRN5dO4Aj7d7vJUvO8abQCIJkkZm5XJsEuaD0DDKUenSsnZ6CjGrrEYi2/TwEm2VBM+92IhjEBOizzoKEmXzBD0oQUOVodEW/cIr43Y2gWrSnbO82lKV22yTlbn3utZZ/DjVTbI90+TBEWv7IhUjnIQ3NAX0My0AN5xEtM0PjU0yrq8TpkwrJAIqN5TkdDrMWg1D2hzaafpj2uDAAbbz6ewtqGjDf6mHRX2Rhx4BpTEXNZNlwJ4Oa3ACkJfpxp6OvCLvwWNz+3XJ4MoKq0brN5vPkMS2xMCq88jG0BIlH2dBsfFYLQhgW6EvswpF1p+vHJX64N5hrEnpHaGtcKoWN7qdtbQ2TByLlW6QIO6h70NH3UsiiaA8abnJ11Yga59ujTMc1efC9ceG6LzsHCnXdYBbtuA7s37O49bkp4ru53SaCMgSsmwy9/2YTd0dQUzFmv7hDHNTvGPTD71eygUSA1QYsPc2Dk8UcofsFasb9heTU28qwTL5YYffOfk3ZAajmaNh++X7jE4ONjEwXvuDV3b7lPejcJ6NPPxsK7ToMmt6ZcTeplvArTX4PPe5EcTV8+WqLNBFO4tnBx7rapUALWdmLmTu++DNrH7Mz0++C1dxdQ9OeFA4amKj9Hu0z4LBQj+u9ZvM4ITl1E2EZDnLujjjFeaJM5Jngb0CKicCOnwIBm2nNac2a3em5wsEUS3CWk+kVjk+pUP7XbNtdvXsDk6SXXYzIANNP0ekvH905HjRSWTh+VCb41OSt/49PMiNnPn2ERswm71Gn2ZzErCrmnihLqbHgmA8x1NaecFp9pUSHC5U2LMp1Z45pu0Fc7rOVN4mvZbqWWwU0nNkOMLsSD1w9T6buIS/RKxbqDPBe60li0u1xnFaiZ+gmGUBhhANbTrFQqV/mthYbmItbaLZituvAGNztBxNyh2M8wNxGZYZJy7UqnxREhZoPIwLDfKnIr49orGEluytqh5Y+uWIpuJGof77w3Dqbxw1u9C0hTDimctLfPlXn5Aso0pJl6x8xRMk7CPsTWd4noU7GmyuRoVX7v2SjhRYwWf5sU4E2I2j+I5Rr4sX+iUp3yyoIY5tjiG8TamBfapULBRJlHQ8yXHQ+23k/vhVd5dlhiTLYjks9BuILwNTIwfJXqlliS36DyOEm1jh59X78C8Y9QQze86EpV0rw1R0Np9G9EKae+6r0eIMzDc0dFuCs03vsHcv/r7Ju2Gti0boORW/8gKVl70QouNXqf5Rjhs1KmYVM/Xft3E7hPvj1QlKlRX41+98OsmIisRsD/i9nKZj2IXtJ8gaJO822X2VA4FQxtGXLRsOJs+55jdVo3XAFVC8selxmr8NbCxCdrhXBC91jCUK6iGXzbp+RLIMva84AQ5Sj6+cFJ+Z+gKguO0z/V1i52jmY7mLXftXC6JqbTbzq7njMPXNTR6lISPmF5gkHOivk6PY/XbhQT+Xy5xf+v/uv4BzEkqb2HQakAAAAAASUVORK5CYII=",
  calm: "data:image/png;base64,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",
  night: "data:image/png;base64,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",
};

/* 角色每日狀態插畫（依當日分數，取自設計稿） */
const STATE_IMG = {
  glow: "data:image/png;base64,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",
  good: "data:image/png;base64,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",
  tired: "data:image/png;base64,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",
  rest: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAAD1CAMAAAAbBfuEAAABgFBMVEX///8AAAD///PY1tN3dnTLyca4t7RpaGZXV1WJiIZJSEeXlpSqqKbz5eLl4d3Cwb2DgX3h3tukoZ1mYV3Bvbo9AABhW1dDQj6hnZpAPj1CAABEPQA9PgBJQgCAfHo+Pj1+gH2eoJ0/QD4APQBiXmC+wL1fYF5fYWB/gYGBf4Cin6E9AD0/P0E/QQA/QUFeXWCfo6G+vcDf4Nrg3+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACONsySAAAAYHRSTlMA////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvVJg1AAAM8ElEQVR42u1d14LjKhJtRA4KllPnMHPnps27//9vCyjaFm7ZArVHl3roZLVEQXHqVFGgu7soUaJEiRIlSpQoUaJEiRIlSpQoUaJEiRIlSpQoUaJEiRIlSpQoUf5iApUqK5FkQWop8AjAFgD9bb2k4cJGNkStwf0CjbEAaIFavYJ1ujytJNitlqdV+Sjw8rQiT/vN8rTKX57I8rTC+0e1QJrBXsoFQjsCggm208KKn1qRREuWtdi+W6/XO/2FUvmzGtz+5eXl8enp5QksCSUyqkUPzloAsEBIh7sl8tpkB/giwW+JWvFtsUCt7h+XGFmpJ7rAyGrztMR4Eb+wbIls/anElcAFqbW2ybPto5aXnzXKTyGE9dC0cbC8v5dSfynvf1qawUErSyKAOddSvBYIALg8mMjWYIGpimwH1CK1WiKvpWCJvBYtcsWgAPTGWuSDBPAvHissZYG4gh25To5QGWKSX+p9JKCwkq8gSvlvHR0AqGk7AJ3SlInqU0EvcEEYgKdt9X+Ps/tjCY6EwRrC6qYocfg5GttEiJBJoFGE0OvMMRa23Uk50c9NNiVH5lfraF6BTbLiSimkdCihaP3LrQeCv5vRObCr1IwevWsWc+0Fshf54bVR7KYX2VLd+afLgCsGwGvtcURrkz3FqNbrhvlQppsnh5mBHg6qP3sYvoDcsl6J25gEWN8xQLQ9/seFcTdrh8wdBulx1PG5brwLznOt123ihgRnwiAi7yC54+4FpxLcHC2q4AKAP6Yx85sMDiXYTvp/qEH0BtVygOBFRnx7aKgAmJhdTW5xuNj0GV/c4Ozy0CRoWBZlVN5Otgz7SN2pltTfShJG9qKpCZ1T0HUdtdyGOVKPzhRLcRscMVOeKR25AS5FqP/ZoEOcLx0uaMNf4L+6iH1hwZKiNlmhQhgM4VJ9DdTbbMx7oGfn4CSBMJuzAjxcxg6jXt5qXq10ZyYBEbYIM28/A+HggTpcg3njyx/aPtKZeo/NB+yzhRFwO+N4AUd8hf3PhHQ+7otcpM0L5T1GDjDT0r4GwbXDNlmY+TXL9HKmBEkYcxGzDBd0TmIehqGqWWZX4azOoU61yJTunid9A8CDM5wkrgGe1N10hvgLuk2CudTaTFNL20fw5eLSzZqYywgnYgmfgahRNy4xFzHFYDfRTwaHQuFOt7+71EqnWREN4eZP1ELuwJI6G8YnPTK8Wnt3CzX9+J8LM6ZA9PMMAH+GUa/cicspKc10DvYkznSdOxEmJ3Q4nCM20WibuB1M+/x0d380XGqCgWyDq7U540RURweO2TyZAIZyBlIIz6VNus/gMcVC15uhKY5A4TEDjbHQExf6cP0MMWmut8BEg53pdj2U9+3oFCefXd3lKxo89lfn+HRHCDbNZWzT/eV6UzI5KBEwK2nyyNkYfi/qnzpddIcIeG3KNBNhw67za4+8nVOkhkzUIaeqV+SSK60/JHB84hw7AlcT736xkzElCq9/cjgmPxT85AL2zZB1GhqF/uz1MjRzn+KrZ3UoukGGLAH2H0fah6+2lR9T/fpJ8mAm/3V1CsFWX40HSYYsb3WgV+1kElqtq0DW506K2TUepPLUg6X40goP4nrev+pvZpGyUpEK+wM+yD3hdo+ZYJecCpaHqW1IXbUFxdGf9YDsz99JcfStLRpfjVfrzyAEY5APJloteRFqV9fCXPGq1J/VRrtHn2GGCgIX1BWRyIudUXM9lqylsvw81MkgCP/mCC4SewrC5T62/Y8MNQzin2dXVVmIpAZ2e3k6lYfqez9klZmdjYkC0Iwz6brry15kPTqrN7BN7s7Xkf4WBAiFM1OSXm3zuFUjFRY8NfRrmHQNVgiu6zYBfL3NazXscQOp6Rtqb5U6ViJkGK/1bVAtRM3Uut7mc82wEK7jMWgCfAyHR6UMwwiHw2KtEZmGu9I6rtQ8YGdsAmOHtdPnEMuCfKj1RJMpMRUHzV61p9R0j1VLOe4HwwQmQ96YgRRVGDYtn6VIDah6bikXoQ2TzyADPBdQj8WfZh1MUojA3jD8U3xYhwn76YnRE+B1e0iJbQDdiLoo33C1JCer4QCsmdcQ6MMyX/5RcnFax0UCxVvHi8DCN+aaJA6HbQLu2HGEWjs5rEQovD+FHFRGCnB06Jsa2n7pXZR/YMLmGMWe0R/FDDJEOh6i8F3VV8tMJnkyvbx7ryO/i3NyYZKlas+PP/BZrZL+E49rBDLmu/AUHdzv49vFBsGBkMTUmYvzaiUYJ83sPU10vfrNq6m+RUCbgzh/1oC6P+2XTzf9pAT9XV/xDN1hPvVZmawZ2e4AiIWTeBLBYQpPHTWsd/zI87wXdPNnUC2NJL94nFhm6I3lJ+0agdta+23rT0eJkPokuaVtgHDS0uvRscS1hFD2Bu7srMWVUg9XzOw0x6sDBdhgDwuPeJH2QpTzkQ9GYs09UEUMhg5hTTySjX3vVh2UQRXUk7HBFJ7yBxn9mo8mrwItHQ2oFRrGTI8OOQcHi6WkcfhIBdUKOLI6dwFGi1dqKcBCWqA94AUO45G/5/bQp1Yr5HYgwpmL/AmvoX8vtg9awS3Nolfltmky0HOp5ySoaAsX4DVAQdbjAH/Xrnph12x49RqVdFzuIjuAElf4MrKTiaSMupEo9b3dGraFLJecipO0CRdPvqbwXSeUPjRwaIPUyu7xJztZE1caacrs8xshJw/N/Crterawk/uTR2RSEUV8uoLc9/b4Ll+Nu7PQ5j+/A/t9aLbt3U7HGHq4EJuhmnuoe/0yzxMQKr/inFviUy09V9+H/kh+6tFKBr0w+YKjp7yWkDvCHDD/5KKTTyo6jBN6CwspztpnzGyFidfN4719ubbwhXVeZAZdssOp5dzyd7GUjSaqWqxRHQf25PSx80gHbvm8tRKFuK1w8+aQq2ExxYGgvziNfT0jdZlzwtoDhXDLArxZvgC/VBXpR4nPtrIYboj64Ght3hOFECqQ7tjD9lX2RDhCVAj6Kz3I8CDAdISVDIEtoNbseXfYvb8lKAEkGSCtCZT2kFwBhuV5rwMN+d/6YoyOPmWN6mQI3yCzMSWvaagFC8yRzxTKr1V41+/OVEdHYJyYYCJvLv4u7Hiyt6qlhqds9CWaE5OD9KfZE9Z0ZFoiSgOkhEzAte2b9L9Z71xgLiXJ0jSttK5WPlIoKaWsuozK6juTvWOfIbGjR1Gvd/Z995gRtQm765gfuQtZt1Lhz6tSU+Y89TjlJyM75zFP9DiLQAQfv6vdtJ2qzP0hYBphOJcFnVWtiZvD0AAkY0JI1uhVdMM3Y0gwtfRSna7R19PJ1suwLzpNMsDmX8loPeMEHxvvQr8jqQIR2hQS+XYBa2B+Ty3wua45SCPkWOShfgcr5DzWPHM7LjeVeW1ImBAYKqJw5fTY2OYKjzlCbSV5GBiy8roh38dOLp/Fd4GyZgfkWIyL46E/7EpCrfxAiGHDlcvR8wHdtg325hgbHxcKb6HWDKemjD97i3lTK9DxIhrVkYRJmzkYNR+05/KVnQlTSwrbSA3baqgR7MmUJilfxyNlgRK3EqEeFo7xx7Va0JfdB1sCx3XIjOSYugGjlrctd4HPZoOXvKEl8YdfZdADU9Mq9ZiNBxpP+OVntHLcGFI9SLjJ1CTG34/uOG8rkbkPx64nqILdkOR1RYmC9XEGY0HJH+NZ+eig+q1UUslSSt7LxIE3YT4b+1ZV7G9G7M8cgnSB7fCjF4ph1QH8aHNA/qju5CWshDBjOyvZjBJr8BwSo9oFb4PzuMjPJ9kzqZO5FUBkEOcTXrpHxpvrGJrzr+ucLRJisDTocG/CZVPU6/rqhR2ckn5+XvZ3bVTp+eu0Ul7rgvBFrBAj1nE9ypXyV0/ped/M6NuRbpnrjUoC7cDkvvTyfZrax4jhwvRb3+5g0goi3ozGc+D3SYISI9Zb6SI9laxahS+24zu1nDuLEyGnrIcNq+RUuPBkgf4jCUMR2DEcJlB2KnGcOET6MB0a5jg/frSYmP5A3zu8K9PELWq6r1HB3vVUbXTeI0lwzjsIZ2qDCT6jVELoRMKTyueQL3o6eT8uUpskwebMNtt+KPGQBQJbgoAo4pLkOMfwAO8hPgv/EJfUw2u57FK9bs1KP78SCDWNI+Y3uOkVVTCi25dk2BauK62TrbiQrTr63whHypRTnK55/4NRxpipAtibWzHBkBapckwINPacGu4oaQewgigpZamMEC151TyoL2wlS9JVlg2E01dLF2Js9w8v2+cuoTTlrpOkcbSKG3kvUFHYn3hRvCP9G7X92rxEWctBhcmWNWultDysPRGMcgnvzHjr4TailEXOvdCybaowzC/uxj2vm6ei5vuwvNsGV8223y4vFyBFIaUisJ0lSCBSFzTBlbEHfPkibwZzUsqyRKwRg053UaJEiRIlSpQoUaJEiRIlSpQofxn5P4wfYxk+uk+CAAAAAElFTkSuQmCC",
  none: "data:image/png;base64,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",
};


/* 郵票圖示（取自設計稿） */
const STAMP_IMG = {
  dream: "data:image/png;base64,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",
  bloom: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAFuCAMAAAAMM9UgAAABgFBMVEXq4tqnopxbWVbn4djr5t8cGxvg2tClo5/f3K/YyLOiop3Jt6LftK9gX12QhnlnZF+opqLQxbeEe3GjoXQzMjBkY2DEuq9JRDz//39CPDaieHb//wDSx7mQhXr/f3//AABpaDUpJyTHuaolJCOCeG9qMzNJRDs7PUDtuuhBPkCOh3q4uOuw4uM+QUF9fYB+gHyx5qs+QDxwmXSCfoAeZh4seHiEfHe/wL4AAP9FQzp/g39wnJx/gYB//3+mcaa+wbziqnEAAH8A/wBDPjh/f/9+goG9vMC/wcH/f//Hp3nBv8FVVap+gHx+gIO+wb+/wcH/AP/DvsEAAAD7+fT+/v7x5dTZ1tHZ2Nft6ubu17Z+fn7n28y8vLqYlpI3NjV4dnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgeC9IAAAAYHRSTlMc9/qgXfvmDQvzrewMEPivXqL1Cg5ipfoC/AwBWbQCAQqmXVi4BrL6B/5ZBgr++PcF/QnxBwNP/wFtVAbyAgpVBQIBsAKw/aEC/PoDj2eh4AFfAP4D/PsJ/f4D/Af8/PxppiR7AABTuUlEQVR42u29B4OjSLIumgmpTBCIUqmqurq6e7rHrHdnjz/3+OvNe/e+9yAxwoj//y9eRCRIIAESatXM7E6zO9VVMgg+RUaG/YKFX46LD/YFgi9gfQHrC1hfwPoC1hewTh7RWo+8Vuty5PHht3xytD/ylolDawfO5wx+Su58D5Do0Wtm15xs5PGJd+iZ5xo93fu5bzj/3OVvuQosPe/GtR5FaxyskbdchfvkcyPH+wvASkMWM/gJ5097T+RhKCKpzRtY7x0iyugtYdq+haV0JhnB/1jng3SaMjZ5ARrOFkdMSDqd7l5X1jw8euOM7Z9i6TFcrBzDMdV9WAVeczr0Qezkb2az5mVM96VS2LZTOkzYcOX4CZpeAPjZNnMYE4yuVzODBz0OB6N/4afDnBNBF2IvK/A+RWDhq81bEFyd4sN0XeZhZ3A1wKeJw1fSv83SPJemYzCrPli2nZaaicew+WLTVomNLkO6d7qPngwzAD7C+wiVcwRyZIv2bGnntE5oR81bQi0EvuZ9e4PaloI+QZ1odAmnE6eXJfFMutSOOv6SRYTnhk1A09V3BKN9Dq75eD0ixmIABXoLPJqr3Hk7tRv6Gj/H3i+gnr7AZVrABZNQgajoRicBWDKLYga/gIjYMV1rCXdVMi2yBN4CC5AJhC0M33aWML2lEeTUfApegA5tPB0ejT6gT4eH4UyDkiWyrH2KwZfQAQuvOWuv+UjraLgk0V+iuBvCWwp4nDWnY9OSpVNAyzndIFDrFFGSZbjmYkFrGyXlvdKpjIoiYjoCNDvX+illIiuSoohj+A+uIO0pDAYPmSvBX/ByPsH/4M3MjjJ4T4wPp60khqFv48kHrhfPlNnNmewuMPAhcM0FXfPJ2/ALFH0YSMOUAHAsW2k2X/AoWHRVEj/ctru6jhQNLCwJh2AHNYC3J+CDCxmZBdR9RsB9RHhkQnU1RHM2PJe0aRV1dAedDt7Re7g01wUH6ytgZa7r9Ez9awbZS0/0pm3r8GR94v5kPkng7byf1FnhCrQpfumiB1b4MQ0b1W33384IWKPTe4dDe0P7Fn2yqYv2qaN9mZ4RJ9el2g/pL0fUevvrOnquc83p0S0rbe7w7bHST/cXfYGdNW6a7MWJ9bVsqfP9Rn0k7Idf1clC0PvT9j/SMWdh+nhvG7vgvVXCTj4lTMcNurGn0hPb7otveCNHujG8h8xfPWKVTz8+bpWPPDXvQ6bOdOZtE2/oPPlFsr6EaL6A9QWsP0mwdKq/oDFDssovcFwEFjoXafhFti4Ci6FXnH5RYJdJlp+ywg5ZPmL5K4z0/fkLXskcx//3f/edVLMJnfWRvNZe0LDjdIWn0eTXOlLGhrcanTq+A0ea4k8ffmfphacsc/Uuf1C+r9TDA/428rU7fU9aT+yGoZ0JpvpovWVOiUEDB5x24Yd4hVMH3AX+h/8wc0OO+c/36Y9zB7zGXPWD+RNu78Gnfx8Gk2Dv4OrOnLH0h75/1t5HTvKk4HinclDcH77F4wNFZUIMoutBsFQqouI47tFIVmRrJuHH9yBZbQh/4AZPj0tPiWAo+troNzWmk+wojreet5Uyki1OeggsPxRRMgAWhn6LyA4dChi+MlIYzo5iNhQUZxhpLUzAtShct4gjmYa/OnfK/wKnlFVVBZXnuh7nHH7jKjxVzr8LtSzcOHaDwHW3260XCzKmPg3ZWZ80E0eSxZiQ8AkuHff4r+fCCaWUcSxdGR8d0rzQ3cJ/hevBAW+g/2YcW7hc7/CWINj/0fzbnI93/2hfgUfnL/Mv39RWbVmbgE4XbCwr4FK60kRBQwST0xGYn5sN98xfeLsiVHrAKGXhMVhO+CGKowhRkfCFY8Q4kpiriW1b4o/+EUfmuC+iwja/gTjDXzOO+2+/vZedv2M8KdwU/CCpao8CvvvtZWfOXG6+wwLfBN8idw9PCkx1JLGLX7THDwf+nsRFFkuR782ADlip3wdLh4rdu9sjRFhoos3iJOB7CMPic+Y3Rn/NOPBz7e/xoGD92l4OHG/eLJf3PHYPrg3rK6c+WCCgbsxO9Upo0o9j6tbZnxc1qT9Laz04zvduXU3tW3a8hIsaBCvrqlYEK/YArN/9hI32MbA0ZaF1HyyQLJ+BuVOCvaJ8TMA7mjk+C300qNLSL2G1pqnWrEyNnQVGpaN9eJUPRj9m8+E3Y3eBXQxPwDPM0cNWESUa9P5ZY2L5Fxpp9A68ON83yVk0/HwNf6X0mXDVzNiJeBHmf4ypUikH70/5yinJsCgRnAf1gE+NgTW0jyNYoe686igj92d6CFO7oMYl69jC34MFr3kHgD+slPiQSPiCvv0WJEugmSs+fMBfBRgZ39Jf9CDDBGnzIzVVBkbJ0e/s9QD/CNfSfBBdk4mkwGeXVLrhCNZUW8Cf4O6GpRDrb9frDx/W3yr/w1rA7+u1evgNz5arFanceZIFaswJ/SUYHbiZuty719LzZPgmcZMkgR2Xhd8WGRORV2SJC2YY2IwiZEUmqFyAculky+AXhvYmZf1fycuk4EmICfcY65bQIwHFIW3MLsNVuJHN0AxC09fFahxWSDQSJNyW+uDy2KvgJtc+R6ssUHo2WBEL8xRMuCgqIskccNVC0GGks1AngO8Iv6J+8OlP4yKG+AvtlvCdMtbZPumLfjXJ0uHHo326kSzUWSFelTbbNnmFmsqcHKWYo8CHZIqRN/QAnowE4ywR+UywPJTX1MXyBSF+IvEuWsQfOMnoHLAiD80mxZtKF9wuQGKUSkOFoQTYDkHNKR93Q+Wk8PWUuIPBFwxbKH5vJdap+E2YJyyp/O11o/1UPoRxHtiIsXgJr5rhI2YjD1MnJcnymxvCDRD/0/DTUe/2XvYjd/8/+Oe+mAMW1g2oKrHTNP2JpDRQhah0ZXEUkHv3q1C/uxAs0INl+I7L+/AnEaGnoh6MZoSrjduC9VFdCpYP/orihf2TAMsJ30lm9mwFCh7B8n7mD4RoRsEqw4cOWM5QteGfC1YOmBhonrEHFBAjWXdYJVwegeWfFqcasEjB//lLFiw2JxTSVOI9hO8Cb41g8TsB26JzmYJHsHz3ABbTf+5ZnrfaD3PQ0wTWkltF/GEIrHJQshRYpU1m6L02nQPfB1zl6Zei9feVNAcjwxQGL+tnXI89sLAy2/5w0iZgR4XTi52q8DcuCdvn7Djpu5+v6MiNMVI+PD4+fr3qvibPH9HWyfPuQ1/Dz6/z/6u9lNXjo8rbU6r92a5V7VQ629aukd1P7g63vOgYrJzZmS16iokqU8UfAaByLZot4d/DrxAs9cobuCLPH7/Z1T5DY0xrhPDSwN0VYHWiVU9rTKLZVV3YTP+2twx90yagy+6nv6WWFNgP3aixs/5H+K0E0+szJAvWsHj3iHL19UoZBQgysvr6cdWH65Fn/FHpw/ei1dc8goeYAfD9Ct6lqKcIexbYavUgbqYfsMHC7IZ2VcnO+mvB0jIrjpJQjhb0iNNR8J97Odi7UFnm4JnAyoBl9WztLEvvxUipdf1swWN83RZAl1pxfMvzX69xheZgztQLq6LIAJwygSerTITp9Rf2XvdzN9wj06Hi8UmHxSddMjtK0l4MXoOCZ7A3KNZkylHB2+Fnqaxcacarxa5yubWo/xH+BpG2FouKN1LE8tTmi2dMsVgL6ylMcwzDwUMWxk/4zroD55TwWSx2UqBvGq4qOBcXusw/z3jvBI3Zz33U4DYP4n0HRjfkzuwjsJSwvV7GAVtqIv/zolHYi7fcLZIoAjCWYgWeNiKxFM3l/lMYwq1X2JEhAS3Yv3OQOF7v6KGML16WuNFosQSI/xfYi2zFbPjVEuHtdCmsJpusA5tz7G3RpwkL/ygjjXsfdgGlbXRG6+N+i2vQYuGTtcM7rxZcmlW0sOzQZInVo14vFn/dpPx2C5AXEK1/Wyx4k+kDGRIatdUSRMuyAe1cFLuF9V9PGxKuP5Reuzaj3ZDbJzoLwXKOk6y5XnsRC5s4482MK83+b2tXEFg1XokWEiSLNWCFDOQM5C7LAE/4FduTUlh9WQMWQJTgutB3NcgToh3+I/xm3aXh6mZgvQtXqFCbqMOAI52Gx0lWrBIAYQvL27o7OoQVlOAq2z2xFQg7gdVI1ipUIDtRA5YE0cK2P/MQHYkF0oYLDsCChyX89p0F+v1O3RCsB/SHySgFsPaFESdg9fOGCUewnI5kfb6z858ILIvDvfIPAFUfrMdwBRprn3qH3+EC4CG+f6he8LUBiyc7eJ9aWhbshnfhTcFamYDnUi51OBDPQuPiGCyXwFJedkPJem/Aqq3dorIF5tkmweKAy+qXB7CierFpwKoFmBcCf4lgncKpbuYNOaFKbAy6LpPlSPoe26MHweLxm1uDxROQhoXRngewVmp1IlkI1q4HVmDA4hacyMrENxaHB6tIf46ZdbwbMrMbLothsIaiDi1Yyf2NddYuIV29uwtPdNZ+zWVGsswyrLv4iQYsZaPys6wCwOLZDcEy+xDuhtlMsDDI+re3vIrwK1LweN/f4P7XgKWNRafqRU1bH2h4UPDYqg0PNbthhgpetgo+19/sqsqqo1uDpcJ3ZjccB6sfAdmDpbV95GN/Jlg5SVaGNhOCVRJYX3+9Ch+XoAhEsljIvemwELBzM0nrkB4C63+tH8tQ4TIEiw33CgTrL7JjKorPAktxQVGH6HLJ8mgZ3trOOl6GaJQu8WLuanQt7JoMLXqBxeHKcw0P7WTz0K4yKxYkS2i0TCt6uM5u2CMCYHnGKJ0NVs7d5S3Dyqs72AhJwVvLPCzVGlF7fHwEvU/8CGRZJFlSWTtupxqd6WXdPPRrsEO1dnK9ugNImeAkWAm+gzF1q2v0dZMrnQ/WTRU8GEOwdHYm7ADbmgK/ZQeOCxy7Fwv0O0JT0fO/t2Qj0SpcVzt8bGd5+BBAzPEkT7AOq5XILDyDFDduPyrngWV2w9K94TIELHjCJdZjJGAaAVh2hqUZrgsfBoKF4WQND/GK83UbusUoWMKpbANLFTDxK+FdCbjZyn8EfwlraKPbFZyASpR/RWDN2Q2rxs66KViiPdC406a2oDkoGlgSD8ua4qK6vXp4aA0PabpmFeb0cooH6PaMNys40b8SktuzTYcGLLl8nVSYGrMJ91mLk2RKeXQdKxXePN/k5EIG0bTpMARWRmAVN03flylLlWItkYNKmemBYPu+NJ0qhjUovTwHvabD+sT21RcaC55Uelno75L7eAgf5yv4Fqz4zyfJOkSRNyzemKagkqMLwPoYpnbCmyqaCyTL+TNKvrLQb3xDfjcQotHpMeJvMfQFduy7i0yH3P8T6BtW/krBRqBUip5VyWgF01ruc7toR9jSRB2qO8ypnJMs/dZnthdg/dsFtQ56z6b1Yz+GKaWaxfTRLFQdimJDlX9L/ov8dN856VRl4a/iiFsYTrpAZzH9p9A37KvVw30kQbKIotAh8XJyunt2HPzLGrAO/ESdHulI9Go+4BkEa7MiC/5MPMvBDjdsSMx/vEjBza35BoxfsF/3xGDhB2TiMkxnnbt3wkfPREr5N6E8SoVpzURmh+xt59TMjmPPqm0ROmclCwkFydv+cYN1H3vR/ZuGOi6UcYh1fhELU2bsW5uSokJi76ApwF0Gln2SN4R/pfzQuVlkPIy3ABb2ZV6wDMOwkML/MWstyuO9wU61+4ZFjfgn97Rl2sgag1e9BcCahEVtnSZZHSL5Y87ePsaFVWy5VWOkLTgbdWBvmRR/EmQtXw9HRbXu71WNUbqsXzwp9FFGWivVa/s1khWAgtfhyuIXuDvln4mdlVKbRhMpXVrPLmuNqm6PdK/W4aPDQGcHgaQQOL/IN/zRo6Xz/GP4Hn4eWNS0fttbqWhyMdjr1h5FSpeWFevTjDTSi3ZrHbDpxQ3AkdZoZ11gwf+5FOaaVkK1pmaBZf0sDE9seJQ3ZN2MtPOWbbcbjDpo/81NY/B/GpAxaqFbBt8cyue6eUPVS9+DPS7djcnusFT9pJACBY9YIFibb5geAkv3ax3yT84bvkHJYjL78NOSLKyDV7QMRyTrOH3/EavAA1MYEi9/gmDpB+NI762NroIXYJ/lfgcsx+YUg/8rzn9iYPmh42ITgQnRnICFpkPci/N+pFIuCitX8icHFtjYmHNeusuheJZitnzbDUnRMmxTYT8xsFTbY7mUA2A56Bj1I2C+oxuwWBLZPzWwHg5gHYdo8F8A5JgK2uaU3Ul/cmCVoQ8WPOqsv1+GJ8E/dLlF2ovoMBHem4x0+QMmLLQu8ejWXZflq/dalaDgBTMKXu/zkWw8nCck++EV/P5D/9MPpLOq/6xhWbFzYDmFjI2d9cOBdRCh1j9rWi7y140yPoTvKhN1qL7RJ/EsHNShj8DayqIKXqFaec4XDD6X5JxCv1heq1dYAGU4wpR+TbBaBQ/LkKXnl6FTxAYsXYqhqS6v78piW9pX1T9bVs3vliLMS8BHLO94XVl3y/Dqhgqtyv9yXmdJG3twyCjtK3h9ShADYMVyS8vwh4t/KuzfwVKjncX5E17gP9a1RfVF9RNccf5awoVcYqpNsrK+nWV4xtgxWPE2QLBSrdL0+0eK6RV2TmBpUsIrEC9MygFsFazLP2BzhX0lwTGyXpx5iYMWPFMmFXbkSGMXVH4iWUW8NcvQtO3rmbLuf87XDhaDiEGquGzaUJLK4opV1h+ogDKjskF+TRK8RHldn1kuZjfUGHX4z4NRhxNsi63b7IY8e/M9K3hQWEusgMwOPIewJEHMsk5bigWyNVtvIQ78f59530O4qoyCHw7R+P3NGBMWWy+4zjfEDrf1+jM6S+Fa1neLndujheRVxbsskdhzwGbL74NWVfWk87OIUjHbsj4BKyfKJt1fB0xuvU1jlM6sKXXCNObc1tfuDTrXjHe7KhphSvp/UoeGni1ZKwDrTDaY3J0RsAYUPCot17U2jWTZc8GS3Vqd+XqFJZ2mlGH60SiSC+tJz+1uWumVdfZtWNo9tgw15qtPtsOwBYslNmPzvr1UBp8hWXn4GCysLDqHFrzILvXl5J46VTm4cdYvQSIf1QS1Ae2Gug3+/byvs8A+wKFzXSPe147rWaTgWTYz2fyQK27VGbuStMJZMXvx7J4nt012uCPOky3hUtWzfdbOegyb+qzjeBYmDWkCoO5FVhudhZI1SzU8hCFsXfLa8jaFva38Eipg2DDnbCNMrJ+CIJBxUPGntWCjugV0UCLYCFgNr0P37uD1JslKpsMMnUV1R2pTV9SDes2G+FfhurbkJWDJnSUvbTOkbvgKDA4Pdq7Asqxk/NvsRB3uBiOlVDJUdiSRxTGvZit4rRVsOMHGIxutVFf4u6vwO2yLu4Rk2tpV5YW2FoKV1NauRlrwbfBC/dUjYPlIVtQ40qdgaeJ1sLvFJG81ayKlszss/o2/BLCGA3mN/409AHzBs4soueuFpS7fEJlag+kPkuUGm4ovfze6gqk4BHeOkQLcd4ZGtN9QTpFSll5OJFliwZPgm2fPdYNnLsW9zWZqLqKeuExlkdKap+GFDCyQK+uvl/ZEQ4aJOvxqFKyPjpBH3fep7VX4kL54AgK2pSYV32zcrbuFS6pcbrq/51nvdr1LLgOrWlhr/XipPafLR5BaHmyCahmGE72cCoxS4xsCWFqdFoY4A1QFBNac7I4K18ECfLqYBg5YVm3Vv5m5t1PDnBVdLFnzKGiQYwA7807HJB97xs4+yRqeOtIs/DACluNdDFZKksUDvt2CYgDQktl0OgDWnVVfCtauAUv/MSdKrnP7Caip9QYs+On7YTSo3R8DS39UQianOquYF1bW1NBluwATlg0ice55O0iXim40L9MWrOpSsMACQKqkjvCq6e/mXfhoWd+dkXbcDWW7DKkCtTca2VT+HYPlcrMMZ9bWwjYacL7h9nlVp1nZu26FqYi7ms8BK1fG3sRD6DMFm++04vyJnY06AFgPJgYfR0LR3XfA0mIELJ1KcTlU4H/Bligry+JgLzJ/ilzuMPaeaO0UMzPXw7ugmrUMNVNLZCCp67Z7szOjdyiedW7TcUDBr6g+C8E6IUjUKjwaUrQHK50dPcjhgl7QtlYXbaAELaYlOHjzuKLgzmcpeMbrBXYSc+Jskec4Cy7No+UNWK3W7YL1IcpGwAr1vPABYMSfz7bDk5utpWdRz3SNqQiLGI1XsBtmF5oOOzAd1sFuYVX/LVsrpaSsKtmQo6mrKRORMJLCACYVdsSf5SANG84K06dgzY+z5EQ6d6hcHdk4Q2HffVVITEv8gWN+kOBa2mA6/PJCO6veVcjtYPElbSXYCbDkiWq5KIYHxSmVnwXrQywcsxs6J7shVdH0uc0OksXmUsFji6L1zVnpA/vQQsqCijfQYB5iZ1VrO+gapfGxmxgfxA70+3qBADOzvjAJa3voNfBkidnO6yJqaJSqcdPB/PUpDAd3w5m+IQDMqzs2qetyLTisnuPgQobhZFnvvMNDxXFkq9iDJS0LXkvBKWX82t+B1kMfWNUviyoRV/L1YnzKFLNxC1kPz2Sku2D5s6kKNPhWcvItYOojDd3AakOmP7Cxx8HKiq7lgOZ4f66eI3HaCK9A5xtasmskC8PK7xGsIBogSDzZa4mZba5RengvYxNvwZ4zwKqOB+OfFtxmdVhq8bb/svjwZ4WpRVh0Hd9Fa+cD/iPWS3C8wEi4piwd7Yum35DA+tUlktVw0SRydlpLnduUkXlzZMtDtDrPxUUfrM6ffLEbDPWbGV02CFcgrsmbHIJ/AYD14Txr91sMlZg6eJvNZ1uayvjnuWZ3g2vwkEBNOmPk3P4q7CdaT6IHhsY3LcEsqXAl6vmNMqjgpSCjdIM1O2fByluwbj8zGc4YT6a6+KIb0HK9rgjG7j67UyE70ijjJmAo67lRiX3UIWFtYUgszhWzNWAFpsNC3Jb0DMDK6nHBygzF02Hded11WMguSZscX/GoOO8Wu+yKPkgfwNpX0URzwMLyMXFTEniwVoVVZZNJrs5+WHhFdxUWHV9n2fi4w4upDJ+qQGh1TUGE10YdsEwyPbcb7pfhK1T+oTaQ2VT+tDqw/EVZF6x4m3WKHaZYoHTOhI1zXeZvh34IfpNo3B1bnLezDmClMhL5bcHSbDmdvsm6pQ7ulh6K+1YXKDYp0nGrs81YXfE9o2/YRh3GLPgxsBLh3LaaDS8jSc7FEzpmaUY/Ea2texCszXqqGgbA4vH9VWB1ow6HhEg3ySr7E8rztncn1ezdbTdEna5WYPCeSQkeRCsmsLYuCuO2XYZgY016+XDZ3OJv/Hv5YXaX7e9CeFubN3yrTsGS/Yy0SUkRmyQTTnjLUan0oTY/k3TmndIQkqkCwcq2jZkFYFpiqjyrDFnGC1tHW/7tYd7XxTprIslK6Xt7GKwwzewbNkBrLHV7epLVmUA7oCFJ17dKqzCSVextLI/K5saCoiB190tbaLveII2mvnY3PAWrPEnfd8Bybku9CX6ItGrucnkuChpkTTjGRZwK9BHjZno0GrXyMmZSJKqe6YKklN1h42Bhqcz7cFCybsnJU+amWnRsM2zd5Iz4uWELJN3uwUIkh5rEK6ZFet8kf89ZBpK/cDXPfpgGCwsMjiiddEfBP95MrlRDQzpqZMXGTqBgDWotAs+A5W6l3MIvWRa5i8VXzEgpkkbLYclRGI1Q7M6y8nmZXnSkx5fhgB1xAMsR7FZ0IEqxA5vtGFqkzlF8ULQIrdj1tvEWnqAn44bNGxkk7UjjyCA2bm49hE8B8p/OA+vQjjIIlsMGog4mRHM7BtAyFH+/OFP10aAF6w+cHppFC4vPxXn3hQTpiuEBWISxEObV7D5ypwxGAOsv5oOlpsE6Pv7lANbt5vPm4do6WyEDaGHMymgmECQ4YAWCggfkigKeii0jcnhIsFXlVPXqSj9Z9cxlWE6aDiPBP27aUdjN7HesU9udLerDspJYxg0qGPwD0XI3G865i4JVIYbwPDwTFzjweDyPhHfxh91cBd+JlM4ES99sTLYOc0HCMgFT0aCF647WW4FocesZ5zktiHYabHeP5IqwMiMJH5xhNErNZL24uDzw2mWoDyGaW+ksU9Q3lUDNPM8oLKzv2m4lNgZESWC9LBY159QPlkhwCkHuCoQL1BjNknCm/Dvrl38/s6IOwEJ7diZYmxsH/x6xXDSbXIEeLkEZI1auKwFbD9NAFQcME49vMH9dFxK0/bYASOMmieQw/2P4fihyprFw+qopBPkVYGHl3610Vh7+3XCI9JCy2QJcJDTbrefKBNnPF5ZrbAnYIpMad1Ppbotii1gxc6n38eAoQTApsnpnHch3XhusM0g5c6YhlFoMO9CFu0/aoMLabun/Lt/ssOXQNUke0OkySkC4uAET7Fc7tDE8cO9tCyf0BxzER35FZ8EFRukIWGVqs9C/jWTpR7b8/ZDpAJp6C+sqa6KhLi3CbQA+JKp0KY2dANJUUB46IBsV/B9pxxmgVUSuYG/9U6y0bS3uRKnz8KYK/vh8BwWfZmK8jAb3SnV5au7rMLTqZNgpLNC+ItspxorUrRs8WxLjo6jMpTEVKKiV1M+WVxBWcQxr1VZUqOEMxDdwwt16dubQSJa6ajcsRndDOM99VMzw6bHdzxqzSsnkjD3uIVzu1nux3EbSWp2PiqpoAjQEqodYtbGA03vAvPf/Ev86t3PBIZY6doVvOGXBow5EJXtxbBAuIZvaD8FzdoNNAK5gvA0wtZg169IlWwLBROWW8V0gJUDlbdvOBDYQY0SszEyYubm6qagDlhyJLgNuD6zRVFjKqHzULy+O0auVFpbFp+13TnC5zzRsx+j/LR0F2aEYdgDEPcAKoza2fX9/Wr2amjW4qISen94paRmWo2CdTCLq6Kx4BCwczwbGdTDP4cGOsTP9SwCXFdSdgqSCND4KlgkBUgENQRWhfSpB0YvW8ARLJyfGDBvHmdrX9KadiTqAqNox64Zi3nYy0sP2AwDIHNjdA59N1swcB7RkPepLZ3FhlLkLVvuOZ639td22orVtampMQgP3R9w3XYmzilMMMLftEOqrAKwOOzyXYtUjYeVsEqyjAty3h1qHUf0jCrCBUMlGF3+ByOKMBdljcdKYYjEgLvzZipt6o6zYdo4mImEtgliSLsNMS1dpImkm41T+daXrgcVsU5J1UgfflSxnQLLgO1xurI0HX6y34fzCyp4yXPEEK7LlgF26bawp3PekB3YDmAYAR9HDCo4YU4g4Ehgs+CgSjYPRGulIX2Mt0JhdMX19MVu8B2uIIPFo2u/bQ30W6KzTMQKAjeehmgWwAu9CQoo8XC35Uti8W8uwB6vZ8twY/7GwjS42j9CjXbhAnPjuhRf3Hzo0OcKGY7n8Ga9qKhQX5/OrZqhjOq2zTsFC1/1kGZq5O8O7IU4bspe4ewfeG9u+pKRAhyu2rOsVtmBYuxPbFM3SvRSRYJGZPni4ESzTAluVmfiwpu6K/1DJqsKK58ViV3Pcr1Zna7s11nCfImqMUuqw+NkgWI4vTsDyqjN2Fstk8LxxL3S0m1ZCWBz/ILH6lg+q+Bhd6S3HtGK8HTtcnIKAazZxeRVQTTgGcJpjF/AVzmC+9jh0hXlfhUMzWY9b6A5skuMW/NtQx3y3ydilbVCUiMY9XqdYgNskeTKcXJhF2cFPBPMdoZwCS1ovNOCdINo9m0ltNMWc0+R3q+LhtdQSxoJvwRqd9pt2l5mhC8bg37BviI2xbOmBjZxeaMuAYpQi9WnEl+CjOTFQ2wXa+T2wenoewWpRqhEjKZMky/b19BUC9oslO4/WkCvU8Q1/NggWK5Eu+AisGkM0GFYe8WdUGr6JZnASlMi7iHKtQbjs5WIH2sWTyb4NAGUsTvBAuYt7YPX/inAdBxzeHQ/iTTRS1s/AiX53zW54JhWWHum6PVgp2JxjyywPUwArvTykpSkn3Zw/xHriHYhGwJujavUPjh+3psFaWGd4MhLYAyw1tyikn7AY5lY2lev93e5NVZ9hDMEXZXJOJcHBq3XAaZCol3cgYLtnuLHn50ZH76waGRjA6Bw9ouql6tXED5c976x8eGzFDLB+PmSU9pcTBVWtZjecaAsDuZtVcLp/qWJwLWAO1S8IDx4NUIAUmJuwDt1xBR/Hm5dNYWKCWTaB1qJW15BsPXRIME75s3QowM3Oh8BK49cYfIIRFNcD5cT5ZmM2/gYnDAFupWsdK62uTYpG+jMvyJWM42ycCcl64WJ2Iq8MfdfwZ/G7C5jZDFiVASuxhT8RVr/K/So1syMJJrcEnc4NVBsucVnJmJycANnGRsCKY1ilG45hCNnsDOM1cVzkM00IJO7J98Q9Q2Ad3TSWSTY6S74CT6lGLwo/3kYzYYHp06YomZIRZGktNj3ROng+scRIFT7ZgjVF/VBdzFfT2eyKpivssrAy1ZTW53XW9XBRPCgPbcTKqloJyUzgAZDhsIQw7FccgeW6uEYxjNqswni6grDmc4eYlZNcNOfAei2yUqYebOprkv04TWESYTvLjeOte6ywYhfb7AIX4354oICNA8br2SRx5Z6ZbbCYLZ0CKxLpr15BsjTTvg457zXMtUEtJNFAve9KsyhNdozAQrl69lzuIVpGDrcTeIEtb+t81jr051bR7MGirrDXkSzYb9bWsUNN6xDw8YIND54tjpHA/QKkgjYQxQBrjdy2E7EBbBgtbHdl88wHH3SWzYZZjpDUVYefRsBKced6Fay00irYnQYfTIrLLeDnBjZJz+RYMdqFEsafwRPCighcoHE3Ij3i+IBPXV5RUzpCCTXEJtmRLEdGrzPRKVXCBSxObm8LUG2xdI17qNDABaS4IGCIhSFg5lsFlXDF8Zg09TW8Vc00TDHqEI2k78tQZONgobK7remQNzwiKnzip3JFYkV5aR64kkywBfiKAFmAJsbLBqlwIzIbyLKILwBrdn2WP6rgSbLejoLFpH3TFrp87/f4d4NYuaimAKsNmPAuGPhW4zHST6uAhQU2RVQYu8HdnmG8SywTQpsHljsFVji+DFPbuWFzpsbgskhDJ3cYHyDKirGhMJZyC/o9jrbcWAq72qzHwApg1/OeX9qiUkppxGdYReTM7xqX4Vitw7TOunHbrw4flkg+5YRv3QHSyKaORsbBJthG0g2w9hZs+SwJNqDpJd9gbhWzFQ1aEW6LxZQvbfG5dpaJlA5b8JqlJwy4Xcm65QRRygJwVubUgV8PYgU/YA2CwooKzwOllLwgNK63lfA/zrFKi1O6OjNvGNXz4A9Ii2gj511/2iMbO7KzkKMbGXDfD+us5HZtvyzXNl+uTBJqvOhBeoRV5MIqLGIT54s9LwZt5mLFclP1fSSPp/YoHDW3p1o45xeGGAZcod/rIbDmM4ZMqU4m+XfYykrlNMloZamHjeMoWABNgFodhA31fYyYIVob6jmfZkOqXpCnRsye34CjAwwD7lgVTSRPmzNvDlYeqoAjw3j6niVjgtVARSsP7K3YWgT4lwc6axvLrUddFlm9r0iajJSyKy5dTfqGzmm/Ibzkv5sQzTy64HNFNMgwDv+AV+COgOUFTc8Y9jdtt0T8blLWxhfEEA3mzurdWbY7/rzj7KpxBN44XXDDgNtd2xT8I7CcCyVL+6uVITmcAkvVi5ry149YinsqGVj51zSGoSMIYLkvTdVN3DrOIHfY0UPm1rRBCh+2mp88ZGAeUAnFcMKCGHCTru22B0v/cebcnVyxictgyW4RrLH57dd1NgAWKvAWti2GYCJv0VS1we9NJS4uQ1pl/AxlPN/tluJxrs7C2TpUKT4cKdUf2RH15h4sdqk20mL9d2vDS7YaI6BOcTfc7eqntc2HCVYOJBcgWAWoJ8lpmoUBiwqXpaRSSYTiXNcUWA6JfeWAntV4WHkgI23ASvVFpe7I5wq2QCLVJLks5Slo6tC5jidsl6MYO29LAA2OWOjXMh/xxaGUclC0JDFlzC3AfR+WcM/5WCrMlLjofpK1MUpL75Kog8K+HMxpWbWpH1ZjXehMr3nF6x0YDpOdKQX1CaCR0BCeG4iovo2sBypbnpYt/vLyxObOuYD9bkrBh6c1FHPpVZCDuilisay7peEnVMOJQ1iwv7mzrHgKLOygo37o2NoTnhuw4rjtXyGKn507yQA0tzHzdDccykiDX6OPwZoxhQ73U9AhNUeXd2dVHAfvgPLSA6/En2s+DVbL34C5n+qUdmwfRLYmiLgiiRQs80u7/dAvbBoGiWD9zYVhZSLBcIg94+yyR3YvCxvkElhilNt6ooqAAe2q1YNaB9ilOo7VXs/L52alZVmXWLJFK5lAK7MWtWTzSRLRF2sooX5xaZK1aSifEVHnjRQkFcagdtVyNaJb34XrDWiiUcnas6gctjzMo3aiC3vRGiKl3FtZlmRXh5dIwf9iUMEPJVn5LFJXeD8oXNjjEmlme5F4scESqFW4Rob8MbAKt0vst9hjEfci9fs0KqYdsyGzofau8Xaa6kl/vKYU71YPgaXZcT/B2Ef8C9hqcIFwlZukFS/rjnqQjt/9TwDWQo6B1XT/tliMzB3oLERiVk76cHPLqnD2wuAm45yx4FncZneYHqhWpjKzfGAZXuzuNG29uyRr1UiG0rWhsmHnxNCoxjf9HuktHwWr1fdUyb3YmVmIcEhT+Aff03g4edL06jvSw+PcmV/qgd1whiOtwif0euUOOUizBq5dtT7RsSXCOujuDE1ASYaogjtULGCzVbW1wyGbVImLv+2CZThSkgiC4ZyhnN3H4C2mH/QAWFEvtnyws2Zkd0oUGLg35LxsKluyard4BjP1iFj8EQecyQvAynq7nVuMDSuCTRjE6cXU46LlokZzFL4WMp/S+xjPMmBtgkgfQqTt8Sll/XxYh5ktti9ldki1iHHzyoI27NusEmw46vnXWFy3u4Qj370ArAjFWbD16oljvZdcrtboPuQjRkMZrmNs9Zmws9p2lGoj9Op0Ogoj33AArBKzO5fOc3pkNkWfCqthOES8sAncWuqeoihztp4yJw9UibtFZ7zTSEFDtagTOq2go+HwHtOsSthuNFUZZBS8M0JjZxzhYcliM20TUCBUctcJn6Dmsp4+9LZxMPWss9G7DFXWeUyxnoGnSq1ak2ilxqmG3obvbYkmzSRYrVEKu+FQtXIqTnUWNTppdnlxn8KZl3RzWI/RrRxeLCrZnaGaa5/vzg0jwi7MS8DaZ501HfmZ79OuscE1nyzDmKAq0L62JSv1wG6o2YxahzJMyeLOUNnwfuUPWaiq41IU3f7LIV1PnvBid8FIutriygwxD6cvtQRXC/Q27MQiHBU/HAbph+XErDC7n5XGGLwxHfwZtQ7gILpWE2NKkuyY6H15QAtpcFH1m+aIxOMDzRYoWM/c2nkXgFWpi6MLS+xY4RNj33A3nOi+B5kU/fQaCeHGGKX2xXN3jDc9HJBLDFrth5AJa+2oRhk7BU75g8H2kAvLrS8YswY375+vZ9C0A6wtKjjh/Gk9ksxgOJ9d+DOL2YJiZpnkHqyhJdWgtccdiWbJitwgZnxIsGChcuuCAX5V4KYXgSUjWT8H2KNnvVhyPWq1Ti3DoU2jHX+VFpeDBUZGcgArOWKMRLR643h+q/HqJQ0cl4OF2WiVL+qzJkZdX1IpQwurtmrX/Z9bd/NiVZPTiqa4aAbGMhQ8NowhM2b26c5U45Nm6IQCTPt4Mw2VouNuN5RExHhC/fR351NeWFZ0gWQh3XLMuQeHG3j8azXC+Z125u5czBhSeNgoloqHi8Mc/WWYnMxewLRWRwR0Gx9/Glq72BO+KwRLziot8DNjfanOEh+49z8DzxVTecOI7Uf2XQhW7NlgTijn8rk7Rzrr0IDZEZZ1rwswZWXJSiQhS46nymA0f2czZp81HqzFZs7Y6iXW6KzBdM3PlRxVl4MVeWY2yyzTQXYnLvDj7AuWKNjHMSatRXKcAkwwAmrtAhS9ejc9PEzifIbLLIdSl8yxuTVJA2iqaK4Ay5k1wDbt6SzAZrN4cXuGBI2sL49O96BZP6llAodgWVDNkzedY0RCDPtiknzcuRI+uR9cJVkFnNOfVUWD4ykOyzCLaZ9LemhxEoP8uMRtXeMsJ4qBxdKE8BP+sgCvBOlrFtaJCdYbS/CGlZfq1fehw+69ZGp++mHgxwywXB7NHI1c/kPvzgop4YaPWk6tgbniqcbcGLawkoGKwTswvKjCUa0OiZCjsr6sHXK4nFUq8xD+nfd5knUc+zmMv5o1Rxru7G530NXYH7db7HPP5ADxxUDLA1amgIX6l5TTRgqLZysDVWSXeal0aR/rvkOohs6/mlVWpNjaTabgJbC0AUvrh0slC+0sZ85gNbAylkdmANxN0N4YN6JVvztVx/ljqDHYCUDBDoqRwXr3TSdivzj4QxlvKywzWYO/NLPAtgzX7gzJGs5Ij4A1q/JPHYGVZZ0tMTFGKujtQ+qyb+AotVJKMRFbVpbtULk1o0hpDlvjUCebHbFxcl6Bn2Td/evMdBdSebOpIuwDCUY1MPBDG7Kx/GjTaMCa02GB7lfVs5myw4iFrCaBgA1xyU7rILqdWxw0Fl/gIDDdWCRrzBTVONwJzoJAWS8YcLf4Ul08OPTy9L3TtP0Gtb1v82IH0ArsK82PfcOIluGMDgscjnwoBGp0cGY19Z9N98lmUQ2yFuryAQfZKvYB1B68aSlWzecCjvaymdy6qWtk6AnAy9vUP7OvKIMMVVnm07UOTQy+pil0/VlhNMNCMueIbMwF0+EjRh3m0LpisrkVrYxXXCZYJmVioonh+6sWv1zr1UTxkgRw+wUwKDzCNakuSkQin5Ck4qYbi1UjWSaeNQQWdrOJfioMV2bGS+3PnZxJKcFWaxlzoNoP6DNhd3zeDscKNlbhE9Lk1icDm1Kd4+hWviYPwESQw9c4jM4qR8HCvGFxDFbE8Y2/mgeWXum11dJNZ8SGjITIxlCqdpZRWtUYWDpMbdRYcrfoD5CjmDkDXcfAZc7bCHqevwJYPkVKjYLHaN7xyD6dMvtk6HbkptoJ02JeHTymBA9mUZZIF9PpBi2Ti49rGrY3AhbmgTOkIhXssfeSvB3brswVK5aWryJZ/j7Jyn8RxvbpfENGtsURWJ6j4bGZA2wZxgkWfdc3SypCy9QPYYPJcngNwaOCGuusXXWgrjqsxDLP1eusvSOw7M5gtZORfakWp8vQa3aGeU0D6J+c1hFjMixJaIHGIDZ3ow5/hoKF4Tz9Su3GF+qsMTsrbKuVT3WWP1dnGW+6F58yo0F5w4CfIFi7EbBwYHcNOFfPv9B69emHAasfohkG62Q3TDgOvpppOhAJAZPdkQIFbGFekgRoQ1JfhdkOh74AYqqGVzzP7xK8rWT5LVi+ugwsXkVEY2fPpM/H8C1St2ZNLCXjNbFjUYyKPL/FwovCgUIW/cDWO5pTYQmlfziw0IJn41GHY7C6Y0bnd4VhyN86VMlkEjN1G/5rdPA8JCpdDBP54k4K6j2zrO/Cx/CHOowFryfBOq6iWZq84VWD1ZCE1upTgUjPDYhKBYDbjegsKttKIrmo1z+YXNFuKJ19784Q5x9lNIbAYpk9f4qFClNMzhsGxH0XpRvsFr+vuMdHFLxG679CnSbtm85UnHfssRgN/oVIhOj3wcLgX8oGWPzPg6VZQhQDDWFkRiNVXaJp4AmCNWRPYuMBCpa1W7LHtxeryBT84tXq8fHnq1UOh1JOmX6OMYYU21r/0+VhZaoCJ7A0m9dCZ86stV0FjeMbt7Eal/O/QPzGTIcc3MIKHW1+UZegAhP1cTWi23IC7ioTX5HgqCmw+nPPDVgxNZRHVzSU424qOZJCY9l1U6aeuS7S7mBGftDdWek7TNVbC85KdcY86YzZYcxRKzoUHA7luD9PstDOShGBn10uWUFspv1eR1WndamZWpPuApOhIV3FosndYNTBIYZcKuXKz03K0fpj40PDnWVJw3pr1WCjIMVrkonDfVxz6aU2imgOWLQbutdRFbSlRWxVmW4LuJFEJjH+sVuzUzQedMrrGoutrOmUqSrNs7akgKAV1NZf7ukoTR8frn6swnoTXsFJwYjM278crLf40ir+HOIelipFoWohlpXVEmsScaT1OBDfBAS+QSNrZ8mJrN4nekrY9vLO2h8gUVVlWgVarlODWL1k+TU90m2tw8VgXZOwGBAD9Ygd0ctN3SXWXlJPT+823uZaILUFeNn2uCRTHaRYc2kcAsv6A4C079zJEowIwVKs24+SYn7Y2SEDnSTrqxkZ6ZjoVT6X14Hq9+1Icl43krAI7AGVpaVVo/U+QdKHrZ3MljXO8KsrnoyUuUkeoIeFZZhs/sQPdqBXuRysmNOmcJtQiYbTwKalkixBhpjKPh7V+/CWBhjxRf1mHCyGYxcwY815PJCjNkBxHnDse8JGD5Xm1+yGzJgOF4Ol2H0RUVeY+mziHn0onKGy/gTHndn2h24nGgYcKKlzxyaSGWC+WQurSobKdQ1SKL0kcrCerfX1sYu/vRwsvLB1IVhK3QY3EC3NyhKsIfMHmAgLkXhI8NCi6DxSwAGM+1EfWq9CtqyPmDp7dUruxgqCoMJ2xWyz2G3WoboCK39vlF4M1gO795h2bspFQ53YKVMhdq1k1q5m+0nrmAGDVQiPr0e6muGq1bJhnxzgB86Sqsbsa7wvm+Piuukond3wcp0lTa3DK9AFr8Inaxcn3aJJEOQKi0Fw/ypH3qStnYnAZqf1RzjOpy1MNTUDlR++u+rqOmRjX80oOcpuzHJ0WOIUXqg7oZhV+RTgKnxZ65/rYcFSVlN2iXRkSaunJDcu+uK5aWZF8CSgqsIrwTojWfqEj+tt2/b7KmB9zNlyt5Nyt3tsFdQqfKxRvfN3wypZhequybBhTX3QLje33iQJSVVbvmpK7rFPTF2pKkhnTUqWOgWLenf8e/v2PKU5Jhdr8BOf2uTg1+zOQsr8N6z83VAiA7D6y0OCrX6uTAgW9sZnq97wXot0gXX19rtcf56qGASL4jdH38K/HIZu62ugem8MyBNXsVULGO/6S46VMhQswyG03MKRJ4PVSPB0uqQ0mlFQ/AXLARJi3HgBA/WkyheV+2d+wfkwWGixRqIfBtgPVruOtVs7ROCj1f44ChPnGuPOmJqm0joQnK84klL/9aBhZDgjqDsW0YrRkgKkXsD/23CXb/pUBWYGZP7Zwj8sWZqJDLnGVF/B7xMWs6MOg9vZSqWqeyn+Lxa7xct3bevbHacKyqHif53joPFDA5XxmHdWzRNKSXobq9P5QkaD/oyhu2ZSzJjOotyVPAozt2DNV/B4OnuNZDRCrM3xbdOMe7DY8zQEA3O3uBP/EV0h2B4l1o0MfC86LTWyArXdGrJ+aQpPk33d5OYw7whnQIqzs4CmiKsYOdITuyFSFeiOuWvGjGbX2Flaf2TIeSmXa1kFQY0ROV7t27z3H/CALBCLSlKvuXaljPjmacQ7WbWtUIaKBKBye0Xe8T7yAOfEGZDsomDbVXYW1WedFIZgPOsfwtlRB+TXrA03lEWRuN2viWoBPDrR/T7RMl1ggDnMUSfxJLG4rQe2sHSln3ZUPCh5vTCZ2op7yUB3OSW7xQWBBjUR/T0H1skwSJO+Z/q3OEomnaXgESxr8UtipUChkpSOBj0DeCX2IRGdg82+MJ0koLZA62wwA3a8PEDoEgdlUKKRTlBhFwJ/ecGTH+MVGH2lz6rUNxPTPp3pZWiGQZ6CRXfOpvpYBwb95qajF0CqO2o3S/7bH5C/zt43HOYrtkbxg40l1za89mWxPCrJolmbS1cJieXJxDRVJU3Eynp+6U50yIzNsEOs0rOpJ8ldl+l3o5I17UgDkgNgObBBpmKC18EfWqDwyPoO+ywS2SetoC3tfo8WyBM8cEffSFwlEqPNq+Mz+csNf8SuMUNiluz1FM1O64lWQlidn/PGfG0HfBl+7Uz0pIT/cRwsU5+VHkVK8SXpZEZ6+CmFVbi4P7XTqdrmEawuXaYNwr5iKC0M9JSqODYKHAUc4Am2rK1MrANi5nGTo8Yd2Y1rUWBUTM/3bQcCP3zl0tifQTHIQ4exMTvL2Ban9VkF/9rMoBlT8Fg9Ioeew7NZbWPFfqfCnwWVSDay9RjmphM4XNVoOLhHqhmuWGIxLo0x2rVW1djQOTDa5NmsnaZllrpeUMTYovjpmqjDMVhtaffbCbBwVrfn2empga/BMpK7pvo9AUudH0ZkVtQ54TRg/9fdjuP9WYlrPSu9yvtbVohhF0zUVib9aFXu8FgPTF/w5LJ55N+6HEfJei7VhrMRBU9gLS8qDDk0DUyApXXh8XgoJVASl9ZCttv5LpBJ0QgX31lvTKl/+V6BGquVZnYNknGcLqSuqRpZOq3frNdVZVmGwuiYhi1zQap2Accyg/ScsfwB78tzcf71duvxN8wvJyRrOTYM0j6VrMlUWI4N2hx7Etnp1wmeDeBgEfUcsWhZdacbmFO3BwJmwzrEkvsKybnLXisBODlr8mtMm4Cwl3cBtygf2PCKFUkiPW7mshEF3HScwVAV4H3h+GUcTRPwaICUphPPWs4I/sVn6FUYD7gcLtEGacEZhRGVz8Q8eLG8KG40NLWe0o39TfjdbgHWKeh365hhW4XCRaMWqWWVUdt29P+A/7yzfn3Ir5pkZI3jatWZCgfdkJPbyKIO4oUTaYoBBsVDTekcsLwmFTZ4De+wgpJbgWck99T51UurU1gKyEeuZdaQ3Fl3oZ+3Vjxn31myeLaSrhONCSG08PkyP4y01+AnqtVSNslnOH5JcrZWF1ZjMEzrgV8HzmTAHeakw/juax3GwDratVuwtDNIkEjrX8Ki9/jy3h5Yp3CHtoth4PgQM4+R4GlDNaMLcxmKOu6k9RzzZ7Qh8u6uJRAryi/SwDrd5oa0oDnb34GDJHHeNvHHXs6grKnt2uLr6VqH314hWaETD+gspZ01xylUNC6Ou7Y+ZmjEuA8qJI6ylB047dAGSKLq2RJa+fAF2VgFzq0oeP6mo98ZIoJCA1edH/qvdPq7fTqNCh7EPvxzqZOPdUGaZTX4pE7JSkcPx+DFdTrLsQcYcFVY4vzBLY7wgj0fBy6ygag5VczU1FEOeCVeFVBwE9w7aqxXpjByh3NSrOe7tAUL9LwWWJuECjHd32dbC1iWiir9jK2GlP3zgu2gV8CC56Pl0A7Fs9Q8sDyTvh9JH/BNzWkCmhfw5Uh8U1H1hqH/w+lMYJ7GOMp9gVp6hUVYj+Ej+odVvOtxM2jcHahNf2Jx5de2hcG1fpXYZ/yi/PJU2NtpBlyN+9M7tO62QRDbo1nRktctgVEm3bYLsW4LXFIAa0Wi5i6slpsB1zMmnqs1MzpdPYAgIY7wM39Qe4fuc3ro1Nks++pysPaUUGqKAXcdBLAD22ykxUvloCoxchn3M6KZG8COX2M5kNJrTMgn3EQByZ5l9nIH+K1hR+qEI4Vt78+bfmay6ZM/nTdk9qz0fYc/ayT4p3BSOg8sd4JoFuMJNlI7VH0234jq/yqJM3HQmAoKGgmAC+sR34Ejt6lsHz5eiH+jzY8nHHe+tQlQf3Y6omQTwT9U8OUssP4PNwW4o+6Oyh17E7iTld9gpklT8MkxFopqHkuCcGw7mpL0ZYAiL172PRUoiwvLlTz7FrNCNvYOG2aMpvrRREFesZHOmUxYjKm3tlp5POrAllKW08G2XCtb1rumRhJu+5emPp5i6YCWXoEvDSprDWau/jrUhkrxCYfUGv6Q591zz14H9yd+rcmnbcac5XMLcE3CAhud9PiLsjNgGUaxtRGvpq6UV8lSscTbmWDds4XZVqFZiZU0IGcA4ZLv2mLayiV+aZBKcgU3OMFPsmtz8/My0jOqlQmsNBpNsqL+js4R7NOcEUyKod6BJXXX6h0h0B/6C9u2aq+iKlNwBsFEvcPogRBPzRBI6yjQnklkxQWQV+r1lqE91TRwspvtwZqa9ks+j30+A1uWhx3N1q2GRT+colBW4NY7UIFi3VSBGtdlifGGpho56JWPIo0n91+tIfEQdZjVjkJGqbpFTanG1pHHJqFRluiI6tTkzKwXDzzslRYZ9apoggqt6ztrxyVGsXYvi5dDiAcN3ADLRcPV61EVTFNC6RGwsFr5dab9IiBMuqC4JPi1OOQIrQnWGO1ouxBRC22f5DcFsseHF6hX0luHauVqcBik7Z9OzmzaUaYz0h9nTWo5Iq5QaEY97SzXew5sWoIYY1Ctj8CWe0rOjCTM8jCnI/cVDes+f84NJauNZ/1scHImoJXqQbCYmUHzKgd6LgrsWv7CsaYKo50HlhgwaJfWgWIxQ9ramCzcwhCyvYCW/9fz7KSavb9WZw2AhVHNyO4begTWpmHATV/PqFHlb3iQVORZL8N+DL00O8Bmz4MnJVj+JGAYra7M8BX9GpJlU8HaoOlQUry1PBoG2YD1GmWSXWvmyeJFsLAoxvBw/BUjwVRbEtKSslWBSz4mzdXRZzvWtL6OV2TMKMXMQ1RIpnttv/fXlhzNOR7D7ywv3uDQGefEFsBd0U6wtDbutFBE7aCQGAl1pzOF7zUWU8209ztzd342NDkzFTTwIz2KZzUTytnrOWIA1ouLYHlDRes5NpX+pm6qQY5GyRBTBJ/kRw4/OeGHyHXmgUU6nI220GnfTM7sgyUrojiXN+mwGANLf/eM7a2WLQaD6HhF2IGyeN507FLYHNFrBC8TJ2OeBcufB9ZhOgqA5ahTsNhAfVYD1isvw0cL82SjlLSoGmApUgXbBjsoqEMOSdGpG/NF2nrCksdlGM1dho6psW24lcNByTqpdXAJrDQRafqKy/ARHWxLsokiUK1FTMF7cq2NN25Aq7k4xwulNZs9R/oisNJeWJl0VppePGfgCjuLEhYGrPFNK0f5EmqZ8H9u+vmrp9WaIfOYYn+8/cX5obNtwUJKKH0OrI/trLBXjRs1qTD+/OxONVGaDU8Lky/EoEVPDs7cup4bhAaDNNqDJU/4s0bAqogE44N4RZsUC7lq13pxpztOdXrE/7haKcyIzc2CXbobmowkghVfABYtw4rogr1XVPCrEDPSRf2cnG/P1X6Z53/7+Hgtt8WM461uhjhMSdZRyRHGAF7XKF2FX1kLN9pY2QUL/tX56w6SJR1jlC41mE2nOsvOBFP6CCyKlBavaGdRYcgHm1tCr1T4IzlwlIwt2vT96W74MUSl2bncA1hX9e7MAesFPuk5nD/B+NUOB+s7jM5ahnvLZGLMKIB1//1IVlDl99wq9Y8HLFyG0oB1WSrs4x6s12j77YLFXQ1g/ZgkqxN1WF40d6cjWa8NVqJhGSr9Y1qGzP75nCTrXmdpR7yinYVgydR2X35cOgv8SbzpWVU01X5DL3UJx75i0i9LDTDq0tFg/Tg6LOmAv8rS17PA+g8VgMUXH76n3fCjf3yB+6yAOsQXTE3avMIQzBummrHXlKzveAJgoQX/umC970H06X1DVvaJugaaID398Wl/aTNrHdoqGt03bm9nN4JkGbAq9cpglVTntx+vWGpTfEn5X4XFwBr/oAWk9R6By5OsTY805g1tOlJmm5YE/EML+gkP2YKZ523m4F/hxTVm4EjfYzR7Wbx2qUeDWEiX23vM1H1Rcv3gfHtyH6K5uD4rMSVH0jYBSiaiiIwujPFqSiPQU4K1eXX8y54BVk7GMN6Cfk1vpnWNlcBgq8C/7uG7pw+Ge4HnMMGVfBAf7vE7Fw9uNAcs3YZotH+P8w/o8IX9hiC/N5IF/9BTKFn39/TX/Zs5ktVEjl9dptLWzLTlPaIGf7kS/D/65c09PufAb9gEhM8AWHFrwV9crVydq5C5xfZEXGv6x+AYiiyJzBJlTQxeLofpVcbAevVvXQ+YxD/MofcsMywhpvI3yfJQ0szCAaf6CCxFJUdgWJW+jwlL2kR8Y3TRgz7sHu91Y2j5ZXnRfTMK66v0ZKSLHsrxpOUxpW2alo6T4k/4r3RUeTbV6uuP+IlwoU4efiqdkrrBdOkbAxG3RLMHlCXTIjFMoNkpWIaoJj0By2R3WGEL/RrSZPZuVpZHT/TwwyaIplKkXK3UihoSX0kOFUhWadydwmYpZp5PwWKfWHycleinwv7fG25VlLkyHLX62NzNKfOVH9ttaBenvQfZyXHD3dRpdJa2I3m6DH2tj0kCDmClhbjpMAkatw6XgZZNJlXYnSJbhut+AlE3re3yMAmNGlRklCSJzJLm4FJewRo5BRb76GDXShHuM3SdiU5ygIuGwIJvVd3cBLKr2kLmt6DGuUz07TGnVCUT/IUL+MUhHYXmr0R+Zquuchzpxzlt5izhAdICV/g/4ti0anU7TxxLjnDgB3wtvbHX7fadDnHRyLYd5XZYwdexXt4tsXx7WXnINcet2j5UpLA7nCPW/gGWYoJV8AuLfweXs7OwBRj7ORBsnEEH6D3vcH4Y5zd0l1ToCCo5YuHQDoj5u1iknZ1oD9Zt7SzkUUF6zB32PteGw9aSQqXYSQEHe9rVS/Mb5ZJlgmy2FqwygTNEiBeK5sNJmnz0ezwT9k8lNtPl7bQq26cpBsHSYoheJTZRh9uJVkmOAVV1wC1WZkzhIz4cx5yoWJC+Af4XS1PmIImRu0IO69rKovovkcVEsXBZWZW1+HWNRfGBxZe3DFrsm+t7FGxnuGgK/hoJC1bmKrzjlvotxoBEiXoBPjfhnT4KU9qG466oKYMS/Ly2osT6ppGfb7BLkfo0iMWglvp2a4AU/Fu0s+KlMzBmVDsDXDREF8xSwW49T0LbVs3DtXW3Fs2HgeQvE8/FZiaeYbUf9ojpVVhSLfwOMQGwEm7dUR1qqL9Z1Fj5l4DWlzicOroxWD7ueq7XyQ30uWiKQcm6ubsDRuivpLUQeW19Q50XwnTgUcQHnFwhbL74htr2YBvmdRXjwE2OPMDcqmyl/0iSBXCj4q+sX2N3OdL13NR0oKLjZb04UCZ1gHDYKReNRNaDFFtqbnmA4blGZm7F62+wf38jU7zP9BCg/M6yVs12oGGzlPWucq367+tfcgsnFPwVnCIHnRXAFoENY0G9q5e3jOGzfd7Qsor9sjqhVzkuOcpeIeoAe0m1qG2kZfpGJ2g9lKGZ7vgW/od0pLuFZDkzwFmwbyI9i5mcxes71QTbCtwDpevSfuna4U0VPNuDJYfAgh0gOwZLcqbf6TAMbyhaWJEFKulJG35IYthujG+liEFxiRXbxp/eK/ga2Z+snYxBfVGDLG7VVM6GpmlVZXZ4U72K485yAivbF9l10vda2KK7UzqOJrIxP0ztGyou+ADxz2YswxJ2/YqDjhcmmtW4gXfU8UVywnKwPtE+/3WVVBWsRhnxXY3MLNpGgcJJDBX/67r+C57YWt9SZ5lu82X9LPTqFKxQxsdhGiIbc4jiXN9OYYVoZO6WbIWNcMulPlhgj2CKrn9BA2pN1RVWDXNcfrsNR30OYGX1DmOY2pNGsEiuOD5b3m4dop1lFHz1DfHCn9pZAInu2rDgRYIPUYYlv2FGGnu9kLwV/HZYYDiB/F0bMdBrsDz5Mzbl+2YLgr1F1papvUULYuHSACPspQ6CgNCyTEUurNX8dhq+WybJ9GD6Pu1jG+sPMTlcD1Vx0/S9QgY/ZMeUsBuCuleYPUpDqpcE/fQIm29OB1rQKbk12LMjk3oBZryFYMIXmMjK4tLofY7e+A2jDgcF7y0PzN9sQhBj/a0Ba7Vx729b68D475/Qkwlotv1jzddwervCnvG7k/A2eNNEDuxmfIeEENZaP+ZhaSNVUiR39VqAh4Qq63azWhkNwMRlWLxxmD8AVq91H8vm7XsXdyWwh25bGPKQC/77xxAla4Fm6N2ixjgDt76Bdbj4btkeTzRze71++g4bLKwKzHcwQZH7Sem3AjYq7kb8hSucamFZ6zS/YYiGmYzfMlmOxt17YMVR4RH1Zrm8LcW5Ewq5+06jz7MzbZfEJbao73Bke10HRJoLC3IV5uxbcrrr+u6bu4TvpFzaNrY2OTxY3NkZ0r6DVNq4g95GwauPJnHW1jpsMPyhLwGLE/VmeONB4Cm22BOJA41ket5ZlKP7BRqW4bre7Z53dCz+xjRRg1YiBQIClJgLfgx/flct0WomWlK4xKeK3zz9/47AiqKB0cgDYLmm+57duO1Xl9qn9iS9WmcJaKMVfRkrExt9WDURY/n4NxqTFI8rZRJUeu1G+2DR18guhpagofZACvVbexpolAabOP5wOnT7dPOMDSNe+MDj2yp4NExTCqXrJsrXiUE2g3lM8O/wDGZ1cniwA0peUsAQ+89vpK3QH0beLOI/1KY+68PAOPcTsHy3aMBaWRj3vuUX1y7rdnoFydQj7TD5YbbjyqS/HlcPilz53sWucKTW4ZoelbohWIcxo3KJj/z2PFggWRWGcPNA3hgswEC1ibr0pLcSFDgcA3ry4eTBMnVeI4VoqArAZHgjl/5Fu2ERezz4ObGKxfb3V7D/Ax/6GKxQn611QEsj5kFAe8KKpeFP5SBB9QEs02GBYP3VkLvTe88DE2BmgcWniPPB8ZEDFP7SjKVo2/r7RPBxjQRTf2oAOXBrJXgKb7WGX5kDhzAxP6qiOXJ3Bmod/hiGrovJOD8sXZuFP7GDGfJ8qqI5Aot8Ib+nKh3NtsXW9UFnvQvcpfKRIw/ECf5hjo/fxv7oL3l2y8TZ96OlcDoASBTzQarg8n04RKOzkg59wqHWIZV2rx0F8YsLF3McPrgknufF9tdeJEDvF4XHwvsYf4GX9P1Ggj38k1JxZhSKiOLIEZGLTp7nuYWHYhLeD4EF/x4xt2r9P8A/csvQV77jRhmcy34osHhU2NigbUexiOMT49Es6D81yRJ4P+DXaBHZgspnY1+Ve7D8vrvzVpdCZqKbASfSZo9pLHpubOoHQIYJNJtxoI4Irxhc/uOVL/O1i7aMwLQQDC7DUL9DQeynwhiAhSt0bxx3nO+mxAV3QwcjSe2hMNLf+ftP4FCwBTY+VGcqml/mpdYUonnASG7eCyvDgk3So7whSBZ2hxmMdN+D+0kcJp5lx5Tt7idZTxlDiIjaHFKEP72D7Cx9ChYLjzPS79i9597j8eaNfe/xe5v+oOJ7+/s76PO7h7mI++7RPNpc4f2b5eHVTdj1zf3RgW+B+7LNew9P7z8Q/+CJi7HK7BistBRHxVh+uC48MBDAPojB9/GkjGMpZYR1lkV0+SEvfiGcXB6OSMbbrVsUYO41h0cHkV/jgS9qn3E9tG9M0pUOF4c2wJuTBF6VJDEeMu4cBR5RlOE/zUPwiTLGT3HxnukdwiEKSNz5+un7o/YZnwkcEIGHh7+88Yii28WJIrYcOPZ30TnwUfeywzs6XC8INpsA6XLp2DRHW5W0ISbd/cOYGgtqCwPSVEK55I1QcfqF08U397M/3PYOUfhA1Ljb3jH9RN3DMnu/oXXAOqXo7mwa3T97T7zi8f79p0/v6V86Ppmjvbj37Us+vf/kf2IoNwB5ksB/IBPimNoGXzx5d2Y7BAMypu4jOljDLP02PKohnXZUbCqU/TFbSs0hwKQEjVHsBV5obMfBAD/1rrX6yb7vvPmNS4sGVLS7xdW37w9jMo4im/i3zg0BZOSCO+AxOVFs2/QbFbD7bOhwnMsfPX2Jc3SAD/rw8KB8Xz30j3er1Tt8xhz0UN7hvxPiAxz3+x0C2/rubQEnFD0VWfh+SZ4u+Cjf3hstD48CWAV2bzXbGMhrY4D2p/2O89tg3upHbjrQFwsusKMmsoH2fbPBmrK503yQbdM2+OYeFh8zjg/2BDpHCv7yyHn4o0et33mhyauYvtUS4w0+e3t4RIIbHEvcE6NTBf/lOJLDtDQRmz3O7M9OrqbvwVegAn2j65zBcQDNGGelTgLzXyRrQrIUCpbZ3MIvYM2PEn45voD1BawfC1hDVUVkezgDtbdv0XgZeFxrMsVnnAmtooHHP+J+rdnIG+jDR85Fu70eeopsreFJSqjIBxojyMxl+hLJ6hbjXmZDTNj/Y6/Qg0900ybnT3qJbaMveNvxM++P3zI+luH9ebD0heiOg9VicYTJFFh6FBs9hcjECfWZq94jcchIy37gLw33MSu7G36nFkDRPN7DGmvLzBuOctu+PpzJ74ly+xa7f6nE7tGcCdvV+m9h+6ec/pppr+uU0LxM26fs8GjCLTVYNU/1cdx/kg77lX/ajGXolcEjR0scZ+Byiw4qJTVvETE7jp7bP57T41kG78CAhu6tdLuI4gzP1MPX9IHBoxjPOJQW0tVnGKWEM9n2UTITU040X/lo2BtxCbUhWdvvxbLwmuPIDP+2+zPgmrehA3hycd+a24nv20/qj2XYrwqctQNepGlsjzGf2NJxMSaKqKAxu0lks8OcRi2QfZ+eiGxxkPY8ZSKj+C78iMWhwurtR3xLjBWRSRzRhLX9mTJXNh+NnEBp697m9ClmyC++pRu0Y4hHYmIyMXK564P+TkWClxZL/G7wbW0RkYaLi00HP7jM8En7q85D/CS8aFngW97q3qSBDoUBTRB2kyY0XRTRPiGfIvVr0sSwkwOdEQh+EbsESREneCbnkAfJhs4ELyiTzLwDriiKm7a+NEzhrprHMYKeic65cB5C++lZ4uxPhteV0OdSnKWXXPdBrhI8IXy4Bvg7ffP4tvaz6JMOJe86iQoTpi9kVtAn/f/SbeGMFVlcOgAAAABJRU5ErkJggg==",
  cloud: "data:image/png;base64,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",
  crown: "data:image/png;base64,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",
  galaxy: "data:image/png;base64,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",
};

const DEFAULT_CHARACTER = {
  name: "", motto: "", idealSelf: "", yearGoal: "",
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

function TierAvatar({ tier = "none", size = 120, nudgeLeft = 0, nudgeUp = 0, pullText = 0 }) {
  const C = TIER_STYLE[tier] || TIER_STYLE.none;
  const uid = useId().replace(/[:]/g, "");
  const CX = 54, CY = 60, R = 37;

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
      <image href={AVATAR_SRC} x={CX - R} y={CY - R} width={R * 2} height={R * 2}
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
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-o40 modal-blur" onClick={onClose}>
      <div
        className={`w-full ${width} bg-paper rounded-t-3xl sm:rounded-3xl maxh-88vh overflow-y-auto overflow-x-hidden border border-line shadow-xl box-border`}
        onClick={(e) => e.stopPropagation()}
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
  starting: false,
  dispose() {
    try { Tone.Transport.stop(); } catch {}
    try { Tone.Transport.cancel(); } catch {}
    this.nodes.forEach((n) => { try { n.dispose(); } catch {} });
    this.nodes = [];
    this.current = null;
  },
  async play(style) {
    // 每次呼叫拿一個新號碼；若期間又被呼叫，舊的這次就作廢，避免兩軌疊播
    const myGen = ++this.gen;
    if (style === this.current && !this.starting) return;
    this.dispose();
    if (!style || style === "off") { this.current = null; return; }
    this.starting = true;
    await Tone.start();
    // 等 Tone.start() 期間若使用者又切了風格 → 放棄這次
    if (myGen !== this.gen) return;

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
    if (myGen !== this.gen) { this.dispose(); return; }
    Tone.Transport.start();
    this.current = style;
    this.starting = false;
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
        loadKey(K_SETTINGS, { cardTime: "08:00", scoreTime: "21:00", musicStyle: "piano" }),
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
  const toggleTodo = (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

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
    updateRecord(today, { photo: url });
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
    <div className="fixed inset-0 flex flex-col app-bg-gradient text-main font-sans overflow-hidden">
      <GlobalStyle />
      <div className="paper-grain absolute inset-0 pointer-events-none" />
      <BackdropDeco />

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
            tier={avatarTier}
            avgScore={avgScore}
            collectedCount={collectedWords.size}
            deckSize={CARD_DECK.length}
            collectedCards={CARD_DECK.filter((c) => collectedWords.has(c.word))}
            collectedDates={collectedDates}
            yearLetter={yearLetter}
            setYearLetter={setYearLetter}
            daily={daily}
            onOpenDay={(ds) => { setPage(2); setShowDayModal(ds); }}
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
              <div className="w-32 h-32 rounded-full border-2 border-ink overflow-hidden">
                <Avatar size={128} />
              </div>
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
  addTodo, toggleTodo, removeTodo, handleHomePhoto, setWheelStatus, openWheel,
  slump, gentleReply, onGentleReply, musicOn, onToggleMusic,
}) {
  const fileRef = useRef(null);
  const stage = rec.cardStage || 0;
  const noiseOpacity = missedDays >= 7 ? Math.min(0.55, 0.18 + (missedDays - 7) * 0.04) : 0;

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
        <div className="border border-line rounded-2xl divide-y divide-line bg-paper">
          {todos.length === 0 && (
            <div className="px-4 py-5 text-center fs-13 text-mute2">
              還沒有代辦事項，新增你今天的第一件事吧！
            </div>
          )}
          {todos.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => toggleTodo(t.id)}
                className={`w-5 h-5 shrink-0 border rounded-4 flex items-center justify-center ${t.done ? "bg-ink border-ink" : "border-line3"}`}
              >
                {t.done && <Check size={12} className="text-white" />}
              </button>
              <span className={`flex-1 text-sm ${t.done ? "line-through text-mute2" : ""}`}>{t.text}</span>
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
            <img src={rec.photo} className="w-full h-48 object-cover rounded-2xl" style={{ objectPosition: `center ${rec.photoPos ?? 50}%` }} />
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
            <button
              key={i}
              onClick={() => openDay(dateStr)}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 overflow-hidden ${isToday ? "border-ink" : "border-line"}`}
              style={r?.photo ? { backgroundImage: `url(${r.photo})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
            >
              <span className={`fs-11 ${r?.photo ? "text-white drop-shadow" : ""}`}>{d}</span>
              {score !== null && (
                <span className={`fs-9 px-1 rounded ${r?.photo ? "bg-black-o50 text-white" : "text-mute"}`}>{score}</span>
              )}
            </button>
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
function DayModal({ date, record, yearGoal, todos = [], prevScore = null, onClose, updateRecord, setWheelStatus }) {
  const fileRef = useRef(null);
  const [wheelInput, setWheelInput] = useState("");
  const fs = computeFinalScore(record);
  const guidance = scoreGuidance(fs, yearGoal);
  // 總結只看「今日必須完成」（轉盤選出的那一件），不列出全部代辦
  const doneList = record.wheelPick && record.wheelStatus === "check" ? [record.wheelPick] : [];
  const missList = record.wheelPick && record.wheelStatus === "cross" ? [record.wheelPick] : [];
  const warm = buildWarmSummary(record, doneList, missList, prevScore, date);

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
            onChange={async (e) => e.target.files[0] && updateRecord({ photo: await resizeImageToDataURL(e.target.files[0]), photoPos: 50 })} />
          {record.photo ? (
            <>
              <img
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

        {(warm.facts || warm.line) && (
          <div className="border border-line rounded-xl p-4 bg-cream">
            <div className="text-mute fs-10 ls-0p2 mb-2">今日總結{warm.fs !== null ? ` · ${warm.fs} 分` : ""}</div>
            {(doneList.length > 0 || missList.length > 0) && (
              <div className="fs-12 mb-2 leading-relaxed">
                <span className="text-mute2 mr-2">今日必須完成</span>
                {doneList.map((t) => <span key={t} className="text-brown">✓ {t}</span>)}
                {missList.map((t) => <span key={t} className="text-mute2">✕ {t}</span>)}
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

        <button onClick={onClose} className="w-full bg-ink text-white rounded-full py-3.5 text-sm font-medium">
          完成
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
                    <TierAvatar tier={tier} size={76} nudgeLeft={12} nudgeUp={4} pullText={14} />
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
                  <TierAvatar tier={tier} size={76} nudgeLeft={12} nudgeUp={4} pullText={14} />
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
                {active.photo && <img src={active.photo} className="w-full h-40 object-cover rounded-lg" />}
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
function ProfilePage({ character, tier = "none", avgScore, collectedCount = 0, deckSize = 0, collectedCards = [], collectedDates = {}, yearLetter, setYearLetter, daily = {}, onOpenDay, onEdit, onSettings }) {
  const [showGallery, setShowGallery] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
        {/* 與明信片上的署名頭像同一組插畫，只是尺寸放大 */}
        <TierAvatar tier={tier} size={190} />
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
    </div>
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
  const importRef = useRef(null);

  const ALL_KEYS = [K_CHAR, K_SETTINGS, K_TODOS, K_DAILY, K_POSTCARDS, K_LETTERS, K_YEARLETTER, K_GENTLE];

  const exportData = () => {
    const bundle = { _app: "Lumi", _version: 1, _exportedAt: new Date().toISOString(), data: {} };
    ALL_KEYS.forEach((k) => {
      const raw = localStorage.getItem(k);
      if (raw !== null) bundle.data[k] = raw;
    });
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    a.href = url;
    a.download = `lumi-backup-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("已匯出備份檔");
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
        <button onClick={() => { setSettings(form); onClose(); }} className="w-full bg-ink text-white rounded-full py-3 text-sm">儲存設定</button>
      </div>
    </Modal>
  );
}
