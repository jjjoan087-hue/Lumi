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
const moods = ["🙂", "😌", "😢", "😤", "😴", "🤍", "🔥"];
const MOOD_WEIGHTS = { "🙂": 3, "😌": 2, "😢": -3, "😤": -2, "😴": -1, "🤍": 2, "🔥": 4 };

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
function avatarStateFromScore(score) {
  if (score === null || score === undefined) return { key: "neutral", label: "", filter: "none", badge: null };
  if (score >= 90) return { key: "glow", label: "發光中", filter: "none", badge: "✨" };
  if (score >= 65) return { key: "good", label: "狀態不錯", filter: "none", badge: null };
  if (score >= 40) return { key: "tired", label: "有點疲倦", filter: "grayscale(35%) brightness(0.97)", badge: "😮\u200d💨" };
  return { key: "resting", label: "坐著休息中", filter: "grayscale(65%) brightness(0.92)", badge: "💤" };
}

function stampForDays(days) {
  if (days <= 7) return { key: "dream", label: "夢境郵票", glyph: "☾", tint: "#4B4E7A" };
  if (days <= 14) return { key: "flower", label: "花朵郵票", glyph: "✿", tint: "#A85A6E" };
  if (days <= 30) return { key: "cloud", label: "雲朵郵票", glyph: "☁", tint: "#3E6E8E" };
  return { key: "crown", label: "皇冠郵票", glyph: "♛", tint: "#9A7A2E" };
}

// 成長指引：依分數區間，並回扣使用者自己填的年度目標
function scoreGuidance(score, yearGoal) {
  const goal = yearGoal && yearGoal.trim() ? yearGoal.trim() : "理想中的自己";
  if (score === null || score === undefined) return { text: "今天還沒有為自己打分。", range: "" };
  if (score < 60) return { text: `是什麼阻礙了你與「${goal}」的連結？先別苛責自己，回到最基本的節奏，把一件小事做完就好。`, range: "< 60" };
  if (score < 70) return { text: `朝「${goal}」前進的雛形已經出現了，今天可以往哪個方向再推進一點點？`, range: "60－70" };
  if (score < 80) return { text: `穩定前進中，離「${goal}」又近了一些。可以開始留意「品質」而不只是「完成」。`, range: "70－80" };
  if (score < 90) return { text: `很接近「${goal}」的樣子了，保持這個節奏，別放鬆對自己的溫柔。`, range: "80－90" };
  if (score < 100) return { text: `妳已經往「${goal}」邁進了！`, range: "90－100" };
  return { text: `妳成功了！這就是「${goal}」的樣子。`, range: "100" };
}

// 自動生成的每日成長總結：串聯洞見卡、轉盤結果、照片與分數
function buildDailySummary(r) {
  if (!r) return "今天還沒有留下任何紀錄。";
  const parts = [];
  if (r.insightCard) parts.push(`今天抽到的洞見卡是「${r.insightCard.word}」——${r.insightCard.meaning}`);
  if (r.wheelPick) {
    const status = r.wheelStatus === "check" ? "已經完成了" : r.wheelStatus === "cross" ? "還沒有完成" : "尚未勾選完成與否";
    parts.push(`轉盤選出今天必須完成的事是「${r.wheelPick}」，${status}。`);
  }
  if (r.photo) parts.push("今天也留下了一張值得紀錄的照片。");
  const fs = computeFinalScore(r);
  if (fs !== null) {
    const moodTxt = r.mood ? `，心情是 ${r.mood}` : "";
    parts.push(`為自己打了 ${r.score} 分${moodTxt}，加上轉盤與心情的調整，最終分數是 ${fs} 分。`);
  }
  if (parts.length === 0) return "今天還沒有留下任何紀錄。";
  return parts.join("");
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

function MoodAvatar({ score, size = 64 }) {
  const state = avatarStateFromScore(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative rounded-full ${state.key === "glow" ? "avatar-glow" : ""} ${state.key === "resting" ? "-rotate-3" : ""}`}
        style={{ width: size, height: size }}
      >
        <Avatar size={size} style={{ filter: state.filter }} />
        {state.badge && <span className="absolute -top-1 -right-1 text-sm leading-none">{state.badge}</span>}
      </div>
      {state.label && <div className="fs-10 text-mute">{state.label}</div>}
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
   背景音樂：以 Tone.js 即時生成的輕柔氛圍音效（不依賴外部音檔/第三方嵌入）
---------------------------------------------------------------- */
function useAmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const engineRef = useRef(null);

  const toggle = async () => {
    if (!playing) {
      await Tone.start();
      if (!engineRef.current) {
        const reverb = new Tone.Reverb({ decay: 6, wet: 0.5 }).toDestination();
        const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sine" },
          envelope: { attack: 2, decay: 1, sustain: 0.6, release: 4 },
        }).connect(reverb);
        synth.volume.value = -8;
        const chords = [
          ["C4", "E4", "G4"],
          ["A3", "C4", "E4"],
          ["F3", "A3", "C4"],
          ["G3", "B3", "D4"],
        ];
        let i = 0;
        const loop = new Tone.Loop((time) => {
          synth.triggerAttackRelease(chords[i % chords.length], "2n", time);
          i++;
        }, "2m").start(0);
        engineRef.current = { synth, loop };
      }
      Tone.Transport.start();
      setPlaying(true);
    } else {
      Tone.Transport.pause();
      setPlaying(false);
    }
  };

  useEffect(() => () => {
    Tone.Transport.stop();
  }, []);

  return { playing, toggle };
}

function MusicButton() {
  const { playing, toggle } = useAmbientMusic();
  return (
    <button
      onClick={toggle}
      className="fixed bottom-24 left-4 z-30 w-10 h-10 rounded-full bg-ink-o85 text-white flex items-center justify-center shadow-md"
      title="背景音樂"
    >
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
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
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&family=Noto+Sans+TC:wght@400;500;600&family=Yomogi&display=swap');
      .font-sans { font-family: 'Noto Sans TC', sans-serif; }
      .font-serif { font-family: 'Noto Serif TC', serif; }
      .font-hand { font-family: 'Yomogi', 'Noto Sans TC', cursive; }
      button { transition: transform 0.15s ease, opacity 0.15s ease; }
      button:active { transform: scale(0.96); }
      .page-fade { animation: pageFade 0.35s ease; }
      @keyframes pageFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .wheel-zoom { animation: wheelZoom 0.5s cubic-bezier(.2,.9,.3,1.15); }
      @keyframes wheelZoom { from { transform: scale(0.55); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .marquee-track { animation: marquee 42s linear infinite; }
      @keyframes marquee { 0% { transform: translateX(100%);} 100% { transform: translateX(-100%);} }
      .flipcard { perspective: 1200px; }
      .flipcard-inner { transition: transform 0.7s cubic-bezier(.4,.2,.2,1); transform-style: preserve-3d; }
      .flipped { transform: rotateY(180deg); }
      .face { backface-visibility: hidden; }
      .face-back { transform: rotateY(180deg); }
      .avatar-glow { animation: glowPulse 2.4s ease-in-out infinite; }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 6px 2px rgba(176,141,87,0.35); }
        50% { box-shadow: 0 0 16px 6px rgba(176,141,87,0.6); }
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .envelope-fly { animation: flyUp 1.4s ease-in forwards; }
      @keyframes flyUp {
        0% { transform: translateY(60px) scale(1); opacity: 1; }
        60% { transform: translateY(-60px) scale(0.9); opacity: 1; }
        100% { transform: translateY(-160px) scale(0.4); opacity: 0; }
      }
      .paper-grain {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E");
      }

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

      .tier-ring-grey{box-shadow:0 0 0 4px #FAF8F4, 0 0 0 6px #D8D5CE;}
      .tier-ring-gold{box-shadow:0 0 0 4px #FAF8F4, 0 0 0 6px #E7D9BC;}
      .tier-ring-star{box-shadow:0 0 0 4px #FAF8F4, 0 0 0 8px #F0DFA9;}

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
  const tint = stamp?.tint || "#1C1C1C";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <defs>
        <path id={pathId} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke={tint} strokeWidth="1.3" strokeDasharray="1.5 3.5" opacity="0.85" />
      <circle cx="50" cy="50" r="37" fill="none" stroke={tint} strokeWidth="1.1" opacity="0.9" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={tint} strokeWidth="0.6" opacity="0.5" />
      <text fontSize="6.6" letterSpacing="2.2" fill={tint} opacity="0.9">
        <textPath href={`#${pathId}`} startOffset="2%">
          ✦ TIME MAIL ✦ TIME MAIL ✦
        </textPath>
      </text>
      {locked ? (
        <text x="50" y="60" fontSize="24" textAnchor="middle">🔒</text>
      ) : (
        <text x="50" y="60" fontSize="26" textAnchor="middle" fill={tint}>{stamp.glyph}</text>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------
   主程式
---------------------------------------------------------------- */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [settings, setSettings] = useState({ cardTime: "08:00", scoreTime: "21:00" });
  const [todos, setTodos] = useState([]);
  const [daily, setDaily] = useState({});
  const [postcards, setPostcards] = useState([]);

  const [showSettings, setShowSettings] = useState(false);
  const [showEditChar, setShowEditChar] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
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
  const avatarTier = avgScore === null ? "none" : avgScore < 60 ? "plain" : avgScore < 80 ? "ring" : avgScore < 95 ? "gold" : "star";

  useEffect(() => {
    (async () => {
      const [c, s, t, d, p] = await Promise.all([
        loadKey(K_CHAR, DEFAULT_CHARACTER),
        loadKey(K_SETTINGS, { cardTime: "08:00", scoreTime: "21:00" }),
        loadKey(K_TODOS, []),
        loadKey(K_DAILY, {}),
        loadKey(K_POSTCARDS, []),
      ]);
      setCharacter(c);
      setSettings(s);
      setTodos(t);
      setDaily(d);
      setPostcards(p);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) saveKey(K_CHAR, character); }, [character, loaded]);
  useEffect(() => { if (loaded) saveKey(K_SETTINGS, settings); }, [settings, loaded]);
  useEffect(() => { if (loaded) saveKey(K_TODOS, todos); }, [todos, loaded]);
  useEffect(() => { if (loaded) saveKey(K_DAILY, daily); }, [daily, loaded]);
  useEffect(() => { if (loaded) saveKey(K_POSTCARDS, postcards); }, [postcards, loaded]);

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
      <MusicButton />

      {character.yearGoal ? (
        <div className="bg-ink text-paper fs-11 py-1.5 overflow-hidden whitespace-nowrap shrink-0">
          <div className="inline-block marquee-track">✦ {character.yearGoal} ✦ {character.yearGoal} ✦ {character.yearGoal}</div>
        </div>
      ) : null}

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
            onEdit={() => setShowEditChar(true)}
            onSettings={() => setShowSettings(true)}
          />
        )}
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-paper flex justify-around items-center py-2">
        {[
          { id: 1, icon: Home, label: "首頁" },
          { id: 2, icon: CalendarDays, label: "日曆" },
          { id: 3, icon: Mail, label: "明信片" },
          { id: 4, icon: User, label: "我" },
        ].map((it) => (
          <button
            key={it.id}
            onClick={() => setPage(it.id)}
            className={`flex flex-col items-center gap-1 px-4 py-1 ${page === it.id ? "text-ink" : "text-mute2"}`}
          >
            <it.icon size={20} strokeWidth={page === it.id ? 2.4 : 1.8} />
            <span className="fs-10 tracking-wide">{it.label}</span>
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
              <div className="fs-15 font-medium text-brown2 mb-2">座右銘（之後可更改）</div>
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
              <div className="fs-13 text-mute mt-1">會顯示在首頁最上方的跑馬燈</div>
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
  character, rec, missedDays = 0, drawCard, revealExplanation, todos, newTodo, setNewTodo,
  addTodo, toggleTodo, removeTodo, handleHomePhoto, setWheelStatus, openWheel,
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
          <MoodAvatar score={computeFinalScore(rec)} size={56} />
          <div>
            <div className="fs-12 text-mute">{new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" })}</div>
            <div className="font-serif text-xl mt-0.5">{character.name ? `${character.name}，早安。` : "早安。"}</div>
          </div>
        </div>

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
            <img src={rec.photo} className="w-full h-48 object-cover rounded-2xl" />
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
  // 每一格都有自己的柔和色（以色相平均分佈，不重複）
  const segColor = (i) => `hsl(${Math.round((360 / Math.max(n, 1)) * i)}, 32%, 88%)`;

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
                  <div
                    key={t.id}
                    className="absolute left-1/2 top-1/2 origin-left"
                    style={{ width: "128px", transform: `rotate(${mid}deg)` }}
                  >
                    {/* 內距 42px 避開中央按鈕，寬 80px 置中於扇形帶狀區 */}
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{ marginLeft: "42px", width: "80px", transform: "translateY(-50%)" }}
                    >
                      <span className="fs-9 font-semibold w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center mb-0.5">
                        {i + 1}
                      </span>
                      <span
                        className="fs-10 font-medium text-center"
                        style={{
                          color: "#1C1C1C",
                          textShadow: "0 0 4px rgba(255,255,255,0.95), 0 0 2px rgba(255,255,255,0.95)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80px",
                        }}
                      >
                        {t.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={spin}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-paper border-2 border-ink flex flex-col items-center justify-center gap-0.5"
            >
              <RotateCw size={15} className={spinning ? "animate-spin" : ""} />
              <span className="fs-8 leading-none text-brown">決定<br/>今日行動</span>
            </button>
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
              <div className="text-xl mt-1">{topMood || "－"}</div>
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
function DayModal({ date, record, yearGoal, onClose, updateRecord, setWheelStatus }) {
  const fileRef = useRef(null);
  const [wheelInput, setWheelInput] = useState("");
  const fs = computeFinalScore(record);
  const guidance = scoreGuidance(fs, yearGoal);
  const summary = buildDailySummary(record);

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
          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => updateRecord({ mood: m })}
                className={`w-9 h-9 rounded-full border flex items-center justify-center text-base ${record.mood === m ? "border-ink bg-tan" : "border-line"}`}
              >{m}</button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>今日值得紀錄的照片</SectionLabel>
          <input type="file" accept="image/*" ref={fileRef} className="hidden"
            onChange={async (e) => e.target.files[0] && updateRecord({ photo: await resizeImageToDataURL(e.target.files[0]) })} />
          {record.photo ? (
            <img src={record.photo} onClick={() => fileRef.current.click()} className="w-full h-40 object-cover rounded-xl" />
          ) : (
            <button onClick={() => fileRef.current.click()} className="w-full h-24 rounded-xl border border-dashed border-line3 flex items-center justify-center text-mute text-xs gap-2">
              <Camera size={16} /> 新增照片
            </button>
          )}
        </div>

        <div>
          <SectionLabel>自動生成的成長總結</SectionLabel>
          <div className="bg-tan border border-line2 rounded-xl p-3 fs-12p5 leading-relaxed text-brown2">
            {summary}
          </div>
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
function PostcardPage({ character, postcards, setPostcards, openPostcard, setOpenPostcard }) {
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [days, setDays] = useState(7);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const send = () => {
    if (!content.trim()) return;
    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const arrive = new Date(now.getTime() + days * 86400000);
      arrive.setHours(9, 0, 0, 0);
      const stamp = stampForDays(days);
      setPostcards((prev) => [
        { id: Date.now().toString(), content, photo, days, sentAt: now.toISOString(), arriveAt: arrive.toISOString(), stamp, status: "transit", opened: false },
        ...prev,
      ]);
      setSending(false);
      setContent("");
      setPhoto(null);
      setDays(7);
    }, 1400);
  };

  const openIt = (pc) => {
    if (pc.status !== "arrived") return;
    setPostcards((prev) => prev.map((p) => (p.id === pc.id ? { ...p, opened: true } : p)));
    setOpenPostcard(pc.id);
  };

  const active = postcards.find((p) => p.id === openPostcard);

  return (
    <div className="px-5 pt-5 pb-8 space-y-6">
      <div className="font-serif text-lg">給未來的明信片</div>

      {sending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center app-bg-gradient">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute text-6xl opacity-60 -top-6 -left-8">☁️</div>
            <div className="absolute text-7xl opacity-70 top-2 right-0">☁️</div>
            <div className="absolute text-5xl opacity-50 bottom-2 left-2">☁️</div>
            <div className="text-7xl envelope-fly">✉️</div>
          </div>
          <div className="fs-13 text-mute mt-4">投遞至雲端中…</div>
        </div>
      )}

      {!sending && (
        <div className="space-y-4">
          <input type="file" accept="image/*" ref={fileRef} className="hidden"
            onChange={async (e) => e.target.files[0] && setPhoto(await resizeImageToDataURL(e.target.files[0]))} />

          <AirmailFrame>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-line">
                    <Avatar size={32} />
                  </div>
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
            <DayRoller value={days} onChange={setDays} max={60} />
            <div className="mt-3 flex items-center justify-center">
              <PostmarkBadge stamp={stampForDays(days)} size={72} />
            </div>
            <div className="mt-2 text-center fs-12 text-mute">將貼上「{stampForDays(days).label}」</div>
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
                    <div className="relative p-3 flex flex-col" style={{ aspectRatio: "4 / 5" }}>
                      <div className="flex items-start justify-between">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-line">
                          <Avatar size={36} />
                        </div>
                        <div
                          className="w-8 h-9 border flex items-center justify-center text-base"
                          style={{ borderStyle: "dashed", borderColor: pc.stamp.tint, backgroundColor: `${pc.stamp.tint}1F`, color: pc.stamp.tint }}
                        >
                          {pc.stamp.glyph}
                        </div>
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
              <div className="font-serif text-lg">{new Date(active.sentAt).toLocaleDateString("zh-TW")} 的信</div>
              <PostmarkBadge stamp={active.stamp} size={52} />
            </div>
            <AirmailFrame>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-line">
                    <Avatar size={32} />
                  </div>
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
function ProfilePage({ character, tier = "none", avgScore, collectedCount = 0, deckSize = 0, collectedCards = [], collectedDates = {}, onEdit, onSettings }) {
  const [showGallery, setShowGallery] = useState(false);
  const tierStyle = {
    none: "border-line",
    plain: "border-line3",
    ring: "border-ink tier-ring-grey",
    gold: "border-gold tier-ring-gold",
    star: "border-gold tier-ring-star",
  }[tier];
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
        <div className={`w-24 h-24 rounded-full border-2 overflow-hidden ${tierStyle}`}>
          <Avatar size={96} />
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

        <div className="w-full mt-6 space-y-4 text-left">
          <div className="border-t border-line pt-4">
            <SectionLabel>理想中的樣子</SectionLabel>
            <p className="text-sm leading-relaxed">{character.idealSelf || "尚未填寫"}</p>
          </div>
          <div className="border-t border-line pt-4">
            <SectionLabel>年度目標</SectionLabel>
            <p className="text-sm leading-relaxed">{character.yearGoal || "尚未填寫"}</p>
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
    </div>
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
  return (
    <Modal onClose={onClose}>
      <div className="p-6 space-y-6" style={{ maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
        <div className="font-serif text-lg">提醒設定</div>
        <div>
          <SectionLabel>洞見卡通知時間</SectionLabel>
          <TimeSelect value={form.cardTime} onChange={(v) => setForm({ ...form, cardTime: v })} />
        </div>
        <div>
          <SectionLabel>每日打分通知時間</SectionLabel>
          <TimeSelect value={form.scoreTime} onChange={(v) => setForm({ ...form, scoreTime: v })} />
        </div>
        <p className="fs-11 text-mute2 leading-relaxed">此原型會保存你設定的時間，但預覽環境無法真正推播系統通知；正式上架後這裡會串接手機的推播提醒。</p>
        <button onClick={() => { setSettings(form); onClose(); }} className="w-full bg-ink text-white rounded-full py-3 text-sm">儲存設定</button>
      </div>
    </Modal>
  );
}
