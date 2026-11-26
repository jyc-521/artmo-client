import { Global, css } from '@emotion/react';
import { theme } from './theme';

const c = theme.color;
const r = theme.room;

const styles = css`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin: 0; min-height: 100%; }
  body {
    background: ${c.bg}; color: ${c.text}; font-family: ${theme.font.sans};
    font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased;
    word-break: keep-all; overflow-wrap: anywhere;
  }
  a { color: ${c.accent}; }
  a:hover { color: ${c.text}; }
  button, input, textarea, select { font: inherit; color: inherit; }
  :focus-visible { outline: 3px solid ${c.accent}; outline-offset: 2px; }
  img { max-width: 100%; display: block; }
  .serif { font-family: ${theme.font.serif}; }
  .muted { color: ${c.textMuted}; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .page { width: 100%; max-width: ${theme.maxWidth}; margin: 0 auto; padding: 32px 20px 120px; flex: 1; }
  .page.wide { max-width: ${theme.wideWidth}; }
  @media (min-width: 900px) { .page { padding-bottom: 64px; } }

  .header { position: sticky; top: 0; z-index: 10; background: ${c.bg}; border-bottom: 1px solid ${c.line}; }
  .header-inner { max-width: ${theme.wideWidth}; margin: 0 auto; height: 60px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .logo { font-family: ${theme.font.serif}; font-weight: 700; font-size: 20px; letter-spacing: 4px; color: ${c.text}; text-decoration: none; }
  .topnav { display: none; gap: 28px; align-items: center; }
  .topnav a { text-decoration: none; color: ${c.text}; padding: 10px 0; }
  .topnav a.active { color: ${c.accent}; font-weight: 600; }
  @media (min-width: 900px) { .topnav { display: flex; } .header-inner .header-login { display: none; } }

  .bottomnav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; height: 64px; background: ${c.surface}; border-top: 1px solid ${c.line}; display: grid; grid-template-columns: repeat(3, 1fr); }
  .bottomnav a { display: flex; align-items: center; justify-content: center; text-decoration: none; color: ${c.textMuted}; font-size: 14px; }
  .bottomnav a.active { color: ${c.accent}; font-weight: 700; }
  @media (min-width: 900px) { .bottomnav { display: none; } }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 52px; padding: 0 24px; border-radius: ${theme.radius.md}; border: 1px solid ${c.accent}; background: ${c.accent}; color: ${c.accentText}; font-weight: 600; font-size: 16px; cursor: pointer; text-decoration: none; }
  .btn:hover { color: ${c.accentText}; filter: brightness(1.12); }
  .btn.secondary { background: transparent; color: ${c.accent}; }
  .btn.secondary:hover { color: ${c.accent}; background: ${c.surfaceMuted}; filter: none; }
  .btn.ghost { background: transparent; border-color: transparent; color: ${c.text}; padding: 0 8px; }
  .btn.ghost:hover { color: ${c.accent}; filter: none; }
  .btn.small { min-height: 44px; padding: 0 16px; font-size: 14px; }
  .btn.danger { background: ${c.danger}; border-color: ${c.danger}; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; filter: none; }
  .btn-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label, .label { font-size: 14px; color: ${c.textMuted}; }
  .input, .textarea { width: 100%; border: 1px solid ${c.line}; border-radius: ${theme.radius.md}; background: ${c.surface}; padding: 14px 16px; font-size: 16px; }
  .input:focus, .textarea:focus { border-color: ${c.accent}; outline: none; box-shadow: 0 0 0 3px rgba(31, 58, 95, 0.15); }
  .textarea { resize: none; line-height: 1.6; }
  .field-error { color: ${c.danger}; font-size: 14px; }
  .field-help { display: flex; justify-content: space-between; font-size: 13px; color: ${c.textMuted}; }

  .notice { background: ${c.surfaceMuted}; border-radius: ${theme.radius.md}; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
  .tag { display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border: 1px solid ${c.line}; border-radius: ${theme.radius.pill}; font-size: 13px; background: ${c.surface}; color: ${c.text}; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
  .chip { flex-shrink: 0; min-height: 40px; padding: 0 16px; border-radius: ${theme.radius.pill}; border: 1px solid ${c.line}; background: ${c.surface}; cursor: pointer; font-size: 14px; }
  .chip[aria-pressed='true'] { background: ${c.accent}; border-color: ${c.accent}; color: ${c.accentText}; }

  .tabs { display: grid; grid-template-columns: repeat(2, 1fr); border-bottom: 1px solid ${c.line}; margin-bottom: 16px; }
  .tab { min-height: 48px; background: none; border: 0; border-bottom: 2px solid transparent; cursor: pointer; color: ${c.textMuted}; font-size: 15px; }
  .tab[aria-selected='true'] { color: ${c.text}; font-weight: 700; border-color: ${c.text}; }

  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 14px; }
  @media (min-width: 900px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px 24px; } }
  .tile { display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: ${c.text}; }
  .tile-img { aspect-ratio: 4 / 5; width: 100%; object-fit: cover; background: ${c.imagePlaceholder}; border-radius: ${theme.radius.sm}; }
  .tile-title { font-family: ${theme.font.serif}; font-weight: 600; font-size: 15px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .tile-artist { font-size: 13px; color: ${c.textMuted}; }

  /* 작품은 테두리 없이 그림자만 — 액자 매트처럼 보이는 흰 여백을 두지 않는다. */
  .artwork-frame { display: flex; justify-content: center; align-items: center; }
  .artwork-frame img { width: auto; max-width: 100%; max-height: 70vh; box-shadow: 0 12px 32px rgba(43, 39, 36, 0.22); }
  .quote { font-family: ${theme.font.serif}; font-size: 22px; line-height: 1.55; font-weight: 600; margin: 0; }
  .work-title { font-family: ${theme.font.serif}; font-size: 22px; font-weight: 700; margin: 0; line-height: 1.4; }
  .h1 { font-family: ${theme.font.serif}; font-size: 30px; line-height: 1.4; font-weight: 700; margin: 0; }
  @media (min-width: 900px) { .h1 { font-size: 40px; } .quote { font-size: 26px; } }
  .h2 { font-family: ${theme.font.serif}; font-size: 20px; margin: 0; }
  .stack { display: flex; flex-direction: column; gap: 20px; }
  .stack.tight { gap: 8px; }
  .row-between { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
  .card { background: ${c.surface}; border: 1px solid ${c.line}; border-radius: ${theme.radius.md}; padding: 20px; }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .status { font-size: 13px; padding: 2px 10px; border-radius: ${theme.radius.pill}; background: ${c.surfaceMuted}; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid ${c.line}; vertical-align: middle; }
  th { color: ${c.textMuted}; font-weight: 600; }

  .result-layout { display: flex; flex-direction: column; gap: 24px; }
  @media (min-width: 900px) { .result-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: start; } }

  /* 어두운 전시실 (결과 화면). ResultPage가 body에 room 클래스를 붙인다. */
  body.room { background: ${r.bg}; color: ${r.text}; }
  body.room a { color: ${r.accent}; }
  body.room a:hover { color: ${r.text}; }
  body.room :focus-visible { outline-color: ${r.accent}; }
  body.room .muted { color: ${r.textMuted}; }
  body.room .header { background: ${r.bg}; border-bottom-color: ${r.line}; }
  body.room .logo, body.room .topnav a { color: ${r.text}; }
  body.room .topnav a.active { color: ${r.accent}; }
  body.room .bottomnav { background: ${r.surface}; border-top-color: ${r.line}; }
  body.room .bottomnav a { color: ${r.textMuted}; }
  body.room .bottomnav a.active { color: ${r.accent}; }
  body.room .btn { background: ${r.accent}; border-color: ${r.accent}; color: ${r.accentText}; }
  body.room .btn:hover { color: ${r.accentText}; }
  body.room .btn.secondary { background: transparent; color: ${r.accent}; }
  body.room .btn.secondary:hover { background: ${r.surface}; color: ${r.accent}; }
  body.room .btn.ghost { background: transparent; border-color: transparent; color: ${r.textMuted}; }
  body.room .btn.ghost:hover { color: ${r.text}; }
  body.room .tag { background: transparent; border-color: ${r.accentSoft}; color: ${r.accent}; }
  body.room .spinner { border-color: ${r.line}; border-top-color: ${r.accent}; }

  /* 작품 색이 화면 배경에 번지는 잔광. 작품 이미지에는 씌우지 않는다. */
  .room-ambient { position: fixed; inset: 0; z-index: -2; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.6s ease; }
  .room-ambient.on { opacity: 0.85; }
  .room-ambient::after { content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(18,17,16,0.15) 0%, rgba(18,17,16,0.4) 40%, rgba(18,17,16,0.88) 65%, ${r.bg} 90%); }
  @media (min-width: 900px) {
    .room-ambient::after { background: radial-gradient(ellipse 60% 85% at 28% 50%, rgba(18,17,16,0.3), rgba(18,17,16,0.75) 60%, rgba(18,17,16,0.95) 100%); }
  }
  body.room .header { background: rgba(18, 17, 16, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }

  /* 들어올 때 작품 → 문장 → 설명 순서로 천천히 떠오른다. */
  @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  /* 불이 켜지면서 작품이 어둠 속에서 드러난다 */
  @keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
  .result-room .artwork-frame { animation: reveal 1.6s ease 0.3s both; }
  .result-room .result-layout > .stack > * { animation: rise 0.8s ease both; }
  .result-room .result-layout > .stack > :nth-child(1) { animation-delay: 1s; }
  .result-room .result-layout > .stack > :nth-child(2) { animation-delay: 1.2s; }
  .result-room .result-layout > .stack > :nth-child(3) { animation-delay: 1.4s; }
  .result-room .result-layout > .stack > :nth-child(4) { animation-delay: 1.55s; }
  .result-room .result-layout > .stack > :nth-child(n+5) { animation-delay: 1.7s; }
  @media (prefers-reduced-motion: reduce) {
    .result-room .artwork-frame, .result-room::before, .result-room .result-layout > .stack > * { animation: none; }
    .room-ambient { transition: none; }
  }

  /* 작품 설명판 */
  .label-meta { font-size: 13px; letter-spacing: 0.3px; }
  .track { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid ${r.accentSoft}; }
  .heart { flex-shrink: 0; width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
  .heart svg { fill: none; stroke: ${r.accent}; stroke-width: 1.8; transition: fill 0.2s ease, transform 0.2s ease; }
  .heart:hover svg { transform: scale(1.1); }
  .heart[aria-pressed='true'] svg { fill: ${r.accent}; }
  .heart:disabled { cursor: wait; opacity: 0.6; }
  .quote.museum-quote { font-size: 26px; line-height: 1.5; text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35); }
  @media (min-width: 900px) { .quote.museum-quote { font-size: 32px; } }

  .room-stage { position: relative; padding: 24px 0; }
  /* 천장 조명: 화면 맨 위에서 작품 쪽으로 떨어지는 빛. 화면 전체 층이라 가장자리가 생기지 않는다. */
  .result-room::before { content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background: radial-gradient(ellipse 60% 55% at 50% 0%, ${r.spot}, transparent 75%),
      radial-gradient(ellipse 50% 35% at 50% 35%, ${r.glow}, transparent 70%);
    animation: lights-on 1.8s ease-out both; }
  @media (min-width: 900px) {
    .result-room::before { background: radial-gradient(ellipse 35% 70% at 28% 0%, ${r.spot}, transparent 75%),
      radial-gradient(ellipse 30% 45% at 28% 50%, ${r.glow}, transparent 70%); }
  }
  @keyframes lights-on { 0% { opacity: 0; } 30% { opacity: 0.5; } 40% { opacity: 0.25; } 100% { opacity: 1; } }
  body.room .artwork-frame img { box-shadow: 0 24px 60px ${r.shadow}; }
  .result-room { isolation: isolate; }
  .eyebrow { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; letter-spacing: 3px; color: ${r.accent}; }
  .eyebrow::before { content: ''; width: 40px; height: 2px; background: ${r.accent}; }
  .plate { padding-top: 20px; border-top: 1px solid ${r.accentSoft}; }
  .qmark { color: ${r.accent}; }
  .interpretation { margin: 0; font-size: 17px; line-height: 1.8; color: ${r.textMuted}; }
  .action-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding-top: 8px; border-top: 1px solid ${r.line}; }
  .action-links .btn { white-space: nowrap; padding: 0 4px; }
  @media (min-width: 900px) { .result-room .result-layout { align-items: center; min-height: calc(100vh - 160px); } }

  /* ── 입구(홈): 화면을 가득 채운 거대한 청동 대문 ──
     돌 문틀이 화면 가로를 꽉 채우고, 활짝 열린 문짝이 양옆에 서 있다(움직이지 않음).
     문 너머 전시실 안쪽 벽을 따라 작품이 돌고, 그 앞에서 문장을 쓴다. */
  .lobby { position: relative; flex: 1; display: flex; flex-direction: column; background: #0B0A09; }
  .gate { position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden; isolation: isolate;
    min-height: max(600px, calc(100svh - 125px)); padding: 0 10px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='s' x='0' y='0' width='100%25' height='100%25'><feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' seed='2' stitchTiles='stitch'/><feDiffuseLighting surfaceScale='1.4' lighting-color='%23544c44' diffuseConstant='1'><feDistantLight azimuth='270' elevation='60'/></feDiffuseLighting></filter><rect width='400' height='400' filter='url(%23s)'/></svg>"), linear-gradient(to bottom, #1A1714, #0E0C0B); background-size: 400px 400px, auto; background-blend-mode: multiply, normal; }
  @media (min-width: 900px) { .gate { min-height: max(640px, calc(100svh - 61px)); padding: 0 18px; } }
  .gate-lintel { position: relative; z-index: 1; flex: 0 0 auto; height: 48px; display: flex; align-items: center; justify-content: center; }
  .gate-lintel span { font-family: ${theme.font.serif}; font-weight: 700; font-size: 17px; letter-spacing: 18px; padding-left: 18px;
    color: #8C744F; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.9), 0 1px 0 rgba(255, 220, 160, 0.18); }
  @media (min-width: 900px) { .gate-lintel { height: 56px; } .gate-lintel span { font-size: 22px; letter-spacing: 26px; padding-left: 26px; } }

  /* 돌 문틀: 화면 가로를 꽉 채운다 */
  .gate-frame { position: relative; z-index: 1; flex: 1 1 auto; display: flex; flex-direction: column; padding: 12px 12px 0;
    background: linear-gradient(to bottom, #3A332B, #2A251F 60%, #221E19);
    box-shadow: inset 0 1px 0 rgba(255, 230, 190, 0.18), 0 0 0 4px #1E1A16, 0 0 0 5px rgba(255, 220, 170, 0.10), 0 -20px 60px rgba(0, 0, 0, 0.6); }
  @media (min-width: 900px) { .gate-frame { padding: 20px 22px 0; } }
  .gate-doorway { position: relative; flex: 1; perspective: 1800px; perspective-origin: 50% 45%; background: ${r.bg};
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.9), inset 0 26px 30px -14px rgba(0, 0, 0, 0.95); }
  .gate-threshold { flex: 0 0 auto; height: 14px; margin: 0 -12px; background: linear-gradient(to bottom, #5A4E40, #3A3229 40%, #241F1A);
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 230, 190, 0.25); }
  @media (min-width: 900px) { .gate-threshold { margin: 0 -22px; height: 18px; } }

  /* 문 너머 전시실 */
  .gate-room { position: absolute; inset: 0; z-index: 0; overflow: hidden; overflow-y: auto; display: flex; flex-direction: column; justify-content: center; padding: 16px 0 19%;
    background: radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255, 228, 185, 0.16), transparent 75%), ${r.bg}; color: ${r.text}; }
  .gate-room-floor { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; pointer-events: none;
    background: radial-gradient(ellipse 40% 90% at 50% 0%, rgba(255, 220, 160, 0.12), transparent 70%), linear-gradient(to bottom, #1A1612, #261F18);
    box-shadow: inset 0 1px 0 rgba(255, 230, 190, 0.08); }

  /* 오목한 회전 전시대: 원기둥 '안쪽' 벽에 작품이 걸려 관람자를 향하고, 전체가 한 방향으로 돈다.
     가운데 작품이 가장 깊이 들어가 있고 양옆 작품이 감싸듯 다가온다. 회전은 CSS(GPU) 애니메이션. */
  .corridor { --w: 190px; --h: 150px; --r: 400px; position: relative; z-index: 1; height: 150px; flex-shrink: 0; width: 72%; margin: 0 auto; overflow: hidden; perspective: 460px; perspective-origin: 50% 50%; }
  @media (min-width: 900px) { .corridor { --w: 300px; --h: 220px; --r: 640px; height: 240px; width: 50%; perspective: 760px; } }
  .carousel { position: relative; width: var(--w); height: var(--h); margin: 0 auto; transform-style: preserve-3d; animation: carousel 110s linear infinite; }
  @keyframes carousel { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
  .carousel-item { position: absolute; inset: 0; margin: 0; display: flex; align-items: center; justify-content: center; backface-visibility: hidden;
    transform: rotateY(calc(360deg / var(--n) * var(--i))) translateZ(calc(var(--r) * -1)); }
  .carousel-item img { display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; box-shadow: 0 16px 26px -10px rgba(0, 0, 0, 0.85); }

  /* 청동 문짝(scripts/render-door.py → public/doors): 경첩은 바깥, 활짝 열린 채 고정. 항상 전시실보다 앞. */
  .door { position: absolute; top: 0; bottom: 0; width: 50%; z-index: 4; pointer-events: none; transform-style: preserve-3d;
    background: #2A1F15 center / 100% 100% no-repeat; --kx: 50%; --ky: 56.4%; --kw: 43%; }
  .door-left { left: 0; transform-origin: left center; transform: rotateY(80deg); background-image: url(/doors/left_tall.webp); }
  .door-right { right: 0; transform-origin: right center; transform: rotateY(-80deg); background-image: url(/doors/right_tall.webp); }
  @media (min-width: 900px) {
    .door { --ky: 43.88%; --kw: 20.8%; }
    .door-left { transform: rotateY(70deg); background-image: url(/doors/left_wide.webp); --kx: 72.75%; }
    .door-right { transform: rotateY(-70deg); background-image: url(/doors/right_wide.webp); --kx: 27.25%; }
  }
  .door-edge { position: absolute; top: 0; bottom: 0; width: 18px;
    background: linear-gradient(to right, #1E150C, #5E4223 60%, #A87A3E); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.55); }
  .door-edge::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 25%, transparent 75%, rgba(0,0,0,0.65)); }
  .door-left .door-edge { right: 0; transform-origin: right center; transform: rotateY(90deg); }
  .door-right .door-edge { left: 0; transform-origin: left center; transform: rotateY(-90deg); }
  @media (max-width: 899px) { .door-edge { width: 10px; } }
  .door-knocker { position: absolute; left: var(--kx); top: var(--ky); width: var(--kw); aspect-ratio: 1;
    background: url(/doors/knocker.webp) center / contain no-repeat; transform: translate(-50%, -20%) translateZ(20px);
    filter: drop-shadow(0 12px 7px rgba(0, 0, 0, 0.75)); }
  .door::after { content: ''; position: absolute; inset: 0; pointer-events: none; transform: translateZ(0.1px); }
  .door-left::after { background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent 20%, transparent 74%, rgba(0, 0, 0, 0.55)),
    linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent 40%, transparent 90%, rgba(255, 200, 130, 0.22)); }
  .door-right::after { background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent 20%, transparent 74%, rgba(0, 0, 0, 0.55)),
    linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent 40%, transparent 90%, rgba(255, 200, 130, 0.22)); }

  .gate-form { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 520px; margin: 8px auto 0; padding: 0 60px; }
  @media (min-width: 900px) { .gate-form { padding: 0 24px; margin-top: 20px; } }
  .gate-form .gate-label { font-family: ${theme.font.serif}; font-size: 18px; font-weight: 600; line-height: 1.45; color: ${r.text}; text-align: center; }
  @media (min-width: 900px) { .gate-form .gate-label { font-size: 22px; } }
  .gate-input { width: 100%; margin-top: 6px; border: 0; border-bottom: 1px solid rgba(238, 231, 220, 0.4); background: transparent; color: ${r.text};
    padding: 6px 2px; font-family: ${theme.font.serif}; font-size: 17px; line-height: 1.6; resize: none; text-align: center; }
  .gate-input { min-height: calc(1.6em * 2 + 12px); field-sizing: content; max-height: calc(1.6em * 4 + 12px); }
  @media (min-width: 900px) { .gate-input { font-size: 19px; min-height: calc(1.6em + 12px); } }
  .gate-input:focus { outline: none; border-bottom-color: ${r.accent}; }
  .gate-input::placeholder { color: ${r.textMuted}; opacity: 0.75; }
  .gate-form .field-help { color: ${r.textMuted}; }
  .gate-form .field-error { color: #F0A49A; }
  .gate-form .notice { background: ${r.surface}; border-color: ${r.line}; color: ${r.text}; }
  .gate-form .enter-btn { background: ${r.accent}; border-color: ${r.accent}; color: ${r.accentText}; border-radius: 999px; gap: 12px; }
  .gate-form .enter-btn:disabled { background: transparent; color: ${r.textMuted}; border-color: ${r.line}; filter: none; cursor: not-allowed; }
  .enter-arrow { display: inline-block; transition: transform 0.25s ease; }
  .enter-btn:not(:disabled):hover .enter-arrow { transform: translateX(6px); }
  .gate-info { margin: 0; text-align: center; font-size: 13px; color: ${r.textMuted}; }

  @media (prefers-reduced-motion: reduce) {
    .carousel { animation: none; }
  }

  /* 입장: 조명이 어두워지며 전시실로 */
  body::after { content: ''; position: fixed; inset: 0; z-index: 1000; pointer-events: none; background: ${r.bg}; opacity: 0; transition: opacity 0.55s ease; }
  body.entering::after { opacity: 1; }

  @media (prefers-reduced-motion: reduce) {
    body::after { transition: none; }
  }

  .spinner { width: 28px; height: 28px; border: 3px solid ${c.line}; border-top-color: ${c.accent}; border-radius: 50%; animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 3s; } }
  .center { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 48px 0; text-align: center; }
`;

export default function GlobalStyles() {
  return <Global styles={styles} />;
}
