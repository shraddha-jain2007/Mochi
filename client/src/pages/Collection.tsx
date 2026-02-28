import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";
import { Link } from "wouter";
import { ChevronLeft, Lock, Check } from "lucide-react";
import { motion } from "framer-motion";

const ALL_KITTIES = [
  { id: 'k1', name: 'Original Mochi', description: 'The one who started it all.', requirement: 'Starter' },
  { id: 'k2', name: 'Sleepy Mochi', description: 'Expert napper. Unlocks at 50 XP.', requirement: '50 XP' },
  { id: 'k3', name: 'Chef Mochi', description: 'Makes the best biscuits. Unlocks at 150 XP.', requirement: '150 XP' },
  { id: 'k4', name: 'Ninja Mochi', description: 'Silent but fluffy. Unlocks at 300 XP.', requirement: '300 XP' },
  { id: 'k5', name: 'Galaxy Mochi', description: 'From a galaxy far, far away. Unlocks at 500 XP.', requirement: '500 XP' },
];

export default function Collection() {
  const { unlockedKitties, xp, buddyId, setBuddy } = useMochi();

  const isUnlocked = (id: string) => unlockedKitties.some(k => k.id === id);

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto font-display">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft />
          </button>
        </Link>
        <div>
          <h2 className="text-3xl font-black">Collection</h2>
          <p className="text-muted-foreground text-sm font-medium">{unlockedKitties.length}/{ALL_KITTIES.length} Friends</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ALL_KITTIES.map((kitty, index) => {
          const unlocked = isUnlocked(kitty.id);
          const isBuddy = buddyId === kitty.id;
          
          return (
            <motion.div
              key={kitty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-card rounded-[2.5rem] p-6 border-2 transition-all flex flex-col items-center text-center ${
                unlocked 
                  ? isBuddy ? 'border-primary shadow-xl shadow-primary/10' : 'border-border shadow-sm' 
                  : 'border-dashed border-muted-foreground/30 opacity-60'
              }`}
            >
              {isBuddy && (
                <div className="absolute top-4 right-4 text-primary bg-primary/10 p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
              {!unlocked && <Lock className="absolute top-4 right-4 text-muted-foreground/30" size={16} />}
              
              <div className="mb-4">
                <KittyAvatar id={kitty.id} isUnlocked={unlocked} size="md" />
              </div>
              
              <h3 className={`font-black text-lg leading-tight mb-1 ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {unlocked ? kitty.name : '???'}
              </h3>
              
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {unlocked ? kitty.requirement : `Locks at ${kitty.requirement}`}
              </p>

              {unlocked && !isBuddy && (
                <button 
                  onClick={() => setBuddy(kitty.id)}
                  className="mt-auto text-[10px] font-black uppercase tracking-widest bg-muted hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-full transition-all btn-bounce"
                >
                  Set Buddy
                </button>
              )}
              {isBuddy && (
                <span className="mt-auto text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                  Current
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 p-8 bg-primary/5 rounded-[3rem] border-2 border-primary/10 text-center">
        <h3 className="font-black text-2xl text-primary mb-2 tracking-tight">{xp} XP</h3>
        <p className="text-sm font-medium text-muted-foreground">
          Every minute of focus brings you closer to a new friend. Keep going! 🐾
        </p>
      </div>
    </div>
  );
}
