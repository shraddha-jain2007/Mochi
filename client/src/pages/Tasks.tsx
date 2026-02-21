import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, RefreshCw, CheckCircle2, FastForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMochi } from "@/hooks/use-mochi";
import confetti from "canvas-confetti";

const FUN_TASKS = [
  "Drink a glass of water 💧",
  "Stretch your arms up high 🙆",
  "Look out the window for 20s 👀",
  "Tidy up one small surface 🧹",
  "Write down 3 things you're grateful for 📝",
  "Do 5 jumping jacks 🏃",
  "Text a friend just to say hi 📱",
  "Draw a tiny doodle 🎨",
  "Listen to your favorite song 🎵",
  "Take 3 deep breaths 🧘",
  "Organize your workspace for 5 mins 🧹",
  "Read 2 pages of a book 📖",
  "Clean your phone screen 📱",
  "Eat a healthy snack 🍎",
];

export default function Tasks() {
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { addSession } = useMochi();

  const spinTask = () => {
    setIsSpinning(true);
    setCurrentTask(null);
    
    setTimeout(() => {
      const random = FUN_TASKS[Math.floor(Math.random() * FUN_TASKS.length)];
      setCurrentTask(random);
      setIsSpinning(false);
    }, 800);
  };

  const handleDone = () => {
    if (!currentTask) return;
    
    addSession({
      purpose: `Task: ${currentTask}`,
      minutes: 5, // Task completions give fixed 5 XP (minutes)
      date: new Date().toISOString(),
      type: 'task'
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A7F3D0', '#34D399', '#10B981']
    });

    setCurrentTask(null);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto flex flex-col font-display">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft />
          </button>
        </Link>
        <h2 className="text-3xl font-black">I'm Bored...</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentTask ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              className="bg-card w-full p-8 rounded-[3rem] shadow-2xl artsy-border border-primary text-center space-y-8"
            >
              <div className="text-5xl animate-bounce">✨</div>
              <h3 className="text-3xl font-black text-foreground leading-tight">
                {currentTask}
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={handleDone}
                  className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-black text-xl flex items-center justify-center gap-2 btn-bounce"
                >
                  <CheckCircle2 size={24} /> Done!
                </button>
                
                <button 
                  onClick={spinTask}
                  className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-black text-lg flex items-center justify-center gap-2 btn-bounce"
                >
                  <FastForward size={20} /> Skip
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-48 h-48 bg-secondary/30 rounded-[3rem] flex items-center justify-center mx-auto mb-8 relative border-4 border-dashed border-secondary">
                <span className="text-7xl animate-float">🎲</span>
                {isSpinning && (
                  <div className="absolute inset-0 border-8 border-primary rounded-[3rem] border-t-transparent animate-spin" />
                )}
              </div>
              <h3 className="text-2xl font-black mb-4">Let's find something fun!</h3>
              <p className="text-muted-foreground mb-8 font-medium">
                Mochi has plenty of ideas for small ways to feel good today.
              </p>
              
              <button
                onClick={spinTask}
                disabled={isSpinning}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black text-2xl shadow-lg shadow-primary/30 btn-bounce disabled:opacity-50"
              >
                {isSpinning ? "Mochi is thinking..." : "Give me a task!"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
