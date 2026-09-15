/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NetworkBar } from './components/NetworkBar';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { AmbientSoundBar } from './components/AmbientSoundBar';
import { StandaloneModal } from './components/StandaloneModal';
import { LegalFooter, LegalModals } from './components/LegalFooter';
import { CookieBanner } from './components/CookieBanner';
import { Task, TimerMode } from './types';
import { Sparkles, Shield, Cpu, Activity, Clock, Zap, CheckCircle2, User } from 'lucide-react';

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'disclaimer' | 'cookies' | null>(null);

  const handleCycleComplete = (mode: TimerMode) => {
    if (mode === 'pomodoro' && activeTask) {
      // If there's an active task, increment its pomodoro counter
      try {
        const saved = localStorage.getItem('cyber_pomodoro_tasks_v1');
        if (saved) {
          const tasks: Task[] = JSON.parse(saved);
          const updated = tasks.map((t) =>
            t.id === activeTask.id
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          );
          localStorage.setItem('cyber_pomodoro_tasks_v1', JSON.stringify(updated));
          setActiveTask((prev) =>
            prev ? { ...prev, completedPomodoros: prev.completedPomodoros + 1 } : null
          );
        }
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-[#E2E8F0] flex flex-col relative cyber-grid">
      {/* Top Network Bar with link to previous network site: https://rypto-tracker.vercel.app/ */}
      <NetworkBar onOpenStandaloneModal={() => setIsExportModalOpen(true)} />

      {/* Ambient background light orbs (Subtle, non-distracting) */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />
      <div
        className="fixed bottom-10 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-ambient-glow"
        style={{ animationDelay: '-5s' }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-center relative z-10">
        {/* Futuristic Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono-cyber mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOCUSED PRODUCTIVITY HUB // NEURAL POMODORO</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            مركز الإنتاجية والتركيز{' '}
            <span className="bg-gradient-to-l from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              (بومودورو)
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            مساحة عمل مستقبلية هادئة خالية من التشتيت، مدعومة بحلقات توقيت دائرية متوهجة، نبضات بصرية حية، وقائمة مهام ذكية بتخزين محلي دائم.
          </p>
        </div>

        {/* Dual Column Layout: Pomodoro Timer + Smart Task List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Primary: Glowing Circular Pomodoro Timer */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <PomodoroTimer
              activeTask={activeTask}
              onCycleComplete={handleCycleComplete}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
          </div>

          {/* Right: Smart Task List */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <TaskList
              activeTaskId={activeTask?.id || null}
              onSelectActiveTask={(task) => setActiveTask(task)}
              soundEnabled={soundEnabled}
            />
          </div>
        </div>

        {/* Ambient Focus Audio Controller */}
        <AmbientSoundBar />

        {/* Cyber Information Badges Bar */}
        <div className="mt-10 pt-6 border-t border-slate-900/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-500" />
              <span>خصوصية تامة بدون تتبع (بياناتك محفوظة محلياً على جهازك)</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>نظام الـ 25/5 دقيقة لتحفيز التركيز الذهني العميق</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://rypto-tracker.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono-cyber text-[11px]"
            >
              <span>الموقع السابق في الشبكة: rypto-tracker.vercel.app</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Comprehensive Legal Footer with Founder Name, Disclaimer & Cookies Policy */}
        <LegalFooter
          onOpenDisclaimerModal={() => setActiveLegalModal('disclaimer')}
          onOpenCookiesModal={() => setActiveLegalModal('cookies')}
        />
      </main>

      {/* Cookies Consent Notification Banner */}
      <CookieBanner />

      {/* Legal Modals (Disclaimer & Cookies) */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Standalone Single File HTML Export Modal */}
      <StandaloneModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
