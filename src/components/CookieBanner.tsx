import React, { useState, useEffect } from 'react';
import { Cookie, Check, Shield } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('cyber_cookie_consent_accepted');
    if (!consent) {
      // Show with slight delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cyber_cookie_consent_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-2xl glass-panel-glow border border-cyan-500/40 shadow-2xl bg-[#090e1a]/95 text-xs text-slate-200 flex flex-col gap-3"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <span className="font-bold text-slate-100 block mb-0.5">إشعار الخصوصية والتخزين المحلي:</span>
          يستخدم هذا المركز التخزين المحلي الآمن (LocalStorage) فقط لحفظ أداء مؤقت بومودورو وقائمة مهامك دون أي ملفات تتبع أو إعلانات خارجية.
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
        <button
          onClick={handleAccept}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all text-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>موافق ومتابعة</span>
        </button>
      </div>
    </div>
  );
};
