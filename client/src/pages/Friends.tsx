import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, UserPlus, Link2, Flame, Trophy, Copy, Check } from "lucide-react";
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

function encodeProfile(profile: FriendCard): string {
  return btoa(JSON.stringify(profile));
}

function decodeProfile(encoded: string): FriendCard | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
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
    xp,
    streak,
    level,
    totalSessions: sessions.length,
    buddyId,
    unlockedCount: unlockedKitties.length,
  };

  const shareCode = encodeProfile(myProfile);
  const shareUrl = `${window.location.origin}/?friend=${shareCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewFriend = () => {
    const decoded = decodeProfile(friendCode.trim());
    if (decoded) {
      setViewedFriend(decoded);
      // Save to friends list
      const updated = [decoded, ...savedFriends.filter(f => f.username !== decoded.username)].slice(0, 10);
      setSavedFriends(updated);
      localStorage.setItem('mochi-friends', JSON.stringify(updated));
    } else {
      alert('Invalid friend code. Ask your friend to share their link!');
    }
  };

  const handleSaveName = () => {
    setUsername(nameInput);
    setEditingName(false);
  };

  const FriendProfileCard = ({ friend }: { friend: FriendCard }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-secondary/20 to-primary/10 p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-5">
        <KittyAvatar id={friend.buddyId || 'k1'} isUnlocked size="md" />
        <div>
          <h3 className="font-black text-xl text-foreground">{friend.username}</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Level {friend.level}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-primary">{friend.xp}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">XP</p>
        </div>
        <div className="bg-card rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-orange-500 flex items-center justify-center gap-0.5">
            <Flame size={16} fill="currentColor" />{friend.streak}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Streak</p>
        </div>
        <div className="bg-card rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-foreground">{friend.unlockedCount}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Kitties</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-32 px-4 pt-8 max-w-md mx-auto font-display">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <h2 className="text-3xl font-black text-foreground">Friends</h2>
      </div>

      {/* My Profile Card */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-5">
          <KittyAvatar id={buddyId} isUnlocked size="md" />
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 font-black text-lg bg-transparent border-b-2 border-primary outline-none text-foreground"
                  placeholder="Your name..."
                />
                <button onClick={handleSaveName} className="text-primary font-black text-sm btn-bounce">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-foreground">{username || 'Set your name!'}</h3>
                <button onClick={() => setEditingName(true)} className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold">✏️</button>
              </div>
            )}
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-card px-2 py-0.5 rounded-full">
              Level {level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card/60 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-primary">{xp}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">XP</p>
          </div>
          <div className="bg-card/60 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-orange-500 flex items-center justify-center gap-0.5">
              <Flame size={16} fill="currentColor" />{streak}
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Streak</p>
          </div>
          <div className="bg-card/60 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-foreground">{unlockedKitties.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Kitties</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all btn-bounce ${copied ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy My Share Link'}
        </button>
      </div>

      {/* View a Friend */}
      <div className="bg-card border-2 border-border rounded-[2.5rem] p-6 mb-6 shadow-sm">
        <h3 className="font-black text-lg mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-primary" /> Add a Friend
        </h3>
        <p className="text-sm text-muted-foreground font-medium mb-4">
          Paste your friend's share link or code to see their progress!
        </p>
        <div className="flex gap-2">
          <input
            value={friendCode}
            onChange={e => {
              let val = e.target.value;
              // Strip URL if pasted as full link
              if (val.includes('?friend=')) val = val.split('?friend=')[1];
              setFriendCode(val);
            }}
            placeholder="Paste link or code here..."
            className="flex-1 bg-muted rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-primary text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={handleViewFriend} className="p-3 bg-primary text-primary-foreground rounded-2xl btn-bounce shadow-md">
            <Link2 size={20} />
          </button>
        </div>
      </div>

      {/* Viewed friend */}
      {viewedFriend && (
        <div className="mb-6">
          <h3 className="font-black text-base text-muted-foreground uppercase tracking-widest mb-3">Friend's Profile</h3>
          <FriendProfileCard friend={viewedFriend} />
        </div>
      )}

      {/* Saved Friends */}
      {savedFriends.length > 0 && (
        <div>
          <h3 className="font-black text-base text-muted-foreground uppercase tracking-widest mb-3">Recent Friends</h3>
          <div className="space-y-4">
            {savedFriends.map((friend, i) => (
              <FriendProfileCard key={i} friend={friend} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
