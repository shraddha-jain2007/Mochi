import { Link } from "wouter";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Trophy, Flame, ChevronRight, Info } from "lucide-react";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { xp, streak, unlockedKitties, isDarkMode, toggleTheme } = useMochi();
  
  const mainKitty = unlockedKitties[0];

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black font-display text-foreground">Hi Mochi! 🐾</h2>
          <p className="text-muted-foreground font-medium">Let's have a peaceful day.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="p-4 rounded-3xl bg-card shadow-sm border border-border hover:bg-muted transition-colors btn-bounce"
          >
            {isDarkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Main Stats Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 border-4 border-primary/20 mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        
        <div className="flex flex-col items-center gap-6 relative z-10 text-center">
          <div className="relative">
            <KittyAvatar id={mainKitty.id} isUnlocked={true} size="lg" />
            <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">✨</div>
          </div>
          
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={18} className="text-accent" />
              <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Lvl {Math.floor(xp / 100) + 1}</span>
            </div>
            <h3 className="text-5xl font-black font-display text-foreground mb-4">
              <AnimatedCounter value={xp} /> XP
            </h3>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-orange-500 font-black bg-orange-100 dark:bg-orange-900/40 px-6 py-2 rounded-full shadow-sm">
                <Flame size={20} fill="currentColor" />
                <span className="text-lg">{streak} Day Streak</span>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-bold mt-2">
                    <Info size={12} /> How to grow?
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center">Streak Guide 🐾</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 font-medium text-center">
                    <p>Want to grow your streak? It's simple!</p>
                    <div className="bg-primary/10 p-4 rounded-3xl space-y-2">
                      <p className="text-primary font-bold">1. Focus daily</p>
                      <p className="text-sm">Complete at least one focus session every day to keep the flame alive.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-3xl space-y-2">
                      <p className="text-secondary-foreground font-bold">2. XP Milestones</p>
                      <p className="text-sm">Every minute focused gives you 1 XP. Level up to unlock new kitties!</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Don't miss a day, or Mochi will miss you and the streak will reset! 🌸</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/pomodoro">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-primary p-6 rounded-[2rem] border-4 border-white/20 flex flex-col items-center justify-center gap-4 cursor-pointer h-48 shadow-lg shadow-primary/20"
          >
            <div className="text-4xl">⏱️</div>
            <div className="text-center">
              <h3 className="font-black text-xl text-primary-foreground">Focus</h3>
              <p className="text-xs text-primary-foreground/80 font-bold uppercase tracking-widest">Start Time</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/tasks">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-secondary p-6 rounded-[2rem] border-4 border-white/20 flex flex-col items-center justify-center gap-4 cursor-pointer h-48 shadow-lg shadow-secondary/20"
          >
            <div className="text-4xl">🎲</div>
            <div className="text-center">
              <h3 className="font-black text-xl text-secondary-foreground">Tasks</h3>
              <p className="text-xs text-secondary-foreground/70 font-bold uppercase tracking-widest">Randomize</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Collection Teaser */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl flex items-center gap-2">Friends <span className="text-sm px-2 py-0.5 bg-muted rounded-full">{unlockedKitties.length}</span></h3>
          <Link href="/collection" className="text-primary text-sm font-black flex items-center gap-1 hover:gap-2 transition-all">
            See All <ChevronRight size={18} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {unlockedKitties.map((kitty) => (
            <div key={kitty.id} className="flex flex-col items-center gap-2 min-w-[70px] animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
              <KittyAvatar id={kitty.id} isUnlocked={true} size="sm" />
              <span className="text-[10px] font-black uppercase tracking-tighter truncate w-full text-center opacity-60">{kitty.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
