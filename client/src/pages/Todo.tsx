import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, CheckCircle2, Circle, Flag } from "lucide-react";
import { Link } from "wouter";
import { useMochi, type TodoItem } from "@/hooks/use-mochi";

const CATEGORIES = ['General', 'Study', 'Health', 'Personal', 'Work'];
const PRIORITY_COLORS: Record<TodoItem['priority'], string> = {
  high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
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

  return (
    <div className="min-h-screen pb-32 px-4 pt-8 max-w-md mx-auto font-display">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground">To-Do List</h2>
          <p className="text-sm font-bold text-muted-foreground">{done}/{todos.length} done</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg btn-bounce"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Progress bar */}
      {todos.length > 0 && (
        <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${todos.length ? (done / todos.length) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-6 mb-6 shadow-xl shadow-primary/5 space-y-4 overflow-hidden"
          >
            <input
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What needs to be done?"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-muted focus:border-primary outline-none py-2 placeholder:text-muted-foreground/40 text-foreground"
            />

            <div className="flex gap-2 flex-wrap">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${priority === p ? PRIORITY_COLORS[p] + ' border-2 border-current' : 'bg-muted text-muted-foreground'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 bg-primary text-primary-foreground font-black rounded-2xl btn-bounce text-lg"
            >
              Add Task ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-2xl text-sm font-black uppercase tracking-widest transition-all btn-bounce ${filter === f ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-muted-foreground border border-border'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <div className="text-6xl mb-4">🌸</div>
          <p className="font-black text-xl">All clear!</p>
          <p className="text-sm font-medium text-muted-foreground">Add something to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`bg-card p-5 rounded-[2rem] border-2 flex gap-4 items-center shadow-sm transition-all ${todo.done ? 'opacity-50 border-muted' : 'border-border'}`}
              >
                <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0 btn-bounce">
                  {todo.done
                    ? <CheckCircle2 size={28} className="text-primary" fill="currentColor" />
                    : <Circle size={28} className="text-muted-foreground" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-base leading-snug ${todo.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {todo.text}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {todo.category}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${PRIORITY_COLORS[todo.priority]}`}>
                      <Flag size={8} className="inline mr-0.5" />{todo.priority}
                    </span>
                  </div>
                </div>

                <button onClick={() => deleteTodo(todo.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors btn-bounce">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
