import { motion } from "framer-motion";
import { Cat, Lock } from "lucide-react";
import kittyImg from "@assets/download_1772285128664.jfif";

interface KittyAvatarProps {
  id: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const KITTY_BGS: Record<string, string> = {
  k1: "bg-orange-100 dark:bg-orange-900/30",
  k2: "bg-blue-100 dark:bg-blue-900/30",
  k3: "bg-pink-100 dark:bg-pink-900/30",
  k4: "bg-slate-100 dark:bg-slate-800",
  k5: "bg-indigo-100 dark:bg-indigo-900/30",
};

export function KittyAvatar({ id, isUnlocked, size = "md", className = "" }: KittyAvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  if (!isUnlocked) {
    return (
      <div className={`rounded-full bg-muted flex items-center justify-center ${sizeClasses[size]} ${className} border-2 border-dashed border-muted-foreground/20`}>
        <Lock size={size === "sm" ? 16 : 24} className="text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-full overflow-hidden flex items-center justify-center shadow-inner border-2 border-white/50 dark:border-white/10 ${KITTY_BGS[id] || "bg-gray-100"} ${sizeClasses[size]} ${className}`}
    >
      <img 
        src={kittyImg} 
        alt="Mochi Kitty" 
        className="w-full h-full object-cover"
        style={{
          // For now using the same illustration but applying different filters/transforms
          // to distinguish the "types" until more specific assets are provided
          filter: id === 'k2' ? 'hue-rotate(180deg) brightness(0.9)' : 
                  id === 'k3' ? 'hue-rotate(300deg)' : 
                  id === 'k4' ? 'grayscale(1) contrast(1.2)' : 
                  id === 'k5' ? 'hue-rotate(240deg) saturate(1.5) brightness(0.8)' : 
                  'none'
        }}
      />
    </motion.div>
  );
}
