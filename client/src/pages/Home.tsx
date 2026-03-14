import { Link } from "wouter";
import { motion } from "framer-motion";
import bgImage from "@assets/download_1771679972933.png";

const floaties = [
  { emoji: '🌸', top: '8%',  left: '6%',  delay: 0,   size: 'text-4xl' },
  { emoji: '💖', top: '14%', right: '8%', delay: 0.8, size: 'text-3xl' },
  { emoji: '✨', top: '32%', left: '4%',  delay: 1.4, size: 'text-2xl' },
  { emoji: '🌷', top: '68%', right: '5%', delay: 0.5, size: 'text-3xl' },
  { emoji: '🎀', top: '80%', left: '8%',  delay: 1,   size: 'text-4xl' },
  { emoji: '⭐', top: '55%', right: '3%', delay: 1.8, size: 'text-2xl' },
];

export default function Home() {
  const isOnboarded = !!localStorage.getItem('mochi-onboarded');
  const destination = isOnboarded ? '/dashboard' : '/onboarding';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-pink-100/25 dark:bg-black/30" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/30 to-background" />

      {/* Floating decorations */}
      {floaties.map((f, i) => (
        <div
          key={i}
          className={`absolute z-10 ${f.size} animate-float pointer-events-none select-none`}
          style={{ top: f.top, left: f.left, right: (f as any).right, animationDelay: `${f.delay}s` }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-10"
        >
          <div className="relative bg-white/55 dark:bg-black/25 backdrop-blur-lg p-8 rounded-[3rem] border-2 border-pink-200/60 shadow-2xl shadow-pink-200/40">
            <div className="absolute -top-3 -left-3 text-2xl animate-sparkle">⭐</div>
            <div className="absolute -top-3 -right-3 text-2xl animate-sparkle" style={{ animationDelay: '0.7s' }}>⭐</div>
            <div className="text-3xl mb-2 animate-wiggle">🐾</div>
            <h1 className="text-6xl font-black text-foreground mb-1 leading-none tracking-tighter"
              style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Mochi
            </h1>
            <h1 className="text-6xl font-black leading-none tracking-tighter mb-4"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                background: 'linear-gradient(135deg, #f472b6, #c084fc, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Mode
            </h1>
            <p className="text-base text-foreground/70 font-semibold leading-snug">
              your cozy little world to<br/>
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.2rem', color: 'hsl(340 80% 60%)' }}>
                focus, grow & collect joy ✨
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full space-y-3"
        >
          <Link href={destination} className="w-full block">
            <button
              className="w-full py-5 rounded-[2rem] font-black text-2xl text-white transition-all duration-150 btn-bounce"
              style={{
                background: 'linear-gradient(135deg, #f472b6, #c084fc)',
                boxShadow: '0 6px 0 0 #be185d, 0 10px 20px rgba(244,114,182,0.35)',
              }}
            >
              {isOnboarded ? 'Continue 🐾' : 'Start my journey 🌸'}
            </button>
          </Link>

          <div className="flex items-center justify-center gap-2 text-foreground/50 text-sm font-bold">
            <span className="animate-heartbeat text-pink-400">♥</span>
            <span>cute · cozy · focused</span>
            <span className="animate-heartbeat text-purple-400" style={{ animationDelay: '0.5s' }}>♥</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
