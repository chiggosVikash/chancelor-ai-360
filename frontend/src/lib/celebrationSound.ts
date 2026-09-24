// [SOLID: SRP] — celebrationSound synthesizes a soothing, crystalline celebratory chime and gentle sparkle using Web Audio API
// [YAGNI] — Procedural harmonic synthesis avoids audio downloads while guaranteeing a calm, soothing acoustic experience

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Ensures audio context is resumed on user interaction
 */
export function unlockAudioContext(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return Promise.resolve(false);
  if (ctx.state === "suspended") {
    return ctx.resume().then(() => true).catch(() => false);
  }
  return Promise.resolve(true);
}

/**
 * Plays a single, soothing bell/chime note with a warm sine envelope
 * @param frequency Note frequency in Hz
 * @param time Scheduled start time
 * @param duration Decay duration in seconds
 * @param volume Master gain (subtle, peaceful)
 */
function playChimeNote(
  ctx: AudioContext,
  frequency: number,
  time: number,
  duration = 1.4,
  volume = 0.15
) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pure, warm sine wave tone
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, time);

    // Soft attack (20ms) to prevent any clicking, followed by gentle, soothing exponential decay
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    // Gentle lowpass filter to keep the tone warm and rounded
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(frequency * 2.5, time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  } catch (err) {
    console.debug("Chime audio skipped:", err);
  }
}

/**
 * Plays a soft, delicate champagne sparkle / effervescence shimmer
 */
function playSoftShimmer(ctx: AudioContext, time: number, volume = 0.035) {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter gives it an airy, soothing sparkle
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3500, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
  } catch (err) {
    console.debug("Shimmer audio skipped:", err);
  }
}

/**
 * Plays a single soothing celebratory chime
 */
export function playCrackerBlast(volume = 0.16): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  playChimeNote(ctx, 783.99, now, 1.2, volume); // G5 gentle bell
  playSoftShimmer(ctx, now, volume * 0.25);
}

/**
 * Triggers a simple, soothing pentatonic celebration chime chord that blooms musically with the confetti
 */
export function playFirecrackerSequence(): void {
  unlockAudioContext().then(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.02;

    // Peaceful, uplifting pentatonic chime arpeggio:
    // C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz) -> B5 (987.77Hz) -> C6 (1046.5Hz)
    const notes = [
      { freq: 523.25, delay: 0.0,  duration: 1.4, vol: 0.14 },
      { freq: 659.25, delay: 0.12, duration: 1.5, vol: 0.15 },
      { freq: 783.99, delay: 0.24, duration: 1.6, vol: 0.16 },
      { freq: 987.77, delay: 0.38, duration: 1.7, vol: 0.14 },
      { freq: 1046.5, delay: 0.52, duration: 1.8, vol: 0.13 },
    ];

    notes.forEach((n) => {
      playChimeNote(ctx, n.freq, now + n.delay, n.duration, n.vol);
    });

    // Soft airy shimmer aligned with the apex of the confetti
    playSoftShimmer(ctx, now + 0.2, 0.04);
  });
}
