import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";
import { Link } from "wouter";
import { ChevronLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

const ALL_KITTIES = [
  { id: 'k1', name: 'Original Mochi', description: 'The one who started it all.' },
  { id: 'k2', name: 'Sleepy Mochi', description: 'Expert napper. Unlocks at 50 XP.' },
  { id: 'k3', name: 'Chef Mochi', description: 'Makes the best biscuits. Unlocks at 150 XP.' },
  { id: 'k4', name: 'Ninja Mochi', description: 'Silent but fluffy. Unlocks at 300 XP.' },
];

export default function Collection() {
  const { unlockedKitties, xp } = useMochi();

  const isUnlocked = (id: string) => unlockedKitties.some(k => k.id === id);

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Kitty Collection</h2>
          <p className="text-muted-foreground text-sm">{unlockedKitties.length}/{ALL_KITTIES.length} Collected</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ALL_KITTIES.map((kitty, index) => {
          const unlocked = isUnlocked(kitty.id);
          
          return (
            <motion.div
              key={kitty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-card rounded-3xl p-4 border ${unlocked ? 'border-border shadow-sm' : 'border-dashed border-border/60'} flex flex-col items-center text-center`}
            >
              <div className="mb-4 relative">
                <KittyAvatar id={kitty.id} isUnlocked={unlocked} size="md" />
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="text-muted-foreground/50" />
                  </div>
                )}
              </div>
              
              <h3 className={`font-bold mb-1 ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {unlocked ? kitty.name : '???'}
              </h3>
              
              <p className="text-xs text-muted-foreground leading-tight">
                {unlocked ? kitty.description : `Keep focusing to unlock!`}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-primary/10 rounded-3xl border border-primary/20 text-center">
        <h3 className="font-bold text-primary mb-2">Current XP: {xp}</h3>
        <p className="text-sm text-muted-foreground">
          Earn 1 XP for every minute of focus. Collect all the Mochis!
        </p>
      </div>
    </div>
  );
}
