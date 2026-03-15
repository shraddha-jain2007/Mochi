import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Zap } from "lucide-react";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";

const DREAM_ITEMS = [
  { id: "moonstone",   emoji: "🌙", name: "Moonstone",      desc: "Glows softly in the dark",         cost: 10, rarity: "common"  },
  { id: "starfrag",    emoji: "⭐", name: "Star Fragment",   desc: "Fell from the dream sky",          cost: 10, rarity: "common"  },
  { id: "lavbloom",    emoji: "💜", name: "Lavender Bloom",  desc: "Smells like cozy study nights",    cost: 15, rarity: "uncommon"},
  { id: "dreamjelly",  emoji: "🪼", name: "Dream Jellyfish", desc: "Floats between dimensions",        cost: 20, rarity: "uncommon"},
  { id: "pinkcloud",   emoji: "🌸", name: "Sakura Cloud",   desc: "Mochi's favourite resting spot",   cost: 20, rarity: "uncommon"},
  { id: "crystalball", emoji: "🔮", name: "Crystal Orb",    desc: "Shows tomorrow's possibilities",   cost: 30, rarity: "rare"   },
  { id: "comet",       emoji: "☄️", name: "Mini Comet",     desc: "Still warm from the journey",      cost: 30, rarity: "rare"   },
  { id: "galaxydust",  emoji: "✨", name: "Galaxy Dust",    desc: "Used to make Galaxy Mochi",        cost: 50, rarity: "epic"   },
  { id: "dreamcrown",  emoji: "👑", name: "Dream Crown",    desc: "Only the most focused earn this",  cost: 80, rarity: "epic"   },
  { id: "infinityrose",emoji: "🌹", name: "Infinity Rose",  desc: "Blooms only in dream worlds",      cost: 100, rarity: "legendary"},
];

const RARITY_STYLES: Record<string, { border: string; glow: string; badge: string }> = {
  common:    { border: "border-zinc-200",    glow: "shadow-zinc-100",    badge: "bg-zinc-100 text-zinc-500"    },
  uncommon:  { border: "border-violet-200",  glow: "shadow-violet-100",  badge: "bg-violet-100 text-violet-600" },
  rare:      { border: "border-blue-300",    glow: "shadow-blue-200",    badge: "bg-blue-100 text-blue-600"    },
  epic:      { border: "border-pink-300",    glow: "shadow-pink-200",    badge: "bg-pink-100 text-pink-600"    },
  legendary: { border: "border-amber-400",   glow: "shadow-amber-200",   badge: "bg-amber-100 text-amber-600"  },
};

const STAR_POSITIONS = Array.from({ length: 40 }, (_, i) => ({
  top:   `${Math.random() * 90}%`,
  left:  `${Math.random() * 100}%`,
  size:  Math.random() > 0.7 ? "text-base" : "text-xs",
  delay: `${(i * 0.3) % 3}s`,
  anim:  i % 2 === 0 ? "animate-sparkle" : "animate-float",
}));

const PET_MOODS = [
  { threshold: 0,   msg: "Mochi is resting peacefully 😴",             glow: "#c084fc" },
  { threshold: 20,  msg: "Mochi's dream energy is stirring... 🌱",     glow: "#a78bfa" },
  { threshold: 60,  msg: "Mochi is glowing with dream energy! 🌙",     glow: "#818cf8" },
  { threshold: 120, msg: "Mochi is fully charged — deep dreamer 💫",   glow: "#f472b6" },
  { threshold: 200, msg: "Mochi has transcended to Galaxy mode! ⚡",    glow: "#fbbf24" },
];

export default function DreamWorld() {
  const { dreamEnergy, dreamItemsCollected, collectDreamItem, buddyId, unlockedKitties } = useMochi();
  const [collected, setCollected] = useState<string | null>(null);

  const mood = [...PET_MOODS].reverse().find(m => dreamEnergy >= m.threshold) || PET_MOODS[0];
  const companion = unlockedKitties.find(k => k.id === buddyId) || unlockedKitties[0];

  const handleCollect = (item: typeof DREAM_ITEMS[0]) => {
    if (dreamItemsCollected.includes(item.id) || dreamEnergy < item.cost) return;
    collectDreamItem(item.id);
    setCollected(item.name);
    setTimeout(() => setCollected(null), 2500);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden pb-32"
      style={{ background: "linear-gradient(180deg, #0f0a1e 0%, #1a0a2e 30%, #2d1060 60%, #1a0538 100%)" }}
    >
      {/* Stars */}
      {STAR_POSITIONS.map((s, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none select-none text-white/60 ${s.size} ${s.anim}`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          ✦
        </div>
      ))}

      {/* Moon */}
      <div className="absolute top-8 right-8 text-6xl animate-float pointer-events-none select-none opacity-80">🌕</div>

      {/* Floating clouds */}
      <div className="absolute top-32 left-4 text-5xl animate-float pointer-events-none select-none opacity-30" style={{ animationDelay: "1s" }}>☁️</div>
      <div className="absolute top-48 right-16 text-4xl animate-float2 pointer-events-none select-none opacity-20" style={{ animationDelay: "2s" }}>☁️</div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-8 mb-6">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white btn-bounce backdrop-blur-sm">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Fredoka" }}>
            Dream World 🌙
          </h2>
          <p className="text-xs font-bold text-white/50">Mochi's cozy dreamscape</p>
        </div>
      </div>

      {/* Dream Energy Bar */}
      <div className="relative z-10 mx-5 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2rem] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Dream Energy</span>
          </div>
          <span className="text-2xl font-black text-amber-400" style={{ fontFamily: "Fredoka" }}>{dreamEnergy}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #818cf8, #c084fc, #f472b6)" }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (dreamEnergy / 200) * 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-[11px] font-semibold text-white/40 mt-2">
          Earned by completing Pomodoro sessions · spend to collect dream items
        </p>
      </div>

      {/* Pet in dreamscape */}
      <div className="relative z-10 flex flex-col items-center mb-10 px-5">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glow ring behind kitty */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-125"
            style={{ background: mood.glow }}
          />
          <div className="relative">
            <KittyAvatar id={companion.id} isUnlocked size="xl" />
          </div>
          {/* Dream bubbles */}
          {["💭", "⭐", "🌙"].map((b, i) => (
            <motion.div
              key={i}
              className="absolute text-lg pointer-events-none"
              style={{ top: `${-10 - i * 18}px`, left: `${50 + (i - 1) * 30}px` }}
              animate={{ y: [0, -20, 0], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            >
              {b}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm font-black text-white/80">{mood.msg}</p>
          <p className="text-xs text-white/40 mt-1">{companion.name}</p>
        </div>
      </div>

      {/* Dream Items Grid */}
      <div className="relative z-10 px-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4">
          Dream Collectibles ✦
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {DREAM_ITEMS.map(item => {
            const owned    = dreamItemsCollected.includes(item.id);
            const canAfford = dreamEnergy >= item.cost;
            const style    = RARITY_STYLES[item.rarity];
            return (
              <motion.button
                key={item.id}
                onClick={() => handleCollect(item)}
                disabled={owned || !canAfford}
                whileTap={owned || !canAfford ? {} : { scale: 0.95 }}
                className={`relative flex flex-col items-start gap-2 p-4 rounded-[1.5rem] border-2 text-left transition-all ${style.border} ${
                  owned
                    ? "bg-white/5 opacity-60"
                    : canAfford
                    ? `bg-white/10 backdrop-blur-sm shadow-lg ${style.glow} hover:bg-white/15`
                    : "bg-white/5 opacity-40"
                }`}
              >
                {owned && (
                  <div className="absolute top-2 right-2 text-xs">✓</div>
                )}
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <p className="text-xs font-black text-white leading-tight">{item.name}</p>
                  <p className="text-[10px] font-semibold text-white/50 leading-tight mt-0.5">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badge}`}>
                    {item.rarity}
                  </span>
                  {!owned && (
                    <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5">
                      <Zap size={9} /> {item.cost}
                    </span>
                  )}
                  {owned && (
                    <span className="text-[10px] font-black text-emerald-400">owned!</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {dreamItemsCollected.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2rem] p-4 text-center">
            <p className="text-xs font-black text-white/60">
              Collection: {dreamItemsCollected.length} / {DREAM_ITEMS.length} items ✨
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {dreamItemsCollected.map(id => {
                const item = DREAM_ITEMS.find(d => d.id === id);
                return item ? <span key={id} className="text-2xl" title={item.name}>{item.emoji}</span> : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Collected toast */}
      <AnimatePresence>
        {collected && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-white text-zinc-800 font-black text-sm px-6 py-3 rounded-full shadow-2xl border-2 border-pink-200"
          >
            ✨ {collected} collected!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
