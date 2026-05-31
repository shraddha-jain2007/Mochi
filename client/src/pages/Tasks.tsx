import { useState, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, CheckCircle2, FastForward, Shuffle, Clock, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMochi } from "@/hooks/use-mochi";
import confetti from "canvas-confetti";

const ALL_TASKS = [
  // 💧 Body & Movement
  { text: "Drink a full glass of water 💧",                category: "Body" },
  { text: "Stretch your arms above your head for 30s 🙆",  category: "Body" },
  { text: "Do 10 shoulder rolls — each direction 🔄",      category: "Body" },
  { text: "Stand up and walk around for 2 mins 🚶",        category: "Body" },
  { text: "Do 5 jumping jacks 🏃",                         category: "Body" },
  { text: "Touch your toes and hold for 10s 🦵",           category: "Body" },
  { text: "Roll your neck slowly side to side 🧖",         category: "Body" },
  { text: "Squeeze your eyes shut, then open wide — 5x 👀",category: "Body" },
  { text: "Do 10 wrist circles each hand ✋",              category: "Body" },
  { text: "Eat a healthy snack 🍎",                        category: "Body" },
  { text: "Make yourself a warm drink ☕",                  category: "Body" },
  { text: "Splash cold water on your face 💦",             category: "Body" },
  { text: "Take 5 deep belly breaths 🧘",                  category: "Body" },
  { text: "Do a 1-min wall sit 🦵",                        category: "Body" },
  { text: "Massage your temples for 30s 🤲",               category: "Body" },
  // 🧹 Space & Tidy
  { text: "Tidy up one small surface on your desk 🧹",     category: "Space" },
  { text: "Throw away 3 pieces of trash near you 🗑️",     category: "Space" },
  { text: "Wipe your keyboard and mouse clean 🖥️",         category: "Space" },
  { text: "Clean your phone screen 📱",                     category: "Space" },
  { text: "Put away 5 things that are out of place 📦",    category: "Space" },
  { text: "Organize your desktop icons or downloads folder 🗂️", category: "Space" },
  { text: "Make your bed (or fluff your pillows!) 🛏️",    category: "Space" },
  { text: "Open a window for some fresh air 🪟",           category: "Space" },
  { text: "Clear your inbox to zero (even just skim) 📧",  category: "Space" },
  { text: "Light a candle or tidy your study corner 🕯️",  category: "Space" },
  // 🌸 Mindfulness & Mood
  { text: "Write down 3 things you're grateful for 📝",   category: "Mind" },
  { text: "Look out the window and just breathe for 20s 🌿", category: "Mind" },
  { text: "Draw a tiny doodle — anything! 🎨",             category: "Mind" },
  { text: "Write one sentence about how you feel right now 💭", category: "Mind" },
  { text: "Close your eyes and listen to the sounds around you 👂", category: "Mind" },
  { text: "Think of one person you appreciate and why 💖", category: "Mind" },
  { text: "Write tomorrow's top 3 priorities ✅",          category: "Mind" },
  { text: "Say one kind thing to yourself out loud 🗣️",   category: "Mind" },
  { text: "Do a 2-min body scan — notice any tension 🧘",  category: "Mind" },
  { text: "Visualise your ideal productive day for 1 min 🌅", category: "Mind" },
  { text: "Write down one thing you're looking forward to 🌟", category: "Mind" },
  { text: "Brain-dump every thought on paper — 2 mins 🧠", category: "Mind" },
  // 🤝 Social & Connection
  { text: "Text a friend just to say hi 📱",               category: "Social" },
  { text: "Send a meme to someone who'd love it 😂",       category: "Social" },
  { text: "Leave a kind comment on someone's post 💬",     category: "Social" },
  { text: "Reply to a message you've been putting off 📩", category: "Social" },
  { text: "Text someone you haven't spoken to in a while 👋", category: "Social" },
  { text: "Write a short thank-you note to someone 🙏",    category: "Social" },
  // 🎓 Study & Learning
  { text: "Read 2 pages of a book 📖",                     category: "Learn" },
  { text: "Watch a 5-min YouTube tutorial on anything 🎥", category: "Learn" },
  { text: "Review your notes from today or this week 📋",  category: "Learn" },
  { text: "Look up one word you didn't know 🔍",           category: "Learn" },
  { text: "Write a 3-sentence summary of what you learned today 📝", category: "Learn" },
  { text: "Read one Wikipedia article on a topic you're curious about 🌐", category: "Learn" },
  { text: "Teach a concept you learned to an imaginary student 🏫", category: "Learn" },
  { text: "Solve one practice problem in your weakest subject 🧮", category: "Learn" },
  { text: "Write down 3 questions you still have about your topic ❓", category: "Learn" },
  { text: "Make a flashcard for one thing you keep forgetting 🃏",  category: "Learn" },
  // ✨ Fun & Creative
  { text: "Listen to your favorite song — really listen 🎵",category: "Fun" },
  { text: "Try writing with your non-dominant hand for 1 min ✍️", category: "Fun" },
  { text: "Come up with a fun username you'd use for a new app 😄", category: "Fun" },
  { text: "Imagine you had a superpower — what is it? ⚡",  category: "Fun" },
  { text: "Describe your current vibe in exactly 3 words 💅", category: "Fun" },
  { text: "Pick a random Wikipedia page and read the intro 🌐", category: "Fun" },
  { text: "Write a 2-line poem about your day 🌸",          category: "Fun" },
  { text: "Invent a new ice cream flavour 🍦",              category: "Fun" },
  { text: "List 5 things in this room that are the same color 🎨", category: "Fun" },
  { text: "Hum your favourite song for 30 seconds 🎶",      category: "Fun" },
];

const CATEGORY_COLORS: Record<string, { chip: string; dot: string }> = {
  Body:   { chip: 'bg-rose-100 text-rose-600',     dot: 'bg-rose-400' },
  Space:  { chip: 'bg-amber-100 text-amber-600',   dot: 'bg-amber-400' },
  Mind:   { chip: 'bg-violet-100 text-violet-600', dot: 'bg-violet-400' },
  Social: { chip: 'bg-blue-100 text-blue-600',     dot: 'bg-blue-400' },
  Learn:  { chip: 'bg-emerald-100 text-emerald-600',dot: 'bg-emerald-400' },
  Fun:    { chip: 'bg-pink-100 text-pink-600',     dot: 'bg-pink-400' },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type TaskItem = typeof ALL_TASKS[0];

export default function Tasks() {
  const { addSession } = useMochi();

  const queueRef     = useRef<TaskItem[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [isSpinning,  setIsSpinning]  = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Array<TaskItem & { skipped: boolean; time: string }>>([]);

  const nextFromQueue = () => {
    if (queueRef.current.length === 0) queueRef.current = shuffle(ALL_TASKS);
    return queueRef.current.pop()!;
  };

  const spinTask = () => {
    setIsSpinning(true);
    setCurrentTask(null);
    setTimeout(() => {
      setCurrentTask(nextFromQueue());
      setIsSpinning(false);
    }, 700);
  };

  const handleSkip = () => {
    if (currentTask) {
      setSessionHistory(h => [{ ...currentTask, skipped: true, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }, ...h].slice(0, 8));
    }
    spinTask();
  };

  const handleDone = () => {
    if (!currentTask) return;
    addSession({
      purpose: `Task: ${currentTask.text}`,
      minutes: 5,
      date: new Date().toISOString(),
      type: 'task',
    });
    setSessionHistory(h => [
      { ...currentTask, skipped: false, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) },
      ...h,
    ].slice(0, 8));
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 }, colors: ['#f472b6','#c084fc','#fb923c','#a7f3d0'] });
    setCurrentTask(null);
  };

  const doneCount = sessionHistory.filter(h => !h.skipped).length;

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 border border-pink-100 shadow-sm btn-bounce backdrop-blur-sm" data-testid="button-back">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-zinc-800 leading-tight" style={{ fontFamily: 'Fredoka' }}>
            I'm Bored... 🎲
          </h2>
          <p className="text-xs font-bold text-zinc-400">{ALL_TASKS.length} unique tasks · no repeats</p>
        </div>
        {doneCount > 0 && (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-bounce-in">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="text-xs font-black text-emerald-600">{doneCount} done</span>
          </div>
        )}
      </div>

      {/* Randomizer */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentTask ? (
            <motion.div
              key={currentTask.text}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-full bg-white rounded-[3rem] border-2 border-pink-100 shadow-2xl shadow-pink-100/40 p-8 text-center space-y-6"
            >
              <div className="text-5xl animate-float2">✨</div>

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${CATEGORY_COLORS[currentTask.category]?.chip}`}>
                {currentTask.category}
              </span>

              <h3 className="text-2xl font-black text-zinc-800 leading-snug" style={{ fontFamily: 'Fredoka' }}>
                {currentTask.text}
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleDone}
                  data-testid="button-task-done"
                  className="w-full py-4 rounded-[2rem] text-white font-black text-xl flex items-center justify-center gap-2 btn-bounce"
                  style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', boxShadow: '0 6px 0 0 #059669' }}
                >
                  <CheckCircle2 size={22} /> Done! +5 XP
                </button>

                <button
                  onClick={handleSkip}
                  data-testid="button-task-skip"
                  className="w-full py-3 rounded-[2rem] bg-zinc-100 text-zinc-500 font-black text-base flex items-center justify-center gap-2 btn-bounce hover:bg-zinc-200 transition-colors"
                >
                  <FastForward size={18} /> Skip this one
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full"
            >
              <div className="w-48 h-48 mx-auto mb-8 rounded-[3rem] border-4 border-dashed border-pink-200 bg-pink-50/50 flex items-center justify-center relative">
                <span className="text-7xl animate-float">🎲</span>
                {isSpinning && (
                  <div className="absolute inset-0 border-8 border-pink-400 rounded-[3rem] border-t-transparent animate-spin" />
                )}
              </div>

              <h3 className="text-2xl font-black text-zinc-800 mb-2" style={{ fontFamily: 'Fredoka' }}>
                {doneCount === 0 ? "Let's find something fun!" : `${doneCount} done so far 🌸`}
              </h3>
              <p className="text-sm font-semibold text-zinc-400 mb-8">
                {doneCount === 0
                  ? `Mochi has ${ALL_TASKS.length} unique ideas — no repeats!`
                  : "Ready for the next one? Keep going! 🐾"}
              </p>

              <button
                onClick={spinTask}
                disabled={isSpinning}
                data-testid="button-spin-task"
                className="w-full py-5 rounded-[2rem] text-white font-black text-2xl btn-bounce disabled:opacity-50 flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 8px 0 0 #be185d, 0 12px 24px rgba(244,114,182,0.3)' }}
              >
                <Shuffle size={24} />
                {isSpinning ? "Mochi is thinking..." : "Give me a task!"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session history strip */}
      <AnimatePresence>
        {sessionHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/70 border-2 border-pink-100 rounded-[2.5rem] p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={16} className="text-pink-400" />
              <h4 className="text-sm font-black text-zinc-700">This Session</h4>
            </div>
            <div className="space-y-2">
              {sessionHistory.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0 ${item.skipped ? 'opacity-40' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    item.skipped ? 'bg-zinc-100' : 'bg-emerald-100'
                  }`}>
                    {item.skipped
                      ? <FastForward size={10} className="text-zinc-400" />
                      : <CheckCircle2 size={10} className="text-emerald-500" />
                    }
                  </div>
                  <p className={`text-xs font-semibold flex-1 leading-snug truncate ${item.skipped ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>
                    {item.text}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]?.chip}`}>
                      {item.category}
                    </span>
                    {!item.skipped && (
                      <span className="text-[9px] font-black text-emerald-500 ml-1">+5xp</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
