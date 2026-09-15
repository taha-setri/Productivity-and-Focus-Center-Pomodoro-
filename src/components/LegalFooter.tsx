import React, { useState, useEffect } from 'react';
import { Cookie, ShieldAlert, X, Check, FileText } from 'lucide-react';

interface LegalFooterProps {
  onOpenCookiesModal?: () => void;
  onOpenDisclaimerModal?: () => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({
  onOpenCookiesModal,
  onOpenDisclaimerModal,
}) => {
  return (
    <footer
      id="app-legal-footer"
      className="mt-14 pt-8 pb-12 border-t border-slate-900/90 text-xs text-slate-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Upper row: Founder credits & Quick legal buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/60 to-slate-900/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-slate-300 font-normal">المؤسس والمطور:</span>
              <span className="text-cyan-300 font-bold tracking-wide">
                طه ستري (Taha Setri)
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              id="btn-open-disclaimer"
              onClick={onOpenDisclaimerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>إخلاء المسؤولية</span>
            </button>

            <button
              id="btn-open-cookies"
              onClick={onOpenCookiesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              <Cookie className="w-3.5 h-3.5 text-cyan-400" />
              <span>سياسة الكوكيز والخصوصية</span>
            </button>
          </div>
        </div>

        {/* Disclaimer summary paragraph */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900/80 leading-relaxed text-[11px] text-slate-500 space-y-2">
          <p>
            <strong className="text-slate-400">إخلاء المسؤولية القانونية:</strong> تم تطوير هذا التطبيق كأداة مساعدة للإنتاجية الشخصية والتركيز الذهني وفق تقنية البومودورو (Pomodoro Technique®). التطبيق غير تابع ولا معتمد رسمياً من قِبل أصحاب العلامات التجارية المسجلة لتقنية بومودورو. جميع البيانات والملاحظات والمهام تخزن فقط داخل المتصفح الخاص بك (LocalStorage) ولا يتم تجميعها أو مشاركتها على خوادم خارجية.
          </p>
          <p>
            <strong className="text-slate-400">ملفات تعريف الارتباط (Cookies & LocalStorage):</strong> لا يستخدم التطبيق أي ملفات تعريف ارتباط للتتبع الإعلاني أو أدوات تحليل أطراف ثالثة تخرق الخصوصية. يقتصر الاستخدام التقني فقط على وحدة التخزين المحلي للمتصفح لحفظ حالة المؤقت، تفضيلات الصوت، وقائمة مهامك أثناء الجلسات.
          </p>
        </div>

        {/* Bottom copyright & rights */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 pt-2 border-t border-slate-900/50">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — مركز الإنتاجية والتركيز. ابتكار وتطوير: <span className="text-slate-400 font-medium">طه ستري (Taha Setri)</span>
          </div>

          <div className="flex items-center gap-3 font-mono-cyber">
            <span>NETWORK: CRYPTO-TRACKER // ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface LegalModalsProps {
  activeModal: 'disclaimer' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {activeModal === 'disclaimer' ? (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              ) : (
                <Cookie className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {activeModal === 'disclaimer' ? 'إخلاء المسؤولية' : 'سياسة الكوكيز والتخزين المحلي'}
              </h3>
              <p className="text-xs text-slate-400">
                المؤسس: طه ستري (Taha Setri)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeModal === 'disclaimer' ? (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-[11px]">
              تنبيه قانوني وإرشادي للمستخدمين
            </div>
            <p>
              1. <strong>الأهداف التعليمية والإنتاجية:</strong> يقدم هذا الموقع أدوات تنظيم الوقت وتوليد بيئة صوتية للتركيز "كما هي" دون أي ضمانات صريحة أو ضمنية لتحقيق مستويات إنتاجية معينة.
            </p>
            <p>
              2. <strong>العلامات التجارية:</strong> تقنية "Pomodoro" هي علامة تجارية مسجلة لمبتكرها Francesco Cirillo. هذا التطبيق هو تنفيذ واجهات برمجي مستقل مستوحى من المفهوم المفتوح لإدارة الوقت ولا يدعي أي رعاية أو انتساب رسمي.
            </p>
            <p>
              3. <strong>الروابط الخارجية والشبكة:</strong> الروابط المدرجة في شريط الشبكة (مثل رابط متتبع العملات المشفرة) تؤدي إلى مواقع خارجية، ولا يتحمل التطبيق أي مسؤولية عن محتوى أو خدمات تلك المواقع الخارجية.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-[11px]">
              احترام الخصوصية صفر تتبع (Zero Tracking)
            </div>
            <p>
              1. <strong>استخدام الـ LocalStorage:</strong> نعتمد فقط على التخزين المحلي الآمن داخل متصفحك لحفظ قائمة المهام، عدد الدورات المنجزة، وتفضيلات الصوتيات.
            </p>
            <p>
              2. <strong>ملفات تعريف الارتباط (Cookies):</strong> لا نستخدم أي ملفات كوكيز إعلانية، تسويقية، أو ملفات تتبع سلوكية تابعة لشركات أخرى.
            </p>
            <p>
              3. <strong>التحكم بالبيانات:</strong> يمكنك في أي وقت مسح بيانات المهام إما بالنقر على زر مسح المهام داخل التطبيق، أو عبر مسح بيانات التصفح لمتصفحك.
            </p>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-semibold transition-all"
          >
            إغلاق ومتابعة
          </button>
        </div>
      </div>
    </div>
  );
};
