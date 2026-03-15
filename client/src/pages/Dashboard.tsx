import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Moon, Sun, Trophy, Flame, ChevronRight, Info, CheckSquare, Activity, BarChart3, Users, Cat, History, Download, X } from "lucide-react";
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
  {
    href: '/pomodoro', emoji: '⏱️', label: 'Focus', sub: 'Start Timer',
    gradient: 'linear-gradient(135deg, #f472b6, #fb7185)',
    shadow: '0 8px 0 0 #be185d, 0 12px 24px rgba(244,114,182,0.3)',
  },
  {
    href: '/tasks', emoji: '🎲', label: 'Tasks', sub: 'Randomize',
    gradient: 'linear-gradient(135deg, #c084fc, #a78bfa)',
    shadow: '0 8px 0 0 #7c3aed, 0 12px 24px rgba(192,132,252,0.3)',
  },
];

const SECONDARY_ACTIONS = [
  { href: '/todo',       icon: CheckSquare, label: 'To-Do',   bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500', ring: 'hover:ring-emerald-200' },
  { href: '/habits',     icon: Activity,    label: 'Habits',  bg: 'bg-blue-50 dark:bg-blue-900/20',       color: 'text-blue-500',    ring: 'hover:ring-blue-200' },
  { href: '/analytics',  icon: BarChart3,   label: 'Stats',   bg: 'bg-amber-50 dark:bg-amber-900/20',     color: 'text-amber-500',   ring: 'hover:ring-amber-200' },
  { href: '/friends',    icon: Users,       label: 'Friends', bg: 'bg-pink-50 dark:bg-pink-900/20',       color: 'text-pink-500',    ring: 'hover:ring-pink-200' },
  { href: '/collection', icon: Cat,         label: 'Kitties', bg: 'bg-purple-50 dark:bg-purple-900/20',   color: 'text-purple-500',  ring: 'hover:ring-purple-200' },
  { href: '/history',    icon: History,     label: 'History', bg: 'bg-rose-50 dark:bg-rose-900/20',       color: 'text-rose-400',    ring: 'hover:ring-rose-200' },
  { href: '/dream-world',icon: Moon,        label: 'Dream 🌙',bg: 'bg-indigo-50 dark:bg-indigo-900/20',    color: 'text-indigo-500',  ring: 'hover:ring-indigo-200' },
];

export default function Dashboard() {
  const { xp, streak, unlockedKitties, isDarkMode, toggleTheme, todos, habits } = useMochi();
  const mainKitty = unlockedKitties[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDoneToday = habits.filter(h => h.completions.includes(todayStr)).length;
  const todosLeft = todos.filter(t => !t.done).length;
  const level = Math.floor(xp / 100) + 1;

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
  };

  return (
    <div className="min-h-screen pb-36 px-4 pt-6 max-w-md mx-auto">
      {/* PWA Install Banner */}
      {showInstall && (
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-white border-2 border-pink-200 rounded-[2rem] px-4 py-3 mb-4 shadow-md shadow-pink-100"
        >
          <span className="text-2xl shrink-0">📱</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-zinc-700 leading-tight">Add Mochi Mode to your home screen!</p>
            <p className="text-[10px] font-semibold text-zinc-400">Works offline, feels like a real app ✨</p>
          </div>
          <button onClick={handleInstall}
            className="px-3 py-1.5 rounded-xl text-white text-xs font-black shrink-0 btn-bounce"
            style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
            Install
          </button>
          <button onClick={() => setShowInstall(false)} className="p-1 text-zinc-300 hover:text-zinc-500 shrink-0">
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-foreground leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Hi, Mochi!
            </h2>
            <span className="text-2xl animate-wiggle inline-block">🐾</span>
          </div>
          <p className="text-muted-foreground text-sm font-semibold">
            <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1rem' }}>let's have a cozy day ✨</span>
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 shadow-sm border border-pink-100 dark:border-white/10 hover:bg-pink-50 transition-colors btn-bounce backdrop-blur-sm"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
        </button>
      </div>

      {/* Hero XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-6 mb-5 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #f472b6)',
          boxShadow: '0 20px 40px rgba(244,114,182,0.25)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 blur-xl" />
        <div className="absolute top-4 right-8 text-2xl animate-sparkle">✨</div>
        <div className="absolute bottom-6 right-16 text-xl animate-sparkle" style={{ animationDelay: '1s' }}>⭐</div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="rounded-[1.5rem] border-4 border-white/50 overflow-hidden shadow-xl">
              <KittyAvatar id={mainKitty.id} isUnlocked={true} size="lg" />
            </div>
            <div className="absolute -bottom-1 -right-1 text-xl animate-heartbeat">💖</div>
          </div>

          <div className="flex-1 text-white min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 opacity-90">
              <Trophy size={13} />
              <span className="text-[11px] font-black uppercase tracking-widest">Level {level}</span>
            </div>
            <h3 className="text-4xl font-black leading-none mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <AnimatedCounter value={xp} /> XP
            </h3>
            {/* XP bar */}
            <div className="h-2 bg-white/25 rounded-full overflow-hidden mb-3 w-full">
              <motion.div
                className="h-full bg-white/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xp % 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <Flame size={14} className="text-orange-200" fill="currentColor" />
                <span className="text-sm font-black">{streak} day streak</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Info size={11} /> tips
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-2 border-pink-100">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center" style={{ fontFamily: 'Fredoka' }}>
                      Streak Tips 🌸
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-4 text-center font-semibold">
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-3xl">
                      <p className="font-black text-pink-500">🌸 Focus every day</p>
                      <p className="text-sm text-muted-foreground mt-1">Complete at least one Pomodoro to keep the streak alive!</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-3xl">
                      <p className="font-black text-purple-500">✨ Earn XP</p>
                      <p className="text-sm text-muted-foreground mt-1">1 XP/min focus · 5 XP task · 2 XP habit · Level up every 100!</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Miss a day and the flame goes out 🔥 Don't let Mochi down!</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today snapshot */}
      {(habits.length > 0 || todos.length > 0) && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Link href="/habits">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 dark:bg-blue-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 p-4 rounded-[2rem] flex items-center gap-3 shadow-sm backdrop-blur-sm"
            >
              <div className="text-2xl animate-float">🌊</div>
              <div>
                <p className="font-black text-blue-600 dark:text-blue-300 text-lg">{habitsDoneToday}/{habits.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/80">habits today</p>
              </div>
            </motion.div>
          </Link>
          <Link href="/todo">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 dark:bg-emerald-900/20 border-2 border-emerald-200/50 dark:border-emerald-700/30 p-4 rounded-[2rem] flex items-center gap-3 shadow-sm backdrop-blur-sm"
            >
              <div className="text-2xl animate-float" style={{ animationDelay: '0.5s' }}>📝</div>
              <div>
                <p className="font-black text-emerald-600 dark:text-emerald-300 text-lg">{todosLeft}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">tasks left</p>
              </div>
            </motion.div>
          </Link>
        </div>
      )}

      {/* Main action cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {QUICK_ACTIONS.map((a, i) => (
          <Link key={a.href} href={a.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -1 : 1 }}
              whileTap={{ scale: 0.93 }}
              className="h-44 rounded-[2.5rem] p-5 flex flex-col items-center justify-center gap-3 cursor-pointer relative overflow-hidden"
              style={{ background: a.gradient, boxShadow: a.shadow }}
            >
              <div className="absolute top-3 right-4 text-white/20 text-6xl font-black select-none" style={{ fontFamily: 'Fredoka' }}>
                {a.emoji}
              </div>
              <span className="text-5xl relative z-10 animate-float2" style={{ animationDelay: `${i * 0.4}s` }}>{a.emoji}</span>
              <div className="text-center text-white relative z-10">
                <h3 className="font-black text-xl leading-none" style={{ fontFamily: 'Fredoka' }}>{a.label}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 mt-0.5">{a.sub}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Secondary grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {SECONDARY_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                whileTap={{ scale: 0.9 }}
                className={`${a.bg} border-2 border-transparent hover:ring-2 ${a.ring} p-4 rounded-[2rem] flex flex-col items-center gap-2 cursor-pointer transition-all backdrop-blur-sm`}
              >
                <Icon size={22} className={a.color} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${a.color}`}>{a.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Kitty friends strip */}
      <div className="bg-white/50 dark:bg-white/5 border-2 border-dashed border-pink-200/60 dark:border-pink-800/30 p-5 rounded-[2.5rem] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg" style={{ fontFamily: 'Fredoka' }}>
            My Kitties <span className="text-sm font-black bg-pink-100 dark:bg-pink-900/30 text-pink-400 px-2 py-0.5 rounded-full ml-1">{unlockedKitties.length}</span>
          </h3>
          <Link href="/collection" className="text-primary text-sm font-black flex items-center gap-0.5 hover:gap-2 transition-all">
            See all <ChevronRight size={15} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
          {unlockedKitties.map((kitty, i) => (
            <div key={kitty.id} className="flex flex-col items-center gap-1.5 min-w-[60px] animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <KittyAvatar id={kitty.id} isUnlocked={true} size="sm" />
              <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center text-muted-foreground">{kitty.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
