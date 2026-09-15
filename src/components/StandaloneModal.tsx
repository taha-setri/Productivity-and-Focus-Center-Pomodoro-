import React, { useState } from 'react';
import { Copy, Check, Download, X, Code, ExternalLink, ShieldCheck } from 'lucide-react';

interface StandaloneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneModal: React.FC<StandaloneModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مركز الإنتاجية والتركيز (بومودورو) | Cyber Focus Station</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070B13;
      --card-bg: rgba(13, 19, 33, 0.75);
      --border: rgba(56, 189, 248, 0.2);
      --cyan: #06b6d4;
      --emerald: #10b981;
      --amber: #f59e0b;
      --text: #e2e8f0;
      --text-dim: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', system-ui, sans-serif; }
    body { background-color: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    /* Network Bar */
    .network-bar {
      background: rgba(7, 11, 19, 0.9);
      border-bottom: 1px solid var(--border);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .badge-active {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.4);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      color: var(--cyan);
    }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan); animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
    
    .tracker-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(6, 182, 212, 0.15));
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fde68a;
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      transition: all 0.3s ease;
    }
    .tracker-link:hover {
      border-color: var(--cyan);
      color: #fff;
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
    }

    /* Layout */
    .container { max-width: 1140px; margin: 0 auto; padding: 24px 16px; flex: 1; display: flex; flex-direction: column; gap: 24px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
    
    /* Cards */
    .glass-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    /* Timer Controls */
    .mode-tabs { display: flex; gap: 8px; background: rgba(9, 14, 24, 0.8); padding: 6px; border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05); }
    .tab-btn { flex: 1; padding: 8px 12px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: var(--text-dim); font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .tab-btn.active { background: rgba(6, 182, 212, 0.2); color: var(--cyan); border-color: rgba(6, 182, 212, 0.5); font-weight: 700; box-shadow: 0 0 12px rgba(6, 182, 212, 0.3); }

    .ring-wrapper { position: relative; width: 280px; height: 280px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
    .ring-wrapper svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .ring-bg { stroke: #162032; stroke-width: 10; fill: transparent; }
    .ring-val { stroke: var(--cyan); stroke-width: 10; fill: transparent; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; filter: drop-shadow(0 0 8px var(--cyan)); }
    .countdown-text { position: absolute; text-align: center; }
    .time-digits { font-size: 54px; font-weight: 700; letter-spacing: -1px; text-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }

    .btn-main { background: linear-gradient(135deg, #06b6d4, #0284c7); color: #070B13; border: none; padding: 12px 32px; border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); transition: transform 0.2s; }
    .btn-main:active { transform: scale(0.96); }
    .btn-icon { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); width: 44px; height: 44px; border-radius: 12px; cursor: pointer; font-size: 16px; }

    /* Task List */
    .task-input-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .task-input { flex: 1; background: rgba(9, 14, 24, 0.8); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; color: #fff; outline: none; }
    .task-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(10, 15, 28, 0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; margin-bottom: 8px; transition: all 0.2s; }
    .task-item.completed { opacity: 0.5; text-decoration: line-through; }
  </style>
</head>
<body>
  <!-- Network Bar -->
  <header class="network-bar">
    <div style="display:flex; align-items:center; gap:12px;">
      <span class="badge-active font-mono">
        <span class="pulse-dot"></span>
        MATRIX NETWORK ONLINE
      </span>
      <span class="font-mono" style="font-size:11px; color:#64748b;">LATENCY: 22ms</span>
    </div>
    <a href="https://rypto-tracker.vercel.app/" target="_blank" class="tracker-link">
      ⚡ الموقع السابق في الشبكة (rypto-tracker.vercel.app) ↗
    </a>
  </header>

  <main class="container">
    <div style="text-align:center; margin-bottom:12px;">
      <h1 style="font-size:28px; font-weight:800; background:linear-gradient(to left, #38bdf8, #06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
        مركز الإنتاجية والتركيز (بومودورو)
      </h1>
      <p style="color:#94a3b8; font-size:14px; margin-top:4px;">واجهة هادئة خالية من الإلهاءات مع نبضات ضوئية ومؤثرات صوتية</p>
    </div>

    <div class="grid">
      <!-- Timer -->
      <section class="glass-card" style="text-align:center;">
        <div class="mode-tabs">
          <button class="tab-btn active" onclick="setMode('pomodoro', 25)">تركيز (25 دقيقة)</button>
          <button class="tab-btn" onclick="setMode('shortBreak', 5)">استراحة (5 دقائق)</button>
          <button class="tab-btn" onclick="setMode('longBreak', 15)">طويلة (15 دقيقة)</button>
        </div>

        <div class="ring-wrapper">
          <svg viewBox="0 0 280 280">
            <circle class="ring-bg" cx="140" cy="140" r="115"></circle>
            <circle id="progress-circle" class="ring-val" cx="140" cy="140" r="115" stroke-dasharray="722.5" stroke-dashoffset="0"></circle>
          </svg>
          <div class="countdown-text">
            <div id="countdown" class="time-digits font-mono">25:00</div>
            <div id="mode-badge" style="color:#06b6d4; font-size:12px; margin-top:4px;">جلسة تركيز عميق</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; align-items:center; gap:16px; margin-top:28px;">
          <button class="btn-icon" onclick="resetTimer()" title="إعادة الضبط">↺</button>
          <button id="play-btn" class="btn-main" onclick="toggleTimer()">بدء الجلسة</button>
          <button class="btn-icon" onclick="skipMode()" title="التالي">⏭</button>
        </div>
      </section>

      <!-- Task List -->
      <section class="glass-card">
        <h2 style="font-size:18px; margin-bottom:12px; display:flex; justify-content:space-between;">
          <span>قائمة المهام الذكية</span>
          <span class="font-mono" style="font-size:11px; color:#06b6d4;">LOCALSTORAGE ACTIVE</span>
        </h2>
        <form onsubmit="addTask(event)" class="task-input-row">
          <input id="task-input" class="task-input" placeholder="أضف مهمة جديدة واضغط Enter..." required>
          <button type="submit" class="btn-main" style="padding:10px 18px; font-size:14px;">إضافة</button>
        </form>
        <div id="tasks-container" style="max-height:300px; overflow-y:auto;"></div>
      </section>
    </div>

    <!-- Footer with Founder Name, Disclaimer and Cookies info -->
    <footer style="margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.08); font-size:12px; color:#64748b;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
        <div>
          <span style="color:#94a3b8;">المؤسس والمطور:</span>
          <strong style="color:#06b6d4; margin-right:6px;">طه ستري (Taha Setri)</strong>
        </div>
        <div style="color:#94a3b8; font-size:11px;">
          الموقع السابق في الشبكة: <a href="https://rypto-tracker.vercel.app/" target="_blank" style="color:#38bdf8; text-decoration:none;">rypto-tracker.vercel.app ↗</a>
        </div>
      </div>
      <div style="background:rgba(0,0,0,0.3); padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); font-size:11px; line-height:1.6;">
        <p style="margin-bottom:6px;"><strong style="color:#cbd5e1;">إخلاء المسؤولية:</strong> تم تطوير هذا التطبيق كأداة إنتاجية وتنظيم وقت شخصية وفق أسلوب بومودورو. التطبيق مستقل وغير مرتبط بأي جهة تجارية. جميع البيانات والملاحظات تحفظ محلياً على جهازك دون إرسالها لأي خادم.</p>
        <p><strong style="color:#cbd5e1;">سياسة الكوكيز والخصوصية:</strong> لا يستخدم الموقع أي ملفات كوكيز تتبعية أو إعلانية. الاعتماد بالكامل على LocalStorage لحفظ إعدادات المؤقت والمهام فقط.</p>
      </div>
    </footer>
  </main>

  <script>
    let mode = 'pomodoro';
    let totalSecs = 25 * 60;
    let leftSecs = totalSecs;
    let isRunning = false;
    let timerId = null;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playChime() {
      try {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 1.2);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + i * 0.12);
          osc.stop(audioCtx.currentTime + i * 0.12 + 1.4);
        });
      } catch(e){}
    }

    function updateDisplay() {
      const m = Math.floor(leftSecs / 60).toString().padStart(2, '0');
      const s = (leftSecs % 60).toString().padStart(2, '0');
      document.getElementById('countdown').textContent = m + ':' + s;
      const circ = 2 * Math.PI * 115;
      const offset = circ - (1 - leftSecs / totalSecs) * circ;
      document.getElementById('progress-circle').style.strokeDashoffset = offset;
    }

    function toggleTimer() {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      isRunning = !isRunning;
      document.getElementById('play-btn').textContent = isRunning ? 'إيقاف مؤقت' : 'متابعة';
      if (isRunning) {
        timerId = setInterval(() => {
          if (leftSecs > 0) {
            leftSecs--;
            updateDisplay();
          } else {
            clearInterval(timerId);
            isRunning = false;
            document.getElementById('play-btn').textContent = 'بدء الجلسة';
            playChime();
            alert('اكتملت الجلسة بنجاح! أحسنت عملاً.');
          }
        }, 1000);
      } else {
        clearInterval(timerId);
      }
    }

    function resetTimer() {
      clearInterval(timerId);
      isRunning = false;
      document.getElementById('play-btn').textContent = 'بدء الجلسة';
      leftSecs = totalSecs;
      updateDisplay();
    }

    function setMode(m, mins) {
      mode = m;
      totalSecs = mins * 60;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      resetTimer();
    }

    // Tasks with LocalStorage
    let tasks = JSON.parse(localStorage.getItem('focus_tasks') || '[]');
    function renderTasks() {
      const c = document.getElementById('tasks-container');
      c.innerHTML = tasks.map((t, idx) => \`
        <div class="task-item \${t.done ? 'completed' : ''}" onclick="toggleTask(\${idx})">
          <span>\${t.title}</span>
          <button onclick="deleteTask(event, \${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer;">✕</button>
        </div>
      \`).join('');
      localStorage.setItem('focus_tasks', JSON.stringify(tasks));
    }
    function addTask(e) {
      e.preventDefault();
      const input = document.getElementById('task-input');
      if (!input.value.trim()) return;
      tasks.push({ title: input.value.trim(), done: false });
      input.value = '';
      renderTasks();
    }
    function toggleTask(i) { tasks[i].done = !tasks[i].done; renderTasks(); }
    function deleteTask(e, i) { e.stopPropagation(); tasks.splice(i, 1); renderTasks(); }
    renderTasks();
    updateDisplay();
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pomodoro-focus-center.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="standalone-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 flex flex-col gap-5 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                تصدير التطبيق في ملف HTML واحد مستقل (Standalone)
              </h3>
              <p className="text-xs text-slate-400">
                ملف مستقل بالكامل يحتوي على CSS و JavaScript مدمجين للعمل أوفلاين دون إنترنت
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

        <p className="text-xs text-slate-300 leading-relaxed">
          يمكنك تشغيل هذا التطبيق مباشرة داخل المتصفح، أو نسخ الكود البرمجي المدمج في ملف <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">index.html</code> واحد مستقل تماماً ليشتغل في أي جهاز بدون أي خوادم أو تثبيت برامج:
        </p>

        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 max-h-52 overflow-y-auto font-mono text-[11px] text-slate-400 dir-ltr text-left">
          <pre>{standaloneHtmlCode.slice(0, 1000)} ... [كامل الكود متوفر للتنزيل]</pre>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-300 text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ للحافظة!' : 'نسخ كود HTML كاملاً'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف index.html</span>
          </button>
        </div>
      </div>
    </div>
  );
};
