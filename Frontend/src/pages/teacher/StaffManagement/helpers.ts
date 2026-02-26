import { AVATAR_COLORS } from "./constants";

/* ─── HELPERS ────────────────────────────────────────────────────────── */
export const fmt = (n: number) => `KSh ${Number(n).toLocaleString("en-KE")}`;
export const initials = (f: string, l: string) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
export const avatarBg = (id: string) => AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];
