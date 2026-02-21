import { Link } from "wouter";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Trophy, Flame, ChevronRight } from "lucide-react";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function Dashboard() {
  const { xp, streak, unlockedKitties, isDarkMode, toggleTheme } = useMochi();
  
  // Use first unlocked kitty as main avatar
  const mainKitty = unlockedKitties[0];

  const requestNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Mochi Mode 🐾", {
            body: "Notifications enabled! We'll remind you to take breaks.",
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto">
      {/* Header with Toggles */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display">Hello, Friend!</h2>
          <p className="text-muted-foreground text-sm">Ready to focus today?</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-card shadow-sm border border-border hover:bg-muted transition-colors"
          >
            {isDarkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-indigo-400" />}
          </button>
          <button 
            onClick={requestNotification}
            className="p-3 rounded-full bg-card shadow-sm border border-border hover:bg-muted transition-colors"
          >
            <Bell size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Main Stats Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 shadow-xl shadow-black/5 border border-border mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full -ml-8 -mb-8 blur-xl" />

        <div className="flex items-center gap-6 relative z-10">
          <KittyAvatar id={mainKitty.id} isUnlocked={true} size="lg" />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-accent" />
              <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Level {Math.floor(xp / 100) + 1}</span>
            </div>
            <h3 className="text-3xl font-black font-display text-foreground mb-1">
              <AnimatedCounter value={xp} /> XP
            </h3>
            <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 w-fit px-3 py-1 rounded-full text-xs">
              <Flame size={14} fill="currentColor" />
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/pomodoro">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary/10 dark:bg-primary/20 p-5 rounded-3xl border-2 border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer h-40"
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground">Focus</h3>
              <p className="text-xs text-muted-foreground">Start Session</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/tasks">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-secondary p-5 rounded-3xl border-2 border-secondary/50 flex flex-col items-center justify-center gap-3 cursor-pointer h-40"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-secondary-foreground shadow-sm">
              <span className="text-2xl">🎲</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-secondary-foreground">Tasks</h3>
              <p className="text-xs text-secondary-foreground/70">I'm bored</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Collection Teaser */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">My Collection</h3>
          <Link href="/collection" className="text-primary text-sm font-semibold flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {unlockedKitties.slice(0, 4).map((kitty) => (
            <div key={kitty.id} className="flex flex-col items-center gap-2 min-w-[80px]">
              <KittyAvatar id={kitty.id} isUnlocked={true} size="sm" />
              <span className="text-xs font-medium truncate w-full text-center">{kitty.name}</span>
            </div>
          ))}
          <Link href="/collection">
            <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="text-xl">+</span>
              </div>
              <span className="text-xs font-medium">More</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
