import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface KittyAvatarProps {
  id: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  mood?: "idle" | "happy" | "sleepy" | "excited";
}

// ── Per-kitty design tokens ─────────────────────────────────────────────────
const KITTY_DATA: Record<string, {
  body: string; bodyStroke: string;
  earInner: string; eyeColor: string; irisColor: string;
  blush: string; whiskerColor: string;
  extra?: "tabby" | "hat" | "mask" | "galaxy" | "none";
  sleepy?: boolean; dark?: boolean;
}> = {
  k1: {
    body: "#FFD9B5", bodyStroke: "#E8A87C",
    earInner: "#FFB5BA", eyeColor: "#5BA08C", irisColor: "#2D6B5A",
    blush: "#FFB5BA", whiskerColor: "#D4937A",
    extra: "tabby",
  },
  k2: {
    body: "#C8D8EA", bodyStroke: "#98B4CC",
    earInner: "#C4A8D0", eyeColor: "#78A8C8", irisColor: "#4878A0",
    blush: "#C4A8D0", whiskerColor: "#90A8BC",
    extra: "none", sleepy: true,
  },
  k3: {
    body: "#FFE4EF", bodyStroke: "#F0A8C0",
    earInner: "#FFB5D0", eyeColor: "#F472B6", irisColor: "#BE185D",
    blush: "#FFADD4", whiskerColor: "#DDA0B8",
    extra: "hat",
  },
  k4: {
    body: "#4A4A60", bodyStroke: "#2A2A40",
    earInner: "#6A5A80", eyeColor: "#A78BFA", irisColor: "#7C3AED",
    blush: "#5A4A70", whiskerColor: "#7A7A90",
    extra: "mask", dark: true,
  },
  k5: {
    body: "#3D1A6E", bodyStroke: "#6D30A0",
    earInner: "#C084FC", eyeColor: "#F472B6", irisColor: "#BE185D",
    blush: "#9D60DC", whiskerColor: "#8A60C0",
    extra: "galaxy",
  },
};

// ── Main SVG Kitty ──────────────────────────────────────────────────────────
function KittySVG({ id, px }: { id: string; px: number }) {
  const d = KITTY_DATA[id] || KITTY_DATA.k1;
  const W = px; const H = px;

  // All coordinates are in a 200×230 unit space — we scale with viewBox
  return (
    <svg
      viewBox="0 0 200 230"
      width={W}
      height={H}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* ── Defs ── */}
      <defs>
        {id === "k5" && (
          <radialGradient id="gxBg" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#6D30A0" />
            <stop offset="100%" stopColor="#1A0A38" />
          </radialGradient>
        )}
      </defs>

      {/* ── Tail (behind body) ── */}
      <path
        d="M 148 206 Q 195 195 188 160 Q 182 135 162 140"
        fill="none"
        stroke={d.bodyStroke}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M 148 206 Q 195 195 188 160 Q 182 135 162 140"
        fill="none"
        stroke={d.body}
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* ── Ears ── */}
      {/* Left outer ear */}
      <polygon
        points="48,92 66,35 92,84"
        fill={d.body}
        stroke={d.bodyStroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right outer ear */}
      <polygon
        points="152,92 134,35 108,84"
        fill={d.body}
        stroke={d.bodyStroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Left inner ear */}
      <polygon points="56,86 70,50 88,80" fill={d.earInner} opacity="0.85" />
      {/* Right inner ear */}
      <polygon points="144,86 130,50 112,80" fill={d.earInner} opacity="0.85" />

      {/* ── Head ── */}
      <circle
        cx="100" cy="118"
        r="78"
        fill={id === "k5" ? "url(#gxBg)" : d.body}
        stroke={d.bodyStroke}
        strokeWidth="2.5"
      />

      {/* ── Chef hat ── */}
      {d.extra === "hat" && (
        <>
          <rect x="68" y="50" width="64" height="16" rx="4" fill="white" stroke="#DDD" strokeWidth="1.5" />
          <ellipse cx="100" cy="50" rx="36" ry="22" fill="white" stroke="#DDD" strokeWidth="1.5" />
          <ellipse cx="100" cy="50" rx="36" ry="22" fill="white" />
          <rect x="68" y="50" width="64" height="8" rx="2" fill="#FFF0F5" />
        </>
      )}

      {/* ── Tabby forehead stripes ── */}
      {d.extra === "tabby" && (
        <>
          <path d="M 88 62 Q 100 52 112 62" stroke={d.bodyStroke} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M 85 73 Q 100 61 115 73" stroke={d.bodyStroke} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M 86 83 Q 100 73 114 83" stroke={d.bodyStroke} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        </>
      )}

      {/* ── Galaxy forehead stars ── */}
      {d.extra === "galaxy" && (
        <>
          {[
            [100, 62, 10, "#F0D0FF"],
            [80,  75,  7, "#DDA0FF"],
            [120, 75,  7, "#DDA0FF"],
          ].map(([cx, cy, r, fill], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={fill as string} opacity="0.7" />
          ))}
          {/* sparkle dots */}
          {[
            [85, 88, 3], [100, 78, 2.5], [115, 88, 3],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#F0E0FF" opacity="0.9" />
          ))}
        </>
      )}

      {/* ── Ninja mask ── */}
      {d.extra === "mask" && (
        <rect x="50" y="108" width="100" height="34" rx="10" fill="#18182A" opacity="0.9" />
      )}

      {/* ── EYES ── */}
      {d.sleepy ? (
        /* Sleepy half-closed eyes */
        <>
          {/* Left eye */}
          <ellipse cx="74" cy="114" rx="17" ry="12" fill="white" />
          <ellipse cx="74" cy="118" rx="17" ry="7" fill={d.body} />
          <ellipse cx="74" cy="115" rx="10" ry="8" fill={d.eyeColor} />
          <ellipse cx="74" cy="115" rx="6"  ry="7" fill="#1A1A2A" />
          <circle  cx="79" cy="111" r="3"   fill="white" opacity="0.9" />
          {/* Droopy eyelid line */}
          <path d="M 57 108 Q 74 100 91 108" fill={d.body} stroke={d.bodyStroke} strokeWidth="1" />
          {/* Zzz */}
          <text x="32" y="96" fontSize="12" fill={d.eyeColor} opacity="0.7" fontWeight="bold">z</text>
          <text x="22" y="84" fontSize="9"  fill={d.eyeColor} opacity="0.5" fontWeight="bold">z</text>

          {/* Right eye */}
          <ellipse cx="126" cy="114" rx="17" ry="12" fill="white" />
          <ellipse cx="126" cy="118" rx="17" ry="7"  fill={d.body} />
          <ellipse cx="126" cy="115" rx="10" ry="8"  fill={d.eyeColor} />
          <ellipse cx="126" cy="115" rx="6"  ry="7"  fill="#1A1A2A" />
          <circle  cx="131" cy="111" r="3"   fill="white" opacity="0.9" />
          <path d="M 109 108 Q 126 100 143 108" fill={d.body} stroke={d.bodyStroke} strokeWidth="1" />
        </>
      ) : (
        /* Big sparkly eyes */
        <>
          {/* Left eye white */}
          <ellipse cx="74" cy="114" rx="18" ry="18" fill="white" />
          {/* Left iris */}
          <ellipse cx="74" cy="116" rx="13" ry="14" fill={d.eyeColor} />
          {/* Left pupil */}
          <ellipse cx="74" cy="117" rx="7.5" ry="10" fill="#0A0A1A" />
          {/* Left sparkles */}
          <circle cx="81" cy="109" r="4"   fill="white" opacity="0.95" />
          <circle cx="69" cy="121" r="2"   fill="white" opacity="0.6" />
          {id === "k5" && <circle cx="72" cy="109" r="2.5" fill="#F0D0FF" opacity="0.8" />}

          {/* Right eye white */}
          <ellipse cx="126" cy="114" rx="18" ry="18" fill="white" />
          {/* Right iris */}
          <ellipse cx="126" cy="116" rx="13" ry="14" fill={d.eyeColor} />
          {/* Right pupil */}
          <ellipse cx="126" cy="117" rx="7.5" ry="10" fill="#0A0A1A" />
          {/* Right sparkles */}
          <circle cx="133" cy="109" r="4"   fill="white" opacity="0.95" />
          <circle cx="121" cy="121" r="2"   fill="white" opacity="0.6" />
          {id === "k5" && <circle cx="124" cy="109" r="2.5" fill="#F0D0FF" opacity="0.8" />}
        </>
      )}

      {/* ── Nose ── */}
      <ellipse cx="100" cy="140" rx="6.5" ry="5" fill="#FF9AAA" />

      {/* ── Mouth ── */}
      <path
        d="M 100 145 Q 89 155 84 151"
        stroke={d.dark ? "#9A8AAA" : "#CC8899"}
        strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <path
        d="M 100 145 Q 111 155 116 151"
        stroke={d.dark ? "#9A8AAA" : "#CC8899"}
        strokeWidth="2" fill="none" strokeLinecap="round"
      />

      {/* ── Blush ── */}
      <ellipse cx="55"  cy="137" rx="15" ry="9" fill={d.blush} opacity={d.dark ? 0.25 : 0.45} />
      <ellipse cx="145" cy="137" rx="15" ry="9" fill={d.blush} opacity={d.dark ? 0.25 : 0.45} />

      {/* ── Whiskers left ── */}
      {[
        [16, 131, 58, 135],
        [14, 140, 57, 140],
        [16, 149, 58, 145],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={d.whiskerColor} strokeWidth="1.5" opacity="0.65" strokeLinecap="round"
        />
      ))}

      {/* ── Whiskers right ── */}
      {[
        [184, 131, 142, 135],
        [186, 140, 143, 140],
        [184, 149, 142, 145],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={d.whiskerColor} strokeWidth="1.5" opacity="0.65" strokeLinecap="round"
        />
      ))}

      {/* ── Paws ── */}
      {/* Left paw */}
      <ellipse cx="68"  cy="206" rx="26" ry="16" fill={d.body} stroke={d.bodyStroke} strokeWidth="2" />
      <ellipse cx="52"  cy="201" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />
      <ellipse cx="68"  cy="198" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />
      <ellipse cx="84"  cy="201" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />

      {/* Right paw */}
      <ellipse cx="132" cy="206" rx="26" ry="16" fill={d.body} stroke={d.bodyStroke} strokeWidth="2" />
      <ellipse cx="116" cy="201" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />
      <ellipse cx="132" cy="198" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />
      <ellipse cx="148" cy="201" rx="8"  ry="6"  fill={d.body} stroke={d.bodyStroke} strokeWidth="1.5" />

      {/* ── Galaxy body sparkles ── */}
      {d.extra === "galaxy" && [
        [62,  150, 3, 0.6],
        [140, 145, 2, 0.8],
        [108, 168, 3, 0.5],
        [78,  175, 2, 0.7],
      ].map(([cx, cy, r, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#DDA0FF" opacity={op} />
      ))}
    </svg>
  );
}

// ── Public component ────────────────────────────────────────────────────────
export function KittyAvatar({ id, isUnlocked, size = "md", className = "" }: KittyAvatarProps) {
  const PX: Record<string, number> = { sm: 48, md: 80, lg: 128, xl: 192 };
  const px = PX[size] ?? 80;

  if (!isUnlocked) {
    return (
      <div
        className={`rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/20 ${className}`}
        style={{ width: px, height: px }}
      >
        <Lock size={px < 50 ? 14 : 22} className="text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={className}
      style={{ width: px, height: px, display: "inline-block" }}
    >
      <KittySVG id={id} px={px} />
    </motion.div>
  );
}
