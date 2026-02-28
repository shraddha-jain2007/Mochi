import { motion } from "framer-motion";
import { Cat } from "lucide-react";

interface KittyAvatarProps {
  id: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const KITTY_COLORS: Record<string, string> = {
  k1: "text-orange-400",  // Original
  k2: "text-blue-400",    // Sleepy
  k3: "text-pink-400",    // Chef
  k4: "text-slate-800 dark:text-slate-200", // Ninja
  k5: "text-indigo-400",  // Galaxy
};

const KITTY_BGS: Record<string, string> = {
  k1: "bg-orange-100 dark:bg-orange-900/30",
  k2: "bg-blue-100 dark:bg-blue-900/30",
  k3: "bg-pink-100 dark:bg-pink-900/30",
  k4: "bg-slate-100 dark:bg-slate-800",
  k5: "bg-indigo-100 dark:bg-indigo-900/30",
};

export function KittyAvatar({ id, isUnlocked, size = "md", className = "" }: KittyAvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-12 p-2",
    md: "w-20 h-20 p-4",
    lg: "w-32 h-32 p-6",
    xl: "w-48 h-48 p-8",
  };

  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 64,
    xl: 96,
  };

  if (!isUnlocked) {
    return (
      <div className={`rounded-full bg-muted flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <Cat size={iconSizes[size]} className="text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-full flex items-center justify-center shadow-inner ${KITTY_BGS[id] || "bg-gray-100"} ${sizeClasses[size]} ${className}`}
    >
      <Cat size={iconSizes[size]} className={KITTY_COLORS[id] || "text-gray-600"} />
    </motion.div>
  );
}
