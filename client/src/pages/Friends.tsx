import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Flame, Trophy, Copy, Check, Link2, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { useMochi } from "@/hooks/use-mochi";
import { KittyAvatar } from "@/components/KittyAvatar";

interface FriendCard {
  username: string;
  xp: number;
  streak: number;
  level: number;
  totalSessions: number;
  buddyId: string;
  unlockedCount: number;
}

function encodeProfile(p: FriendCard): string {
  return btoa(JSON.stringify(p));
}
function decodeProfile(s: string): FriendCard | null {
  try { return JSON.parse(atob(s)); } catch { return null; }
}

function ProfileCard({ friend, label }: { friend: FriendCard; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] p-6 border-2 border-pink-200/50 shadow-xl backdrop-blur-sm"
      style={{ background: 'linear-gradient(135deg, rgba(249,168,212,0.25), rgba(192,132,252,0.15))' }}
    >
      <div className="absolute top-3 right-4 text-2xl animate-sparkle opacity-60">✨</div>
      {label && (
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{label}</p>
      )}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="rounded-[1.5rem] border-4 border-white/50 overflow-hidden shadow-lg">
            <KittyAvatar id={friend.buddyId || 'k1'} isUnlocked size="md" />
          </div>
          <div className="absolute -bottom-1 -right-1 text-lg animate-heartbeat">💖</div>
        </div>
        <div>
          <h3 className="font-black text-xl text-foreground" style={{ fontFamily: 'Fredoka' }}>{friend.username}</h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-pink-100 dark:bg-pink-900/30 text-pink-500 px-2 py-0.5 rounded-full">
            Level {friend.level}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-3 text-center shadow-sm border border-pink-100/40">
          <p className="text-xl font-black text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>{friend.xp}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">XP</p>
        </div>
        <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-3 text-center shadow-sm border border-pink-100/40">
          <p className="text-xl font-black text-orange-500 flex items-center justify-center gap-0.5">
            <Flame size={15} fill="currentColor" />{friend.streak}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Streak</p>
        </div>
        <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-3 text-center shadow-sm border border-pink-100/40">
          <p className="text-xl font-black text-purple-500">{friend.unlockedCount}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Kitties</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Friends() {
  const { username, xp, streak, sessions, unlockedKitties, buddyId, setUsername } = useMochi();
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [viewedFriend, setViewedFriend] = useState<FriendCard | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [savedFriends, setSavedFriends] = useState<FriendCard[]>(() => {
    try { return JSON.parse(localStorage.getItem('mochi-friends') || '[]'); } catch { return []; }
  });

  const level = Math.floor(xp / 100) + 1;
  const myProfile: FriendCard = {
    username: username || 'Anonymous Mochi',
    xp, streak, level,
    totalSessions: sessions.length,
    buddyId,
    unlockedCount: unlockedKitties.length,
  };

  const shareUrl = `${window.location.origin}/?friend=${encodeProfile(myProfile)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewFriend = () => {
    let val = friendCode.trim();
    if (val.includes('?friend=')) val = val.split('?friend=')[1];
    const decoded = decodeProfile(val);
    if (decoded) {
      setViewedFriend(decoded);
      const updated = [decoded, ...savedFriends.filter(f => f.username !== decoded.username)].slice(0, 10);
      setSavedFriends(updated);
      localStorage.setItem('mochi-friends', JSON.stringify(updated));
    } else {
      alert('Invalid friend code! Ask your friend to share their link 💌');
    }
  };

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-200/50 shadow-sm backdrop-blur-sm btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'Fredoka' }}>Friends 💌</h2>
      </div>

      {/* My Profile Card */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] p-6 mb-6 shadow-2xl border-2 border-pink-200/40"
        style={{ background: 'linear-gradient(135deg, #f9a8d4cc, #c084fcaa)', boxShadow: '0 16px 40px rgba(244,114,182,0.2)' }}
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-3 right-5 text-2xl animate-sparkle">⭐</div>

        <div className="flex items-center gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div className="rounded-[1.5rem] border-4 border-white/60 overflow-hidden shadow-lg">
              <KittyAvatar id={buddyId} isUnlocked size="md" />
            </div>
            <div className="absolute -bottom-1 -right-1 text-xl animate-heartbeat">💖</div>
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setUsername(nameInput); setEditingName(false); } }}
                  className="flex-1 font-black text-xl bg-white/30 border-b-2 border-white/60 outline-none text-white placeholder:text-white/50 rounded-lg px-2"
                  placeholder="Your name..."
                />
                <button onClick={() => { setUsername(nameInput); setEditingName(false); }} className="text-white font-black text-sm bg-white/20 px-3 py-1 rounded-full btn-bounce">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-white" style={{ fontFamily: 'Fredoka' }}>
                  {username || 'Set your name!'}
                </h3>
                <button onClick={() => setEditingName(true)} className="text-white/70 hover:text-white transition-colors text-base btn-bounce">✏️</button>
              </div>
            )}
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
              <Trophy size={10} className="inline mr-1" />Level {level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'XP', value: xp, color: 'text-white' },
            { label: 'Streak', value: streak, color: 'text-orange-200', icon: <Flame size={14} fill="currentColor" /> },
            { label: 'Kitties', value: unlockedKitties.length, color: 'text-purple-200' },
          ].map(s => (
            <div key={s.label} className="bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className={`text-xl font-black text-white flex items-center justify-center gap-0.5`}>
                {s.icon}{s.value}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <button onClick={handleCopy}
          className={`w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all btn-bounce ${
            copied ? 'bg-green-400 text-white' : 'bg-white/25 text-white border-2 border-white/40 backdrop-blur-sm'
          }`}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied! 🎉' : 'Copy My Share Link 💌'}
        </button>
      </div>

      {/* Add Friend */}
      <div className="bg-white/60 dark:bg-white/5 border-2 border-pink-100/60 dark:border-white/10 rounded-[2.5rem] p-6 mb-6 shadow-sm backdrop-blur-sm">
        <h3 className="font-black text-lg mb-1 flex items-center gap-2" style={{ fontFamily: 'Fredoka' }}>
          <UserPlus size={20} className="text-primary" /> Add a Friend
        </h3>
        <p className="text-sm text-muted-foreground font-semibold mb-4">
          Paste your friend's share link to see their progress! 🌸
        </p>
        <div className="flex gap-2">
          <input
            value={friendCode}
            onChange={e => setFriendCode(e.target.value)}
            placeholder="Paste link or code here..."
            className="flex-1 bg-pink-50/50 dark:bg-white/5 border-2 border-pink-200/50 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50"
          />
          <button onClick={handleViewFriend}
            className="p-3 text-white rounded-2xl btn-bounce shadow-md"
            style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
            <Link2 size={20} />
          </button>
        </div>
      </div>

      {viewedFriend && (
        <div className="mb-6">
          <ProfileCard friend={viewedFriend} label="Friend's Profile ✨" />
        </div>
      )}

      {savedFriends.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Recent Friends</p>
          <div className="space-y-4">
            {savedFriends.map((f, i) => (
              <ProfileCard key={i} friend={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
