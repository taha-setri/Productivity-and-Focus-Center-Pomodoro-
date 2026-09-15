import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Flame,
  CheckCircle2,
  BellRing,
  Coffee,
  Brain,
  Moon
} from 'lucide-react';
import { TimerMode, Task } from '../types';
import { playClickSound, playCompletionChime } from '../utils/audio';

interface PomodoroTimerProps {
  activeTask: Task | null;
  onCycleComplete: (mode: TimerMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  activeTask,
  onCycleComplete,
  soundEnabled,
  onToggleSound,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  
  // Custom durations in minutes
  const [durations, setDurations] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro_completed_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showCompletionPulse, setShowCompletionPulse] = useState<boolean>(false);

  const totalTimeForMode = durations[mode] * 60;
  const progressFraction = Math.max(0, Math.min(1, 1 - timeLeft / totalTimeForMode));

  // Timer interval handling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback((newMode: TimerMode) => {
    playClickSound(soundEnabled);
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durations[newMode] * 60);
    setShowCompletionPulse(false);
  }, [durations, soundEnabled]);

  // Handle timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            
            // Celebration pulse & audio
            setShowCompletionPulse(true);
            playCompletionChime(soundEnabled);

            if (mode === 'pomodoro') {
              setCompletedSessionsCount((c) => {
                const next = c + 1;
                localStorage.setItem('pomodoro_completed_sessions', next.toString());
                return next;
              });
            }

            onCycleComplete(mode);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, soundEnabled, onCycleComplete]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    playClickSound(soundEnabled);
    setIsRunning(!isRunning);
    if (showCompletionPulse) {
      setShowCompletionPulse(false);
    }
  };

  const resetTimer = () => {
    playClickSound(soundEnabled);
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
    setShowCompletionPulse(false);
  };

  const skipTimer = () => {
    playClickSound(soundEnabled);
    if (mode === 'pomodoro') {
      switchMode('shortBreak');
    } else {
      switchMode('pomodoro');
    }
  };

  const addTime = (mins: number) => {
    playClickSound(soundEnabled);
    setTimeLeft((prev) => prev + mins * 60);
  };

  // Color mappings based on mode
  const modeColors = {
    pomodoro: {
      primary: '#06b6d4', // cyan-500
      glow: 'rgba(6, 182, 212, 0.45)',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      bgGlow: 'from-cyan-500/15 via-transparent to-transparent',
      label: 'جلسة تركيز عميق',
      badge: '25 دقيقة',
      icon: Brain,
    },
    shortBreak: {
      primary: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.45)',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 via-transparent to-transparent',
      label: 'استراحة قصيرة منعشة',
      badge: '5 دقائق',
      icon: Coffee,
    },
    longBreak: {
      primary: '#f59e0b', // amber-500
      glow: 'rgba(245, 158, 11, 0.45)',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      bgGlow: 'from-amber-500/15 via-transparent to-transparent',
      label: 'استراحة طويلة للاستعادة',
      badge: '15 دقيقة',
      icon: Moon,
    },
  };

  const currentTheme = modeColors[mode];

  // SVG ring dimensions
  const size = 320;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth - 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div
      id="pomodoro-timer-card"
      className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 w-full max-w-lg mx-auto shadow-2xl transition-all duration-500"
    >
      {/* Background ambient radial glow */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${currentTheme.bgGlow} pointer-events-none transition-all duration-700`}
      />

      {/* Mode Switcher Tabs */}
      <div className="relative z-10 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e18]/80 border border-slate-800/80 mb-6 shadow-inner">
        <button
          id="tab-mode-pomodoro"
          onClick={() => switchMode('pomodoro')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            mode === 'pomodoro'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>تركيز (25د)</span>
        </button>

        <button
          id="tab-mode-shortbreak"
          onClick={() => switchMode('shortBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            mode === 'shortBreak'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-emerald-400" />
          <span>استراحة (5د)</span>
        </button>

        <button
          id="tab-mode-longbreak"
          onClick={() => switchMode('longBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            mode === 'longBreak'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span>طويلة (15د)</span>
        </button>
      </div>

      {/* Active Task Reminder Banner */}
      {activeTask && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full mb-4 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-slate-400 font-normal">المهمة النشطة:</span>
            <span className="text-cyan-200 font-semibold truncate max-w-[200px]">
              {activeTask.title}
            </span>
          </div>
          <span className="font-mono-cyber text-[11px] text-cyan-400/80 bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-500/20 whitespace-nowrap">
            {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros} دورة
          </span>
        </motion.div>
      )}

      {/* Circular Glowing Ring Container */}
      <div className="relative flex items-center justify-center my-2 select-none">
        {/* Visual Pulse Wave on Completion */}
        <AnimatePresence>
          {showCompletionPulse && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: [1, 1.35, 1.6], opacity: [0.8, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              className={`absolute rounded-full border-2 ${
                mode === 'pomodoro'
                  ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.8)]'
                  : 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.8)]'
              }`}
              style={{ width: size + 20, height: size + 20 }}
            />
          )}
        </AnimatePresence>

        {/* Outer ambient decorative ring */}
        <div
          className={`absolute rounded-full border border-dashed border-slate-700/50 pointer-events-none transition-all duration-700 ${
            isRunning ? 'animate-spin' : ''
          }`}
          style={{
            width: size + 24,
            height: size + 24,
            animationDuration: '60s',
          }}
        />

        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-xl"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#162032"
            strokeWidth={strokeWidth}
            className="opacity-70"
          />

          {/* Secondary tick marks track */}
          <circle
            cx={center}
            cy={center}
            r={radius + 7}
            fill="transparent"
            stroke="rgba(56, 189, 248, 0.1)"
            strokeWidth="1.5"
            strokeDasharray="3 6"
          />

          {/* Active Glowing Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={currentTheme.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 10px ${currentTheme.primary})`,
            }}
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <currentTheme.icon className={`w-3.5 h-3.5 ${currentTheme.text}`} />
            <span className="font-medium tracking-wide">{currentTheme.label}</span>
          </div>

          <div
            id="timer-countdown"
            className={`font-mono-cyber text-5xl sm:text-6xl font-bold tracking-tight text-slate-100 ${
              isRunning ? 'animate-pulse' : ''
            }`}
            style={{
              textShadow: isRunning ? `0 0 24px ${currentTheme.glow}` : 'none',
            }}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px]">
              {Math.round(progressFraction * 100)}% مكتمل
            </span>
            {showCompletionPulse && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium animate-bounce text-[11px]">
                <BellRing className="w-3 h-3" /> تم الإنجاز!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Controls (Play/Pause, Reset, Skip, Add Mins) */}
      <div className="relative z-10 flex flex-col items-center gap-4 mt-6 w-full">
        <div className="flex items-center justify-center gap-4">
          <button
            id="btn-reset-timer"
            onClick={resetTimer}
            title="إعادة ضبط المؤقت"
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all duration-200 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-toggle-timer"
            onClick={toggleTimer}
            className={`relative group px-8 py-3.5 rounded-2xl font-semibold text-base flex items-center gap-2.5 transition-all duration-300 active:scale-95 shadow-lg ${
              isRunning
                ? 'bg-slate-800 border border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border border-cyan-300/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>ابدأ التركيز</span>
              </>
            )}
          </button>

          <button
            id="btn-skip-timer"
            onClick={skipTimer}
            title="تخطي الدورة الحالية"
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all duration-200 active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Mins & Audio Controls Bar */}
        <div className="flex items-center justify-between w-full px-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">إضافة وقت:</span>
            <button
              onClick={() => addTime(1)}
              className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
            >
              +1 دقيقة
            </button>
            <button
              onClick={() => addTime(5)}
              className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
            >
              +5 دقائق
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              className={`flex items-center gap-1 p-1.5 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30'
                  : 'border-slate-800 text-slate-500 bg-slate-900/60'
              }`}
              title={soundEnabled ? 'المؤثرات الصوتية مفعلة' : 'المؤثرات الصوتية معطلة'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Streak Counter */}
            <div
              id="streak-counter-badge"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-300 font-mono-cyber text-[11px]"
              title="عدد دورات البومودورو المكتملة"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{completedSessionsCount} دورات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
