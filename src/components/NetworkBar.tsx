import React, { useState, useEffect } from 'react';
import { ExternalLink, Radio, ShieldCheck, Activity, Globe } from 'lucide-react';

interface NetworkBarProps {
  onOpenStandaloneModal?: () => void;
}

export const NetworkBar: React.FC<NetworkBarProps> = ({ onOpenStandaloneModal }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [ping, setPing] = useState<number>(24);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Subtle ping simulation for cyber immersion
    const pingInterval = setInterval(() => {
      setPing(Math.floor(20 + Math.random() * 8));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <header
      id="cyber-network-bar"
      className="w-full bg-[#070b13]/85 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-50 sticky top-0 shadow-lg shadow-black/40"
    >
      {/* Network Status & Core Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-cyan-300 font-mono-cyber font-medium tracking-wide">
            MATRIX LINK // ACTIVE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono-cyber">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>STABILITY: 99.8%</span>
          <span className="text-slate-600">|</span>
          <span>PING: {ping}ms</span>
        </div>
      </div>

      {/* Network Navigation Link to Crypto Tracker */}
      <div className="flex items-center gap-2 sm:gap-3">
        <a
          id="link-crypto-gold-tracker"
          href="https://rypto-tracker.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="الانتقال إلى الموقع السابق في الشبكة: rypto-tracker.vercel.app"
          className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent border border-amber-400/30 hover:border-cyan-400/60 text-amber-200 hover:text-cyan-200 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400 group-hover:bg-cyan-400 transition-colors"></span>
          </span>
          <Globe className="w-3.5 h-3.5 text-amber-400 group-hover:text-cyan-300 transition-colors" />
          <span className="font-medium tracking-tight">
            الموقع السابق في الشبكة
          </span>
          <span className="hidden sm:inline font-mono-cyber text-[10px] text-amber-400/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20 dir-ltr">
            rypto-tracker.vercel.app
          </span>
          <ExternalLink className="w-3 h-3 text-amber-400 group-hover:text-cyan-300 group-hover:translate-x-[-2px] transition-transform" />
        </a>

        {/* Live Clock & Standalone Export Button */}
        {timeStr && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-mono-cyber">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{timeStr}</span>
          </div>
        )}

        {onOpenStandaloneModal && (
          <button
            id="btn-open-standalone-export"
            onClick={onOpenStandaloneModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors text-[11px]"
            title="تصدير كملف HTML مستقل كامل ومدمج"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ملف HTML مستقل</span>
          </button>
        )}
      </div>
    </header>
  );
};
