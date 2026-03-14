import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";
import { useAmbientSound, SoundType } from "@/hooks/useAmbientSound";

const SOUNDS: { type: SoundType; emoji: string; label: string }[] = [
  { type: 'rain',       emoji: '🌧️', label: 'Rain'    },
  { type: 'ocean',      emoji: '🌊', label: 'Ocean'   },
  { type: 'cafe',       emoji: '☕', label: 'Café'    },
  { type: 'whitenoise', emoji: '📻', label: 'Focus'   },
];

const SUBJECTS = [
  { label: 'Machine Learning', emoji: '🤖', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' },
  { label: 'Statistics',       emoji: '📊', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
  { label: 'Python',           emoji: '🐍', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  { label: 'Data Analysis',    emoji: '📈', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
  { label: 'Mathematics',      emoji: '🧮', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' },
  { label: 'Deep Learning',    emoji: '💡', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600' },
  { label: 'SQL / Databases',  emoji: '🗄️', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600' },
  { label: 'Research',         emoji: '📝', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
  { label: 'Reading',          emoji: '📚', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
  { label: 'Other',            emoji: '✨', color: 'bg-muted text-muted-foreground' },
];

export default function Pomodoro() {
  const [, setLocation] = useLocation();
  const { addSession, unlockedKitties, buddyId } = useMochi();
  const { playing: soundPlaying, soundType, toggle: toggleSound, stop: stopSound, volume, setVolume } = useAmbientSound();
  const [minutes, setMinutes]       = useState(25);
  const [timeLeft, setTimeLeft]     = useState(25 * 60);
  const [isActive, setIsActive]     = useState(false);
  const [purpose, setPurpose]       = useState('');
  const [subject, setSubject]       = useState('');
  const [notes, setNotes]           = useState('');
  const [sessionState, setSessionState] = useState<'setup' | 'running' | 'completed'>('setup');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionState('completed');
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (!purpose.trim()) { alert('What are you focusing on? 🌸'); return; }
    setTimeLeft(minutes * 60);
    setIsActive(true);
    setSessionState('running');
  };

  const handleComplete = () => {
    // Session saved after notes submission
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6','#c084fc','#fb923c','#f9a8d4'] });
  };

  const handleSaveAndExit = () => {
    stopSound();
    addSession({ purpose, minutes, date: new Date().toISOString(), type: 'pomodoro', subject: subject || undefined, notes: notes.trim() || undefined });
    setLocation('/dashboard');
  };

  const handleReset = () => {
    stopSound();
    setIsActive(false);
    setSessionState('setup');
    setTimeLeft(minutes * 60);
    setPurpose('');
    setSubject('');
    setNotes('');
  };

  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;

  const progress  = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;
  const companion = unlockedKitties.find(k => k.id === buddyId) || unlockedKitties[0];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-32 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-200/50 shadow-sm backdrop-blur-sm btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <h2 className="font-black text-xl" style={{ fontFamily: 'Fredoka' }}>Focus Session ⏱️</h2>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Setup ─────────────────────────────────────────── */}
        {sessionState === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full space-y-5">
            {/* Purpose input */}
            <div className="bg-white/60 dark:bg-white/5 border-2 border-pink-200/50 rounded-[2.5rem] p-6 shadow-sm backdrop-blur-sm">
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">What are you focusing on?</label>
              <input
                type="text" value={purpose} onChange={e => setPurpose(e.target.value)}
                placeholder="e.g. Study for ML midterm..."
                className="w-full text-xl font-bold bg-transparent border-b-2 border-pink-200 focus:border-primary outline-none py-2 placeholder:text-muted-foreground/30 text-foreground"
              />
            </div>

            {/* Subject picker */}
            <div className="bg-white/60 dark:bg-white/5 border-2 border-pink-200/50 rounded-[2.5rem] p-6 shadow-sm backdrop-blur-sm">
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Subject / Topic</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                  <button key={s.label} onClick={() => setSubject(subject === s.label ? '' : s.label)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all btn-bounce flex items-center gap-1 ${
                      subject === s.label
                        ? s.color + ' ring-2 ring-current ring-offset-1 scale-105'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    }`}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration picker */}
            <div className="bg-white/60 dark:bg-white/5 border-2 border-pink-200/50 rounded-[2.5rem] p-6 shadow-sm backdrop-blur-sm">
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 45, 60].map(m => (
                  <button key={m} onClick={() => setMinutes(m)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all btn-bounce ${
                      minutes === m ? 'text-white shadow-md' : 'bg-muted text-muted-foreground'
                    }`}
                    style={minutes === m ? { background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 4px 0 0 #be185d' } : {}}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStart}
              className="w-full py-5 rounded-[2rem] text-white font-black text-2xl btn-bounce"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 8px 0 0 #be185d, 0 12px 24px rgba(244,114,182,0.3)' }}>
              Start Focus 🌸
            </button>
          </motion.div>
        )}

        {/* ── Running ───────────────────────────────────────── */}
        {sessionState === 'running' && (
          <motion.div key="running" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center gap-3 mb-8">
              <KittyAvatar id={companion.id} isUnlocked size="xl" />
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-muted-foreground animate-pulse">{companion.name} is focusing with you!</p>
              </div>
              {subject && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary">
                  {SUBJECTS.find(s => s.label === subject)?.emoji} {subject}
                </span>
              )}
            </div>

            {/* Circular timer */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 absolute">
                <circle cx="128" cy="128" r="116" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
                <circle cx="128" cy="128" r="116"
                  stroke="url(#timerGrad)" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 116}
                  strokeDashoffset={2 * Math.PI * 116 * (1 - progress / 100)}
                  strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center justify-center z-10">
                <span className="text-5xl font-black font-mono tracking-tighter text-foreground">{formatTime(timeLeft)}</span>
                <span className="text-sm font-semibold text-muted-foreground mt-1 max-w-[140px] truncate text-center">{purpose}</span>
                <span className="text-xs font-black text-primary mt-1">{Math.round(progress)}% done</span>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button onClick={() => setIsActive(!isActive)}
                className="p-5 rounded-full text-white shadow-xl btn-bounce"
                style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
                {isActive ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </button>
              <button onClick={handleReset}
                className="p-5 rounded-full bg-muted text-muted-foreground shadow-md btn-bounce hover:bg-destructive/10 hover:text-destructive transition-colors">
                <Square size={22} fill="currentColor" />
              </button>
            </div>

            {/* ── Ambient Sound Panel ── */}
            <div className="w-full bg-white/60 backdrop-blur-sm border-2 border-pink-100 rounded-[2.5rem] p-5">
              <div className="flex items-center gap-2 mb-4">
                {soundPlaying ? <Volume2 size={16} className="text-pink-500" /> : <VolumeX size={16} className="text-zinc-400" />}
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Ambient Sound</span>
                {soundPlaying && (
                  <span className="ml-auto text-[10px] font-black text-pink-500 animate-pulse">
                    ♪ playing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {SOUNDS.map(s => (
                  <button
                    key={s.type}
                    onClick={() => toggleSound(s.type)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all btn-bounce ${
                      soundPlaying && soundType === s.type
                        ? 'border-pink-400 bg-pink-50 shadow-md shadow-pink-100'
                        : 'border-zinc-100 bg-white hover:border-pink-200'
                    }`}
                  >
                    <span className="text-lg leading-none">{s.emoji}</span>
                    <span className={`text-[10px] font-black ${soundPlaying && soundType === s.type ? 'text-pink-500' : 'text-zinc-500'}`}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>

              {soundPlaying && (
                <div className="flex items-center gap-3">
                  <VolumeX size={12} className="text-zinc-400 shrink-0" />
                  <input
                    type="range" min={0} max={1} step={0.05}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full accent-pink-500"
                  />
                  <Volume2 size={12} className="text-zinc-400 shrink-0" />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Completed ─────────────────────────────────────── */}
        {sessionState === 'completed' && (
          <motion.div key="completed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center w-full">
            <div className="text-7xl mb-4 animate-float2">🎉</div>
            <h2 className="text-3xl font-black mb-1 text-foreground" style={{ fontFamily: 'Fredoka' }}>Session Complete!</h2>
            <p className="text-muted-foreground font-semibold mb-2">
              You focused for <span className="text-primary font-black">{minutes} min</span> and earned <span className="text-primary font-black">{minutes} XP</span>
            </p>
            {subject && <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary mb-6">{SUBJECTS.find(s => s.label === subject)?.emoji} {subject}</span>}

            {/* Session notes */}
            <div className="w-full bg-white/60 dark:bg-white/5 border-2 border-pink-200/50 rounded-[2.5rem] p-5 mb-6 backdrop-blur-sm text-left">
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Session Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What did you learn? Any breakthroughs? 📖"
                rows={3}
                className="w-full text-sm font-semibold bg-transparent outline-none resize-none placeholder:text-muted-foreground/40 text-foreground"
              />
            </div>

            <button onClick={handleSaveAndExit}
              className="w-full py-5 rounded-[2rem] text-white font-black text-xl btn-bounce"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 8px 0 0 #be185d' }}>
              Save & Go Home 🐾
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
