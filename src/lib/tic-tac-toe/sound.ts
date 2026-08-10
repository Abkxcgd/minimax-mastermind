/** Tiny WebAudio blips — no external assets required. */

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  return context;
}

export type SoundName = "place" | "ai" | "win" | "lose" | "draw";

const TONES: Record<SoundName, { freq: number; duration: number; type: OscillatorType }> = {
  place: { freq: 620, duration: 0.09, type: "triangle" },
  ai: { freq: 420, duration: 0.09, type: "sine" },
  win: { freq: 880, duration: 0.28, type: "square" },
  lose: { freq: 180, duration: 0.3, type: "sawtooth" },
  draw: { freq: 320, duration: 0.2, type: "sine" },
};

export function playSound(name: SoundName): void {
  const ctx = getContext();
  if (!ctx) return;
  void ctx.resume();

  const { freq, duration, type } = TONES[name];
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.02);
}
