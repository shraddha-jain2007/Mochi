import { useRef, useState, useCallback } from 'react';

export type SoundType = 'rain' | 'ocean' | 'cafe' | 'whitenoise';

function createWhiteNoise(ctx: AudioContext, secs = 4) {
  const sz     = ctx.sampleRate * secs;
  const buf    = ctx.createBuffer(1, sz, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < sz; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function createBrownNoise(ctx: AudioContext, secs = 4) {
  const sz   = ctx.sampleRate * secs;
  const buf  = ctx.createBuffer(1, sz, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last   = 0;
  for (let i = 0; i < sz; i++) {
    const w = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * w) / 1.02;
    last     = data[i];
    data[i] *= 3.5;
  }
  return buf;
}

export function useAmbientSound() {
  const ctxRef    = useRef<AudioContext | null>(null);
  const srcRef    = useRef<AudioBufferSourceNode | null>(null);
  const gainRef   = useRef<GainNode | null>(null);
  const lfoRef    = useRef<OscillatorNode | null>(null);
  const [playing,   setPlaying]   = useState(false);
  const [soundType, setSoundType] = useState<SoundType | null>(null);
  const [volume,    setVolState]  = useState(0.45);

  const stop = useCallback(() => {
    try {
      lfoRef.current?.stop();
      srcRef.current?.stop();
    } catch (_) {}
    srcRef.current  = null;
    lfoRef.current  = null;
    setPlaying(false);
    setSoundType(null);
  }, []);

  const play = useCallback((type: SoundType, vol = volume) => {
    // Clean up previous
    try { lfoRef.current?.stop(); srcRef.current?.stop(); } catch (_) {}

    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode       = ctx.createGain();
    gainNode.gain.value  = vol;
    gainNode.connect(ctx.destination);
    gainRef.current      = gainNode;

    const src  = ctx.createBufferSource();
    src.loop   = true;

    if (type === 'rain') {
      // White noise → bandpass → highshelf cut → gain
      src.buffer = createWhiteNoise(ctx, 3);
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass';
      bp.frequency.value = 2800;
      bp.Q.value  = 0.7;
      const hs   = ctx.createBiquadFilter();
      hs.type    = 'highshelf';
      hs.frequency.value = 6000;
      hs.gain.value      = -14;
      src.connect(bp); bp.connect(hs); hs.connect(gainNode);

    } else if (type === 'ocean') {
      // Brown noise → lowpass + slow LFO on gain (waves)
      src.buffer = createBrownNoise(ctx, 5);
      const lp   = ctx.createBiquadFilter();
      lp.type    = 'lowpass';
      lp.frequency.value = 600;

      const lfo       = ctx.createOscillator();
      lfo.type        = 'sine';
      lfo.frequency.value = 0.18;
      const lfoGain   = ctx.createGain();
      lfoGain.gain.value  = vol * 0.35;
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
      lfoRef.current  = lfo;

      src.connect(lp); lp.connect(gainNode);

    } else if (type === 'cafe') {
      // Brown noise → low-pass → gentle peaking filter (chatter)
      src.buffer = createBrownNoise(ctx, 4);
      const lp   = ctx.createBiquadFilter();
      lp.type    = 'lowpass';
      lp.frequency.value = 1800;
      const pk   = ctx.createBiquadFilter();
      pk.type    = 'peaking';
      pk.frequency.value = 900;
      pk.gain.value      = 6;
      pk.Q.value  = 0.5;
      src.connect(lp); lp.connect(pk); pk.connect(gainNode);

    } else {
      // Pure white noise
      src.buffer = createWhiteNoise(ctx, 3);
      src.connect(gainNode);
    }

    src.start();
    srcRef.current  = src;
    setPlaying(true);
    setSoundType(type);
  }, [volume]);

  const toggle = useCallback((type: SoundType) => {
    if (playing && soundType === type) stop();
    else play(type);
  }, [playing, soundType, play, stop]);

  const setVolume = useCallback((v: number) => {
    setVolState(v);
    if (gainRef.current) gainRef.current.gain.value = v;
  }, []);

  return { playing, soundType, toggle, stop, volume, setVolume };
}
