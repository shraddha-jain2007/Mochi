import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, CheckCircle2, Circle, Flag } from "lucide-react";
import { Link } from "wouter";
import { useMochi, type TodoItem } from "@/hooks/use-mochi";

const CATEGORIES = ['General', 'Study', 'Health', 'Personal', 'Work'];

const PRIORITY_STYLES: Record<TodoItem['priority'], { label: string; active: string; pill: string }> = {
  high:   { label: '🔥 High',   active: 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 border-2 border-rose-300',    pill: 'bg-rose-50 text-rose-400 dark:bg-rose-900/20' },
  medium: { label: '⭐ Medium', active: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 border-2 border-amber-300', pill: 'bg-amber-50 text-amber-400 dark:bg-amber-900/20' },
  low:    { label: '🌿 Low',    active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 border-2 border-emerald-300', pill: 'bg-emerald-50 text-emerald-400 dark:bg-emerald-900/20' },
};

export default function Todo() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useMochi();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<TodoItem['priority']>('medium');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text.trim(), priority, category);
    setText('');
    setShowForm(false);
  };

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );
  const done = todos.filter(t => t.done).length;
  const pct = todos.length ? (done / todos.length) * 100 : 0;

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-200/50 shadow-sm backdrop-blur-sm btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'Fredoka' }}>To-Do List 📝</h2>
          <p className="text-sm font-semibold text-muted-foreground">
            <span style={{ fontFamily: 'Dancing Script, cursive' }}>{done}/{todos.length} things done ✨</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="p-3 rounded-2xl text-white shadow-lg btn-bounce"
          style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 4px 0 0 #be185d' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Progress bar */}
      {todos.length > 0 && (
        <div className="h-2.5 bg-pink-100 dark:bg-pink-900/20 rounded-full mb-6 overflow-hidden border border-pink-200/40">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f472b6, #c084fc)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-white/70 dark:bg-white/5 border-2 border-pink-200/60 rounded-[2.5rem] p-6 mb-6 shadow-xl space-y-4 overflow-hidden backdrop-blur-sm"
          >
            <input
              autoFocus value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What needs to be done? 🌸"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-pink-200 focus:border-primary outline-none py-2 placeholder:text-muted-foreground/40 text-foreground"
            />

            <div className="flex gap-2 flex-wrap">
              {(Object.keys(PRIORITY_STYLES) as TodoItem['priority'][]).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all btn-bounce ${priority === p ? PRIORITY_STYLES[p].active : 'bg-muted text-muted-foreground'}`}>
                  {PRIORITY_STYLES[p].label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all btn-bounce ${
                    category === c ? 'text-white' : 'bg-muted text-muted-foreground'
                  }`}
                  style={category === c ? { background: 'linear-gradient(135deg, #f472b6, #c084fc)' } : {}}>
                  {c}
                </button>
              ))}
            </div>

            <button onClick={handleAdd}
              className="w-full py-3 text-white font-black rounded-2xl btn-bounce text-lg"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 4px 0 0 #be185d' }}>
              Add Task ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all btn-bounce ${
              filter === f ? 'text-white shadow-md' : 'bg-white/50 dark:bg-white/5 text-muted-foreground border border-pink-100/50 dark:border-white/10'
            }`}
            style={filter === f ? { background: 'linear-gradient(135deg, #f472b6, #c084fc)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 opacity-50">
          <div className="text-7xl mb-4 animate-float2">🌸</div>
          <p className="font-black text-xl" style={{ fontFamily: 'Fredoka' }}>All clear!</p>
          <p className="text-sm font-semibold text-muted-foreground mt-1">Add something to get started ✨</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(todo => (
              <motion.div
                key={todo.id} layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`bg-white/60 dark:bg-white/5 p-5 rounded-[2rem] border-2 flex gap-4 items-center shadow-sm backdrop-blur-sm transition-all ${
                  todo.done ? 'opacity-50 border-muted' : 'border-pink-100/60 dark:border-white/10'
                }`}
              >
                <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0 btn-bounce">
                  {todo.done
                    ? <CheckCircle2 size={28} style={{ color: '#f472b6' }} fill="currentColor" />
                    : <Circle size={28} className="text-muted-foreground/40" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-base leading-snug ${todo.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {todo.text}
                  </p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-muted/60 px-2 py-0.5 rounded-full text-muted-foreground">
                      {todo.category}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${PRIORITY_STYLES[todo.priority].pill}`}>
                      <Flag size={8} className="inline mr-0.5" />{todo.priority}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="p-2 text-muted-foreground/40 hover:text-rose-400 transition-colors btn-bounce">
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
