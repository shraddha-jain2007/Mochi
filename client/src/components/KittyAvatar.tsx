import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import catImg from "@assets/mochi_cat_sticker.png";

interface KittyAvatarProps {
  id: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Each kitty variant: CSS filter + a soft glow colour behind the sticker
const KITTY_STYLES: Record<string, {
  filter: string;
  glow: string;
  label: string;
}> = {
  k1: {
    filter: "saturate(1.15) brightness(1.06)",
    glow: "rgba(251,146,60,0.25)",
    label: "Original Mochi",
  },
  k2: {
    filter: "hue-rotate(185deg) saturate(0.85) brightness(0.96)",
    glow: "rgba(96,165,250,0.25)",
    label: "Sleepy Mochi",
  },
  k3: {
    filter: "hue-rotate(300deg) saturate(1.7) brightness(1.06)",
    glow: "rgba(244,114,182,0.3)",
    label: "Chef Mochi",
  },
  k4: {
    filter: "grayscale(1) contrast(1.3) brightness(0.75)",
    glow: "rgba(100,116,139,0.2)",
    label: "Ninja Mochi",
  },
  k5: {
    filter: "hue-rotate(245deg) saturate(2.1) brightness(0.8)",
    glow: "rgba(167,139,250,0.3)",
    label: "Galaxy Mochi",
  },
};

// Base pixel widths — height is taller (4:5 portrait) so the full cat shows
const SIZES: Record<string, { w: number; h: number }> = {
  sm:  { w: 44,  h: 54  },
  md:  { w: 72,  h: 88  },
  lg:  { w: 116, h: 142 },
  xl:  { w: 172, h: 210 },
};

export function KittyAvatar({ id, isUnlocked, size = "md", className = "" }: KittyAvatarProps) {
  const { w, h } = SIZES[size] ?? SIZES.md;
  const kit = KITTY_STYLES[id] ?? KITTY_STYLES.k1;

  if (!isUnlocked) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-muted/50 ${className}`}
        style={{ width: w, height: h }}
      >
        <Lock size={w < 50 ? 14 : 22} className="text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.93 }}
      className={`relative flex items-end justify-center select-none ${className}`}
      style={{ width: w, height: h }}
    >
      {/* Soft glow blob behind the cat */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-xl pointer-events-none"
        style={{
          width: w * 0.9,
          height: h * 0.35,
          background: kit.glow,
        }}
      />

      {/* The cat — no clip, full portrait, sticker style */}
      <img
        src={catImg}
        alt={kit.label}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center bottom",
          filter: `${kit.filter} drop-shadow(0 6px 14px rgba(0,0,0,0.18))`,
        }}
      />
    </motion.div>
  );
}
