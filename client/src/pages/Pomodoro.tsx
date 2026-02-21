import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";

export default function Pomodoro() {
  const [, setLocation] = useLocation();
  const { addSession, unlockedKitties } = useMochi();
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [sessionState, setSessionState] = useState<"setup" | "running" | "completed">("setup");

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionState("completed");
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (!purpose.trim()) {
      alert("What is your goal for this session?");
      return;
    }
    setTimeLeft(minutes * 60);
    setIsActive(true);
    setSessionState("running");
  };

  const handleComplete = () => {
    addSession({
      purpose,
      minutes,
      date: new Date().toISOString()
    });
    
    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionState("setup");
    setTimeLeft(minutes * 60);
    setPurpose("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;

  // Use a random unlocked kitty to cheer you on
  const companionKitty = unlockedKitties[Math.floor(Math.random() * unlockedKitties.length)];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <Link href="/dashboard">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft />
          </button>
        </Link>
        <h2 className="text-lg font-bold">Focus Session</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <AnimatePresence mode="wait">
        {sessionState === "setup" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-6"
          >
            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                What are you focusing on?
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Reading, Coding, Study..."
                className="w-full text-xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 placeholder:text-muted-foreground/30"
              />
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
              <label className="block text-sm font-medium text-muted-foreground mb-4">
                Select Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 25, 50].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      minutes === m 
                        ? "bg-primary text-primary-foreground shadow-md scale-105" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 mt-4 btn-bounce"
            >
              Start Focus
            </button>
          </motion.div>
        )}

        {sessionState === "running" && (
          <motion.div 
            key="running"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center w-full"
          >
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              {/* Circular Progress SVG */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  className="text-primary transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black font-mono tracking-tighter text-foreground">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm font-medium text-muted-foreground mt-2 max-w-[140px] truncate text-center">
                  {purpose}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <KittyAvatar id={companionKitty.id} isUnlocked={true} size="md" />
              <p className="text-sm text-muted-foreground text-center animate-pulse">
                {companionKitty.name} is cheering for you!
              </p>
            </div>

            <div className="flex gap-4 mt-12">
              <button
                onClick={() => setIsActive(!isActive)}
                className="p-4 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:scale-105 transition-transform"
              >
                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
              </button>
              <button
                onClick={handleReset}
                className="p-4 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:scale-105 transition-transform"
              >
                <Square fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}

        {sessionState === "completed" && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-6xl">
              🎉
            </div>
            <h2 className="text-3xl font-black mb-2 text-foreground">Awesome!</h2>
            <p className="text-muted-foreground mb-8">
              You focused for {minutes} minutes and earned <span className="text-primary font-bold">{minutes} XP</span>.
            </p>
            
            <button
              onClick={() => setLocation("/dashboard")}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 btn-bounce"
            >
              Back Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
