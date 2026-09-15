import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  ListTodo,
  Sparkles,
  Tag,
  Clock,
  Target,
  Flame,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { Task } from '../types';
import { playClickSound } from '../utils/audio';

interface TaskListProps {
  activeTaskId: string | null;
  onSelectActiveTask: (task: Task | null) => void;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'cyber_pomodoro_tasks_v1';

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'تطوير هيكل التطبيق المستقبلي مع تأثيرات ضوئية',
    completed: true,
    createdAt: Date.now() - 3600000 * 2,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    priority: 'high',
    tag: 'برمجة',
  },
  {
    id: 'task-2',
    title: 'مراجعة مؤشرات التحليل في crypto-gold-tracker',
    completed: false,
    createdAt: Date.now() - 3600000,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    priority: 'medium',
    tag: 'تحليل',
  },
  {
    id: 'task-3',
    title: 'جلسة تركيز عميق: القراءة والتعلم التكنولوجي',
    completed: false,
    createdAt: Date.now(),
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    priority: 'low',
    tag: 'تطوير ذات',
  },
];

export const TaskList: React.FC<TaskListProps> = ({
  activeTaskId,
  onSelectActiveTask,
  soundEnabled,
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_TASKS;
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newEstimated, setNewEstimated] = useState(1);
  const [newTag, setNewTag] = useState('عمل');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save to LocalStorage whenever tasks update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore quota errors
    }
  }, [tasks]);

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    playClickSound(soundEnabled);
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: Date.now(),
      estimatedPomodoros: newEstimated,
      completedPomodoros: 0,
      priority: newPriority,
      tag: newTag,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewEstimated(1);

    // If no active task, set this as active
    if (!activeTaskId) {
      onSelectActiveTask(newTask);
    }
  };

  const handleToggleTask = (id: string) => {
    playClickSound(soundEnabled);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          // If task completed and was active, unselect
          if (nextCompleted && activeTaskId === id) {
            onSelectActiveTask(null);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedPomodoros: nextCompleted
              ? Math.max(t.completedPomodoros, t.estimatedPomodoros)
              : t.completedPomodoros,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound(soundEnabled);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      onSelectActiveTask(null);
    }
  };

  const handleClearCompleted = () => {
    playClickSound(soundEnabled);
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  const priorityColors = {
    high: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    medium: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    low: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
  };

  const priorityLabels = {
    high: 'أولوية قصوى',
    medium: 'أولوية متوسطة',
    low: 'أولوية عادية',
  };

  return (
    <div
      id="smart-task-list"
      className="flex flex-col p-6 rounded-3xl glass-panel border border-slate-800/80 w-full max-w-lg mx-auto shadow-2xl backdrop-blur-xl relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/70 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              قائمة المهام الذكية
              <span className="text-[11px] font-normal text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono-cyber">
                LocalStorage ON
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              ربط المهام بجلسات التركيز وحفظها تلقائياً
            </p>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/30 px-2.5 py-1 rounded-lg transition-colors"
          >
            مسح المكتملة
          </button>
        )}
      </div>

      {/* Task Input Form */}
      <form onSubmit={handleAddTask} className="mb-4 space-y-3">
        <div className="relative flex items-center">
          <input
            id="input-new-task-title"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="أضف مهمة جديدة للتركيز عليها..."
            className="w-full bg-[#080d17]/80 border border-slate-700/60 focus:border-cyan-400/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute left-2 p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            title="إضافة المهمة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Task Metadata Selector (Priority & Estimated Pomodoros) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">الأولوية:</span>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  newPriority === p
                    ? priorityColors[p] + ' font-medium'
                    : 'text-slate-400 border-slate-800 bg-slate-900/40 hover:bg-slate-800/40'
                }`}
              >
                {p === 'high' ? 'قصوى' : p === 'medium' ? 'متوسطة' : 'عادية'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">الدورات:</span>
            <div className="flex items-center bg-slate-900/60 border border-slate-800 rounded-lg p-0.5">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setNewEstimated(count)}
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono-cyber text-xs transition-colors ${
                    newEstimated === count
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Filter Tabs & Stats Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/50 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-slate-800 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            قيد التنفيذ ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-slate-800 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المكتملة ({completedCount})
          </button>
        </div>

        <span className="text-slate-500 text-[11px] font-mono-cyber">
          {Math.round((completedCount / (tasks.length || 1)) * 100)}% إنجاز
        </span>
      </div>

      {/* Tasks List Items with Framer Motion */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-2"
            >
              <AlertCircle className="w-6 h-6 text-slate-600" />
              <span>لا توجد مهام في هذا القسم حالياً</span>
            </motion.div>
          ) : (
            filteredTasks.map((task) => {
              const isActive = activeTaskId === task.id;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25 }}
                  onClick={() => onSelectActiveTask(isActive ? null : task)}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    task.completed
                      ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                      : isActive
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0a0f1c]/70 border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0d1424]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id);
                      }}
                      className="text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      ) : (
                        <Circle className="w-5 h-5 group-hover:text-cyan-400" />
                      )}
                    </button>

                    {/* Title & Tag */}
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-medium tracking-tight truncate transition-all ${
                          task.completed
                            ? 'line-through text-slate-500'
                            : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {task.title}
                      </span>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {priorityLabels[task.priority]}
                        </span>

                        {task.tag && (
                          <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                            #{task.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Pomodoro dots & Delete action */}
                  <div className="flex items-center gap-2 shrink-0 pr-2">
                    {/* Pomodoro Indicator */}
                    <div
                      className="flex items-center gap-1 font-mono-cyber text-xs bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 text-slate-400"
                      title={`${task.completedPomodoros} من أصل ${task.estimatedPomodoros} دورة`}
                    >
                      <Flame
                        className={`w-3.5 h-3.5 ${
                          task.completedPomodoros >= task.estimatedPomodoros
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      />
                      <span>
                        {task.completedPomodoros}/{task.estimatedPomodoros}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
