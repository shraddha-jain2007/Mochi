import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
];

export default function Tasks() {
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinTask = () => {
    setIsSpinning(true);
    setCurrentTask(null);
    
    setTimeout(() => {
      const random = FUN_TASKS[Math.floor(Math.random() * FUN_TASKS.length)];
      setCurrentTask(random);
      setIsSpinning(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft />
          </button>
        </Link>
        <h2 className="text-2xl font-bold">I'm Bored...</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentTask ? (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card w-full p-8 rounded-3xl shadow-xl border-2 border-primary/20 text-center"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 leading-relaxed">
                {currentTask}
              </h3>
              <button 
                onClick={spinTask}
                className="text-primary font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw size={16} /> Try another
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-40 h-40 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <span className="text-6xl animate-bounce">🎲</span>
                {isSpinning && (
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                )}
              </div>
              <p className="text-muted-foreground mb-8">
                Don't know what to do? Let Mochi pick a tiny task for you.
              </p>
              
              <button
                onClick={spinTask}
                disabled={isSpinning}
                className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 btn-bounce disabled:opacity-50"
              >
                {isSpinning ? "Picking..." : "Give me a task!"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
