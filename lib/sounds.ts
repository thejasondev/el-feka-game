/**
 * Sound effects engine for EL FEKA game
 * Uses Web Audio API with oscillator-based sounds (no external files needed)
 * Optimized for mobile: lazy AudioContext init, unlocks on first user interaction
 */

let audioContext: AudioContext | null = null;
let isMuted = false;

// Load mute preference from localStorage
if (typeof window !== "undefined") {
  isMuted = localStorage.getItem("elfeka-muted") === "true";
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    } catch {
      return null;
    }
  }
  // Resume suspended context (iOS requirement)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// Base note player
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.3,
  delay: number = 0,
) {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0;

  osc.connect(gain);
  gain.connect(ctx.destination);

  const startTime = ctx.currentTime + delay;
  // Fade in
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  // Fade out
  gain.gain.setValueAtTime(volume, startTime + duration - 0.05);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Noise burst for percussive sounds
function playNoise(duration: number, volume: number = 0.15, delay: number = 0) {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // Decaying noise
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 3000;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const startTime = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  source.start(startTime);
}

export const sounds = {
  /** Unlock audio on iOS — call on first user interaction */
  unlock: () => {
    const ctx = getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
  },

  /** Toggle mute state */
  toggleMute: () => {
    isMuted = !isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("elfeka-muted", String(isMuted));
    }
    return isMuted;
  },

  /** Get mute state */
  getMuted: () => isMuted,

  /** Set mute state */
  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("elfeka-muted", String(muted));
    }
  },

  /** Subtle UI tap — for button presses */
  tap: () => {
    playTone(800, 0.06, "sine", 0.1);
  },

  /** Swipe progress tick — rising pitch */
  swipeTick: (progress: number) => {
    const freq = 400 + progress * 600; // 400Hz → 1000Hz
    playTone(freq, 0.04, "sine", 0.08);
  },

  /** Role reveal — dramatic ascending sweep */
  reveal: () => {
    playTone(300, 0.15, "triangle", 0.2, 0);
    playTone(500, 0.15, "triangle", 0.25, 0.1);
    playTone(800, 0.3, "triangle", 0.3, 0.2);
    playNoise(0.1, 0.08, 0.2);
  },

  /** FEKA reveal — ominous descending tone */
  revealFeka: () => {
    playTone(600, 0.2, "sawtooth", 0.15, 0);
    playTone(350, 0.2, "sawtooth", 0.2, 0.15);
    playTone(200, 0.4, "sawtooth", 0.25, 0.3);
    playNoise(0.15, 0.1, 0.3);
  },

  /** Timer tick — subtle metronome */
  timerTick: () => {
    playTone(1200, 0.03, "sine", 0.06);
  },

  /** Timer critical — faster, more urgent tick */
  timerCritical: () => {
    playTone(1500, 0.05, "square", 0.1);
  },

  /** Time's up — alarm buzzer */
  timesUp: () => {
    playTone(880, 0.15, "square", 0.2, 0);
    playTone(0, 0.05, "square", 0, 0.15);
    playTone(880, 0.15, "square", 0.2, 0.2);
    playTone(0, 0.05, "square", 0, 0.35);
    playTone(880, 0.3, "square", 0.25, 0.4);
    playNoise(0.2, 0.12, 0.4);
  },

  /** Victory fanfare — REALES win */
  victory: () => {
    playTone(523, 0.15, "triangle", 0.25, 0); // C5
    playTone(659, 0.15, "triangle", 0.25, 0.15); // E5
    playTone(784, 0.15, "triangle", 0.25, 0.3); // G5
    playTone(1047, 0.4, "triangle", 0.3, 0.45); // C6
    playNoise(0.08, 0.06, 0.45);
  },

  /** Defeat — FEKA wins */
  defeat: () => {
    playTone(400, 0.2, "sawtooth", 0.15, 0);
    playTone(350, 0.2, "sawtooth", 0.15, 0.2);
    playTone(300, 0.3, "sawtooth", 0.2, 0.4);
    playTone(200, 0.5, "sawtooth", 0.15, 0.6);
  },

  /** Neutral reveal — for skip voting mode */
  neutralReveal: () => {
    playTone(500, 0.15, "triangle", 0.2, 0);
    playTone(650, 0.2, "triangle", 0.25, 0.15);
    playNoise(0.1, 0.06, 0.15);
  },

  /** Vote cast — quick confirmation */
  voteCast: () => {
    playTone(600, 0.08, "triangle", 0.15);
    playTone(900, 0.12, "triangle", 0.2, 0.08);
  },

  /** Game start — let's go! */
  gameStart: () => {
    playTone(440, 0.1, "triangle", 0.2, 0);
    playTone(550, 0.1, "triangle", 0.2, 0.1);
    playTone(660, 0.1, "triangle", 0.2, 0.2);
    playTone(880, 0.3, "triangle", 0.3, 0.3);
  },
};

export default sounds;
