import { Link } from "wouter";
import { motion } from "framer-motion";
import bgImage from "@assets/download_1771679972933.png";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/30 via-background/60 to-background dark:from-primary/10 dark:via-background/80 dark:to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-sm font-semibold text-primary mb-4 shadow-sm border border-white/20">
            Welcome to your cozy space
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-2 drop-shadow-sm font-display tracking-tight">
            Mochi Mode <span className="text-4xl">🐾</span>
          </h1>
          <p className="text-lg text-muted-foreground/90 font-medium">
            Focus, collect kitties, and feel good.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <Link href="/dashboard" className="w-full block">
            <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all duration-200 btn-bounce">
              Start Journey
            </button>
          </Link>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Your personal productivity companion
          </p>
        </motion.div>
      </div>
    </div>
  );
}
