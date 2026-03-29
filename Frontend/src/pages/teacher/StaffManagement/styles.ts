import { T } from "./constants";

/* ─── SHARED CSS-in-JS STYLES ────────────────────────────────────────── */
export const inp: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: `1px solid ${T.border}`, borderRadius: 8,
  fontSize: 14, color: T.text.primary, background: "white",
  outline: "none", boxSizing: "border-box",
};

export const sel: React.CSSProperties = { ...inp, appearance: "none", cursor: "pointer" };

export const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  button, select, input { font-family: inherit; }
  .card-h { transition: all 0.18s; }
  .card-h:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; transform: translateY(-2px); }
  .icon-btn:hover { background: #F1F5F9 !important; }
  .row-h:hover { background: #F8FAFC !important; cursor: pointer; }
  @keyframes fu { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fu { animation: fu 0.25s ease both; }
`;
