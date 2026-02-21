import { Link } from "wouter";
import { ChevronLeft, Coffee } from "lucide-react";
import { motion } from "framer-motion";

const COMFORT_MESSAGES = [
  "It's okay to take a break. You're doing great.",
  "Rest is productive too.",
  "Take a deep breath. In... and out.",
  "Have some water and stretch a little.",
  "Tomorrow is a fresh start.",
  "Be kind to yourself today."
];

export default function Tired() {
  const randomMessage = COMFORT_MESSAGES[Math.floor(Math.random() * COMFORT_MESSAGES.length)];

  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#1a1a1a] pb-24 px-4 pt-8 max-w-md mx-auto flex flex-col items-center text-center transition-colors duration-500">
      <div className="w-full flex justify-start mb-12">
        <Link href="/dashboard">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ChevronLeft />
          </button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex-1 flex flex-col items-center justify-center -mt-20"
      >
        <div className="relative mb-12">
          {/* Steam animation */}
          <motion.div 
            animate={{ y: [-5, -15, -5], opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl"
          >
            ♨️
          </motion.div>
          
          <div className="w-48 h-48 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center border-4 border-orange-200 dark:border-orange-800/30">
            <Coffee size={80} className="text-orange-400" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl font-serif text-amber-900 dark:text-amber-100 mb-6 italic">
          Shhh... it's rest time.
        </h2>

        <p className="text-lg text-amber-800/70 dark:text-amber-200/70 max-w-xs font-medium leading-relaxed">
          {randomMessage}
        </p>
      </motion.div>
    </div>
  );
}
