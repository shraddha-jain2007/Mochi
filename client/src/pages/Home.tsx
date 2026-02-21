import { Link } from "wouter";
import { motion } from "framer-motion";
import bgImage from "@assets/download_1771679972933.png";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-display">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110 animate-pulse-slow"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-white/20 dark:bg-black/30 backdrop-blur-[2px]" />
      
      {/* Gradient Wash */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="relative mb-12"
        >
          {/* Decorative floating cats (visual only) */}
          <div className="absolute -top-12 -left-8 text-4xl animate-float opacity-80">🐱</div>
          <div className="absolute -bottom-8 -right-8 text-4xl animate-float opacity-80" style={{ animationDelay: '1s' }}>🐾</div>
          
          <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md p-8 rounded-[3rem] border-2 border-white/50 shadow-2xl">
            <h1 className="text-6xl md:text-7xl font-black text-foreground mb-4 drop-shadow-md tracking-tighter">
              Mochi<br/>Mode
            </h1>
            <p className="text-xl text-foreground/80 font-medium leading-tight">
              A cozy place to focus,<br/>grow, and collect friends.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full space-y-4"
        >
          <Link href="/dashboard" className="w-full block">
            <button className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black text-2xl shadow-[0_8px_0_0_#d15e81] active:shadow-none active:translate-y-2 transition-all duration-150 btn-bounce">
              Start Journey 🐾
            </button>
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-foreground/60 font-medium">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Ready for some quiet time?</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
