import { Link } from "wouter";
import { motion } from "framer-motion";
import { Moon, Sun, Trophy, Flame, ChevronRight, Info, CheckSquare, Activity, BarChart3, Users, Cat, History } from "lucide-react";
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

const QUICK_ACTIONS = [
  { href: '/pomodoro', emoji: '⏱️', label: 'Focus', sub: 'Start Timer', color: 'from-pink-400 to-rose-400', shadow: 'shadow-rose-200 dark:shadow-rose-900/30' },
  { href: '/tasks',   emoji: '🎲', label: 'Tasks', sub: 'Randomize', color: 'from-violet-400 to-purple-400', shadow: 'shadow-violet-200 dark:shadow-violet-900/30' },
];

const SECONDARY_ACTIONS = [
  { href: '/todo', icon: CheckSquare, label: 'To-Do', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { href: '/habits', icon: Activity, label: 'Habits', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { href: '/analytics', icon: BarChart3, label: 'Stats', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { href: '/friends', icon: Users, label: 'Friends', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { href: '/collection', icon: Cat, label: 'Kitties', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { href: '/history', icon: History, label: 'History', color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/40' },
];

export default function Dashboard() {
  const { xp, streak, unlockedKitties, isDarkMode, toggleTheme, todos, habits } = useMochi();
  const mainKitty = unlockedKitties[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDoneToday = habits.filter(h => h.completions.includes(todayStr)).length;
  const todosLeft = todos.filter(t => !t.done).length;

  return (
    <div className="min-h-screen pb-32 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black font-display text-foreground leading-tight">Hi, Mochi! 🐾</h2>
          <p className="text-muted-foreground font-medium text-sm">Let's have a cozy day.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-card shadow-sm border border-border hover:bg-muted transition-colors btn-bounce"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
        </button>
      </div>

      {/* Hero Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/80 to-rose-400 rounded-[2.5rem] p-6 mb-6 shadow-2xl shadow-primary/20"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="relative">
            <KittyAvatar id={mainKitty.id} isUnlocked={true} size="lg" className="border-4 border-white/40" />
            <div className="absolute -bottom-1 -right-1 text-xl">✨</div>
          </div>
          <div className="flex-1 text-primary-foreground">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <Trophy size={14} />
              <span className="text-xs font-black uppercase tracking-widest">Level {Math.floor(xp / 100) + 1}</span>
            </div>
            <h3 className="text-4xl font-black font-display">
              <AnimatedCounter value={xp} /> XP
            </h3>

            {/* XP Progress bar to next level */}
            <div className="h-1.5 bg-white/20 rounded-full mt-2 mb-3 overflow-hidden w-full">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${(xp % 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                <Flame size={14} fill="currentColor" />
                <span className="text-sm font-black">{streak}d</span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">
                    <Info size={12} /> How to grow?
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center">Grow Your Streak 🐾</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 font-medium text-center">
                    <div className="bg-primary/10 p-4 rounded-3xl space-y-1">
                      <p className="text-primary font-black">Focus daily</p>
                      <p className="text-sm">Complete at least one focus session every day to keep the flame alive.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-3xl space-y-1">
                      <p className="text-secondary-foreground font-black">Earn XP</p>
                      <p className="text-sm">Every minute focused gives 1 XP. Tasks give 5 XP. Habits give 2 XP!</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Miss a day and the streak resets. You can do it! 🌸</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's snapshot */}
      {(habits.length > 0 || todos.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Link href="/habits">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200/60 dark:border-blue-700/30 p-4 rounded-[2rem] flex items-center gap-3">
              <Activity className="text-blue-500" size={22} />
              <div>
                <p className="font-black text-blue-700 dark:text-blue-300">{habitsDoneToday}/{habits.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">Habits Today</p>
              </div>
            </div>
          </Link>
          <Link href="/todo">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200/60 dark:border-emerald-700/30 p-4 rounded-[2rem] flex items-center gap-3">
              <CheckSquare className="text-emerald-500" size={22} />
              <div>
                <p className="font-black text-emerald-700 dark:text-emerald-300">{todosLeft}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Tasks Left</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Primary Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {QUICK_ACTIONS.map((action, i) => (
          <Link key={action.href} href={action.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? -1 : 1 }}
              whileTap={{ scale: 0.96 }}
              className={`bg-gradient-to-br ${action.color} p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer h-44 shadow-xl ${action.shadow}`}
            >
              <span className="text-5xl">{action.emoji}</span>
              <div className="text-center text-white">
                <h3 className="font-black text-xl leading-none">{action.label}</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-0.5">{action.sub}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SECONDARY_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileTap={{ scale: 0.93 }}
                className={`${action.bg} border-2 border-transparent p-4 rounded-[2rem] flex flex-col items-center gap-2 cursor-pointer hover:border-current transition-all`}
              >
                <Icon size={24} className={action.color} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${action.color}`}>{action.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Kitty Friends Teaser */}
      <div className="bg-card border-2 border-dashed border-muted-foreground/20 p-5 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg flex items-center gap-2">
            My Friends <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unlockedKitties.length}</span>
          </h3>
          <Link href="/collection" className="text-primary text-sm font-black flex items-center gap-0.5 hover:gap-1.5 transition-all">
            All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
          {unlockedKitties.map((kitty, i) => (
            <div key={kitty.id} className="flex flex-col items-center gap-1.5 min-w-[60px] animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <KittyAvatar id={kitty.id} isUnlocked={true} size="sm" />
              <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center opacity-50">{kitty.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
