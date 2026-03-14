import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";

const DAILY_GOALS = [
  { mins: 30,  label: '30 min',  sub: 'Light study',     emoji: '🌱' },
  { mins: 60,  label: '1 hour',  sub: 'Steady pace',     emoji: '📖' },
  { mins: 90,  label: '1.5 hrs', sub: 'Deep focus',      emoji: '🔥' },
  { mins: 120, label: '2 hours', sub: 'Power session',   emoji: '⚡' },
  { mins: 180, label: '3 hours', sub: 'Research mode',   emoji: '🧪' },
];

const SUBJECTS = [
  '🤖 Machine Learning', '📊 Statistics', '🐍 Python',
  '📈 Data Analysis',    '🧮 Mathematics', '💡 Deep Learning',
  '🗄️ SQL',              '📝 Research',    '📚 Reading',
];

const KITTIES = [
  { id: 'k1', name: 'Original Mochi', desc: 'Starter buddy',    locked: false },
  { id: 'k2', name: 'Sleepy Mochi',   desc: 'Unlock at 50 XP',  locked: true },
  { id: 'k3', name: 'Chef Mochi',     desc: 'Unlock at 150 XP', locked: true },
  { id: 'k4', name: 'Ninja Mochi',    desc: 'Unlock at 300 XP', locked: true },
  { id: 'k5', name: 'Galaxy Mochi',   desc: 'Unlock at 500 XP', locked: true },
];

const STEPS = ['Welcome', 'Daily Goal', 'Your Buddy', 'Subjects'];

export default function Onboarding() {
  const [, navigate]    = useLocation();
  const { setUsername, setDailyGoal, setBuddy } = useMochi();
  const [step,       setStep]       = useState(0);
  const [name,       setName]       = useState('');
  const [goalMins,   setGoalMins]   = useState(60);
  const [buddy,      setBuddyLocal] = useState('k1');
  const [subjects,   setSubjects]   = useState<string[]>([]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const finish = () => {
    setUsername(name.trim() || 'Mochi');
    setDailyGoal(goalMins);
    setBuddy(buddy);
    localStorage.setItem('mochi-onboarded', '1');
    navigate('/dashboard');
  };

  const toggleSubject = (s: string) =>
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const slideVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 max-w-sm mx-auto"
      style={{ background: 'linear-gradient(160deg, #fff0f6, #f5f0ff, #f0f7ff)' }}
    >
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                i === step ? 'w-8' : i < step ? 'w-4' : 'w-4'
              }`}
              style={{
                background: i <= step
                  ? 'linear-gradient(135deg, #f472b6, #c084fc)'
                  : '#e9d5ff',
              }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 0: Welcome + Name ── */}
        {step === 0 && (
          <motion.div
            key="step0"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-float2">🐾</div>
              <h1 className="text-4xl font-black text-zinc-800 mb-2" style={{ fontFamily: 'Fredoka' }}>
                Welcome to<br />
                <span style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Mochi Mode!
                </span>
              </h1>
              <p className="text-sm font-semibold text-zinc-500 leading-relaxed">
                Your cozy corner for focused study,<br />habit tracking & data-driven growth.
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-pink-100 shadow-xl p-6 mb-6">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                What should we call you?
              </label>
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && nextStep()}
                placeholder="Your name or nickname..."
                className="w-full text-2xl font-black bg-transparent border-b-2 border-pink-200 focus:border-pink-400 outline-none py-2 placeholder:text-zinc-300 text-zinc-800"
                style={{ fontFamily: 'Fredoka' }}
              />
            </div>

            <button
              onClick={nextStep}
              disabled={!name.trim()}
              className="w-full py-4 rounded-[2rem] text-white font-black text-xl btn-bounce disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 6px 0 0 #be185d' }}
            >
              Let's go! ✨
            </button>
          </motion.div>
        )}

        {/* ── Step 1: Daily Goal ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-3 animate-float">🎯</div>
              <h2 className="text-3xl font-black text-zinc-800 mb-1" style={{ fontFamily: 'Fredoka' }}>Daily Study Goal</h2>
              <p className="text-sm font-semibold text-zinc-500">How long do you want to focus each day?</p>
            </div>

            <div className="space-y-3 mb-6">
              {DAILY_GOALS.map(g => (
                <button
                  key={g.mins}
                  onClick={() => setGoalMins(g.mins)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[2rem] border-2 transition-all btn-bounce text-left ${
                    goalMins === g.mins
                      ? 'border-pink-400 bg-pink-50 shadow-lg shadow-pink-100'
                      : 'border-zinc-100 bg-white hover:border-pink-200'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1">
                    <p className={`font-black text-base ${goalMins === g.mins ? 'text-pink-500' : 'text-zinc-700'}`}
                      style={{ fontFamily: 'Fredoka' }}>
                      {g.label}
                    </p>
                    <p className="text-xs font-semibold text-zinc-400">{g.sub}</p>
                  </div>
                  {goalMins === g.mins && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep}
                className="p-4 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-500 btn-bounce">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextStep}
                className="flex-1 py-4 rounded-[2rem] text-white font-black text-lg btn-bounce flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 5px 0 0 #be185d' }}>
                Next <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Pick Buddy ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-3 animate-float2">🐱</div>
              <h2 className="text-3xl font-black text-zinc-800 mb-1" style={{ fontFamily: 'Fredoka' }}>Pick Your Buddy</h2>
              <p className="text-sm font-semibold text-zinc-500">
                Mochi will cheer you on during focus sessions!<br />
                <span className="text-pink-400 font-bold">Unlock more kitties as you earn XP ✨</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {KITTIES.map(k => (
                <button
                  key={k.id}
                  onClick={() => !k.locked && setBuddyLocal(k.id)}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-[2rem] border-2 transition-all ${
                    k.locked
                      ? 'border-zinc-100 bg-zinc-50 opacity-50 cursor-not-allowed'
                      : buddy === k.id
                        ? 'border-pink-400 bg-pink-50 shadow-lg shadow-pink-100 scale-105'
                        : 'border-zinc-100 bg-white hover:border-pink-200 btn-bounce'
                  }`}
                >
                  {k.locked && (
                    <div className="absolute inset-0 rounded-[2rem] flex items-center justify-center bg-white/60 z-10">
                      <span className="text-xl">🔒</span>
                    </div>
                  )}
                  <KittyAvatar id={k.id} isUnlocked={!k.locked} size="sm" />
                  <div className="text-center">
                    <p className="text-[11px] font-black text-zinc-600 leading-tight">{k.name.split(' ')[0]}</p>
                    <p className="text-[9px] font-bold text-zinc-400">{k.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep}
                className="p-4 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-500 btn-bounce">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextStep}
                className="flex-1 py-4 rounded-[2rem] text-white font-black text-lg btn-bounce flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 5px 0 0 #be185d' }}>
                Next <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Subjects ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-3 animate-float">📚</div>
              <h2 className="text-3xl font-black text-zinc-800 mb-1" style={{ fontFamily: 'Fredoka' }}>What do you study?</h2>
              <p className="text-sm font-semibold text-zinc-500">
                Pick your topics — we'll personalise your analytics!
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`px-4 py-2 rounded-2xl text-sm font-black transition-all btn-bounce border-2 ${
                    subjects.includes(s)
                      ? 'text-white border-transparent shadow-md'
                      : 'bg-white text-zinc-500 border-zinc-100 hover:border-pink-200'
                  }`}
                  style={subjects.includes(s) ? { background: 'linear-gradient(135deg, #f472b6, #c084fc)' } : {}}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="bg-pink-50 border-2 border-pink-100 rounded-[2rem] p-4 mb-6 text-center">
              <p className="text-xs font-bold text-zinc-500">
                Hi, <span className="text-pink-500 font-black">{name}</span>! Your daily goal is{' '}
                <span className="text-purple-500 font-black">{goalMins} minutes</span>.
                Let's start your journey! 🌸
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep}
                className="p-4 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-500 btn-bounce">
                <ChevronLeft size={20} />
              </button>
              <button onClick={finish}
                className="flex-1 py-4 rounded-[2rem] text-white font-black text-lg btn-bounce flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 6px 0 0 #be185d, 0 10px 30px rgba(244,114,182,0.3)' }}>
                <Sparkles size={20} /> Enter Mochi Mode!
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
