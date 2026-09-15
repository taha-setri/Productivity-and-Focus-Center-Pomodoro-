import React, { useState } from 'react';
import { Waves, Sparkles, Volume2, Moon, CloudRain, Radio, Shield } from 'lucide-react';
import { setAmbientSound } from '../utils/audio';

export const AmbientSoundBar: React.FC = () => {
  const [ambientType, setLocalAmbientType] = useState<
    'none' | 'deep_space' | 'binaural_focus' | 'cyber_rain'
  >('none');
  const [volume, setVolume] = useState<number>(0.35);

  const handleSelectSound = (type: 'none' | 'deep_space' | 'binaural_focus' | 'cyber_rain') => {
    const next = ambientType === type ? 'none' : type;
    setLocalAmbientType(next);
    setAmbientSound(next, volume);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (ambientType !== 'none') {
      setAmbientSound(ambientType, newVol);
    }
  };

  return (
    <div
      id="ambient-sound-controller"
      className="w-full max-w-4xl mx-auto mt-6 p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xl"
    >
      <div className="flex items-center gap-2 text-slate-300">
        <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-semibold text-slate-200">البيئة الصوتية العازلة (Focus Audio):</span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          ترددات هادئة محفزة للتركيز العميق
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={() => handleSelectSound('binaural_focus')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
            ambientType === 'binaural_focus'
              ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>موجات غاما (40Hz)</span>
        </button>

        <button
          onClick={() => handleSelectSound('deep_space')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
            ambientType === 'deep_space'
              ? 'bg-purple-500/20 border-purple-400/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-purple-400" />
          <span>أفق الفضاء العميق</span>
        </button>

        <button
          onClick={() => handleSelectSound('cyber_rain')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
            ambientType === 'cyber_rain'
              ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
          <span>مطر سيبراني ناعم</span>
        </button>

        {ambientType !== 'none' && (
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <button
              onClick={() => handleSelectSound('none')}
              className="text-[10px] text-rose-400 hover:underline mr-1"
            >
              إيقاف
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
