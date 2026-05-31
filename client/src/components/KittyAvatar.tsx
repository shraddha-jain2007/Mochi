import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import catImg from "@assets/Siberian_Cat_Clipart__Majestic_and_Strong_Cat_Illustrations_1774537144655.jfif";

interface KittyAvatarProps {
  id: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const KITTY_STYLES: Record<string, {
  filter: string;
  bg: string;
  ring: string;
  label: string;
}> = {
  k1: {
    filter: "saturate(1.1) brightness(1.05)",
    bg: "bg-orange-50",
    ring: "ring-orange-200",
    label: "Original Mochi",
  },
  k2: {
    filter: "hue-rotate(185deg) saturate(0.8) brightness(0.95)",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    label: "Sleepy Mochi",
  },
  k3: {
    filter: "hue-rotate(300deg) saturate(1.6) brightness(1.05)",
    bg: "bg-pink-50",
    ring: "ring-pink-200",
    label: "Chef Mochi",
  },
  k4: {
    filter: "grayscale(1) contrast(1.25) brightness(0.72)",
    bg: "bg-slate-100",
    ring: "ring-slate-300",
    label: "Ninja Mochi",
  },
  k5: {
    filter: "hue-rotate(245deg) saturate(2) brightness(0.78)",
    bg: "bg-violet-50",
    ring: "ring-violet-300",
    label: "Galaxy Mochi",
  },
};

const PX: Record<string, number> = { sm: 48, md: 80, lg: 128, xl: 192 };

export function KittyAvatar({ id, isUnlocked, size = "md", className = "" }: KittyAvatarProps) {
  const px  = PX[size] ?? 80;
  const kit = KITTY_STYLES[id] ?? KITTY_STYLES.k1;

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
      className={`rounded-full overflow-hidden flex items-center justify-center border-2 shadow-sm ring-2 ${kit.bg} ${kit.ring} ${className}`}
      style={{ width: px, height: px, borderColor: "rgba(255,255,255,0.6)" }}
    >
      <img
        src={catImg}
        alt={kit.label}
        className="w-full h-full object-cover object-center"
        style={{ filter: kit.filter }}
        draggable={false}
      />
    </motion.div>
  );
}
