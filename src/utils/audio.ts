/**
 * Futuristic Web Audio Synthesizer
 * Generates pristine harmonic bells, tactile clicks, and focus drone audio
 * entirely through the browser's Web Audio API without external file dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle tactile cyber click
export function playClickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Audio may be blocked before first user gesture
  }
}

// Resonant crystal completion chime (played when timer completes)
export function playCompletionChime(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell envelope
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 2.0);
    });
  } catch {
    // AudioContext fallback
  }
}

// Ambient Audio Engine
let ambientNodes: {
  source?: AudioNode;
  gainNode?: GainNode;
  filterNode?: BiquadFilterNode;
  osc1?: OscillatorNode;
  osc2?: OscillatorNode;
} | null = null;

export function setAmbientSound(type: 'none' | 'deep_space' | 'binaural_focus' | 'cyber_rain', volume = 0.3) {
  try {
    const ctx = getAudioContext();

    // Stop current ambient if running
    if (ambientNodes) {
      if (ambientNodes.gainNode) {
        ambientNodes.gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        try {
          ambientNodes?.osc1?.stop();
          ambientNodes?.osc2?.stop();
        } catch {
          // Ignore stop errors
        }
        ambientNodes = null;
      }, 600);
    }

    if (type === 'none') return;

    if (type === 'binaural_focus') {
      // 200 Hz carrier and 240 Hz carrier for 40Hz Gamma Focus frequency
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(240, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.08, ctx.currentTime + 1.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ambientNodes = { osc1, osc2, gainNode: gain };
    } else if (type === 'deep_space') {
      // Low drone with warm harmonics
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(98.0, ctx.currentTime); // G2

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ambientNodes = { osc1, osc2, gainNode: gain, filterNode: filter };
    } else if (type === 'cyber_rain') {
      // White/pink noise buffer generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 1);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      ambientNodes = { source: whiteNoise, gainNode: gain, filterNode: filter };
    }
  } catch {
    // AudioContext blocked
  }
}
