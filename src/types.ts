export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: 'low' | 'medium' | 'high';
  tag?: string;
}

export interface TimerSettings {
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'deep_space' | 'binaural_focus' | 'cyber_rain';
  ambientVolume: number;
}

export interface DayStats {
  date: string;
  completedPomodoros: number;
  totalFocusSeconds: number;
  completedTasks: number;
}
