import { Link } from "wouter";
import { motion } from "framer-motion";
import bgImage from "@assets/download_1771679972933.png";

const floaties = [
  { emoji: '🌸', top: '7%',  left: '5%',  delay: 0,    size: 'text-4xl' },
  { emoji: '💖', top: '13%', right: '7%', delay: 0.9,  size: 'text-3xl' },
  { emoji: '✨', top: '30%', left: '3%',  delay: 1.5,  size: 'text-2xl' },
  { emoji: '🌷', top: '67%', right: '4%', delay: 0.5,  size: 'text-3xl' },
  { emoji: '🎀', top: '80%', left: '7%',  delay: 1.1,  size: 'text-4xl' },
  { emoji: '⭐', top: '53%', right: '2%', delay: 1.9,  size: 'text-2xl' },
  { emoji: '🍡', top: '45%', left: '2%',  delay: 2.3,  size: 'text-xl'  },
  { emoji: '🌙', top: '22%', right: '3%', delay: 0.3,  size: 'text-2xl' },
];

export default function Home() {
  const isOnboarded = !!localStorage.getItem('mochi-onboarded');
  const destination = isOnboarded ? '/dashboard' : '/onboarding';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Soft pastel overlay — gives an artsy watercolour wash */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(160deg, rgba(253,220,240,0.55) 0%, rgba(235,210,255,0.45) 50%, rgba(210,240,255,0.35) 100%)',
      }} />
      {/* Bottom fade into page background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />

      {/* Floating decorations */}
      {floaties.map((f, i) => (
        <div
          key={i}
          className={`absolute z-10 ${f.size} animate-float pointer-events-none select-none`}
          style={{ top: f.top, left: (f as any).left, right: (f as any).right, animationDelay: `${f.delay}s`, filter: 'drop-shadow(0 2px 8px rgba(244,114,182,0.3))' }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Decorative circle blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)' }} />

      {/* Content card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8 w-full"
        >
          {/* Artsy sticker frame */}
          <div className="relative">
            {/* Decorative stars */}
            {['⭐','✨','🌟'].map((s, i) => (
              <div key={i} className="absolute animate-twinkle text-lg pointer-events-none"
                style={{
                  top: i === 0 ? '-14px' : i === 1 ? '-10px' : '-6px',
                  left: i === 0 ? '-10px' : undefined,
                  right: i === 1 ? '-10px' : i === 2 ? '20%' : undefined,
                  animationDelay: `${i * 0.6}s`,
                }}>
                {s}
              </div>
            ))}

            <div className="bg-white/60 dark:bg-black/30 backdrop-blur-xl p-8 rounded-[3rem] border-2 shadow-2xl"
              style={{
                borderColor: 'rgba(244,114,182,0.3)',
                boxShadow: '0 24px 60px rgba(244,114,182,0.2), 0 0 0 1px rgba(255,255,255,0.5) inset',
              }}>
              {/* Shimmer top bar */}
              <div className="absolute top-0 left-8 right-8 h-px animate-shimmer rounded-full" />

              <div className="text-4xl mb-3 animate-wiggle inline-block">🐾</div>
              <h1 className="text-7xl font-black text-foreground mb-0.5 leading-none tracking-tighter"
                style={{ fontFamily: 'Fredoka, sans-serif', textShadow: '0 2px 12px rgba(244,114,182,0.2)' }}>
                Mochi
              </h1>
              <h1 className="text-7xl font-black leading-none tracking-tighter mb-5"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(244,114,182,0.3))',
                }}>
                Mode
              </h1>
              <p className="text-sm text-foreground/70 font-semibold leading-snug">
                your cozy little world to<br />
                <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.25rem', color: 'hsl(340 80% 55%)' }}>
                  focus, grow & collect joy ✨
                </span>
              </p>

              {/* Decorative pastel pills */}
              <div className="flex gap-2 justify-center mt-4 flex-wrap">
                {['🍡 cozy', '⏱️ focus', '🐱 fun'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-black text-pink-500 bg-pink-50 border border-pink-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA button — sits ABOVE the nav (which is hidden on this page anyway) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="w-full space-y-4"
        >
          <Link href={destination} className="w-full block">
            <button
              className="w-full py-5 rounded-[2rem] font-black text-2xl text-white transition-all duration-150 btn-bounce animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, #f472b6, #c084fc)',
                boxShadow: '0 6px 0 0 #be185d, 0 12px 24px rgba(244,114,182,0.4)',
              }}
              data-testid="button-start"
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
