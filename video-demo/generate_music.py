#!/usr/bin/env python3
"""
Generate a simple chill background track for the QuoteSnap demo.
Uses only numpy + built-in wave module (no scipy needed).
"""

import wave
import struct
import numpy as np
from pathlib import Path

OUTPUT = Path(__file__).parent / "assets" / "bg_music.wav"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

SAMPLE_RATE = 44100

def note_freq(n):
    """MIDI note number to frequency."""
    return 440.0 * (2.0 ** ((n - 69) / 12.0))

# Cmaj7 -> Fmaj7 -> Am7 -> G7 progression
CHORDS = [
    # Cmaj7: C4 E4 G4 B4
    ([60, 64, 67, 71], 4.0),
    # Fmaj7: F4 A4 C5 E5
    ([65, 69, 72, 76], 4.0),
    # Am7: A4 C5 E5 G5
    ([69, 72, 76, 79], 4.0),
    # G7: G4 B4 D5 F5
    ([67, 71, 74, 77], 4.0),
]

def synth_pad(freq, duration, sample_rate):
    """Soft synth pad: sum of sine + slight detune + slow amplitude envelope."""
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Main tone + slight detune for warmth
    signal = np.sin(2 * np.pi * freq * t)
    signal += 0.3 * np.sin(2 * np.pi * freq * 1.003 * t)
    signal += 0.2 * np.sin(2 * np.pi * freq * 0.997 * t)
    
    # Slow attack + release envelope
    attack = int(sample_rate * 0.8)
    release = int(sample_rate * 0.8)
    env = np.ones_like(t)
    if attack > 0:
        env[:attack] = np.linspace(0, 1, attack)
    if release > 0:
        env[-release:] = np.linspace(1, 0, release)
    
    return signal * env

def make_track(duration_sec, sample_rate):
    total_samples = int(sample_rate * duration_sec)
    track = np.zeros(total_samples, dtype=np.float64)
    
    # Build chord progression loop
    chord_idx = 0
    t_offset = 0.0
    
    while t_offset < duration_sec:
        notes, chord_dur = CHORDS[chord_idx % len(CHORDS)]
        chord_idx += 1
        
        # Pad each chord to fill its duration
        actual_dur = min(chord_dur, duration_sec - t_offset)
        if actual_dur <= 0:
            break
        
        start_sample = int(t_offset * sample_rate)
        end_sample = min(start_sample + int(actual_dur * sample_rate), total_samples)
        chord_samples = end_sample - start_sample
        
        chord_signal = np.zeros(chord_samples, dtype=np.float64)
        
        for note in notes:
            freq = note_freq(note)
            pad = synth_pad(freq, actual_dur, sample_rate)
            chord_signal += pad[:chord_samples]
        
        # Bass note (root, one octave down)
        bass_freq = note_freq(notes[0] - 12)
        bass = synth_pad(bass_freq, actual_dur, sample_rate)
        chord_signal += 0.6 * bass[:chord_samples]
        
        track[start_sample:end_sample] += chord_signal * 0.12
        t_offset += chord_dur
    
    # Simple gentle percussion-like element (soft kick every beat)
    bpm = 80
    beat_interval = 60.0 / bpm
    for beat_time in np.arange(0, duration_sec, beat_interval):
        start = int(beat_time * sample_rate)
        kick_len = int(0.15 * sample_rate)
        if start + kick_len > total_samples:
            break
        t = np.linspace(0, 0.15, kick_len, endpoint=False)
        kick = np.sin(2 * np.pi * 60 * t) * np.exp(-t * 20)
        track[start:start + kick_len] += kick * 0.08
    
    # Soft hi-hat every off-beat
    for beat_time in np.arange(beat_interval / 2, duration_sec, beat_interval):
        start = int(beat_time * sample_rate)
        hat_len = int(0.05 * sample_rate)
        if start + hat_len > total_samples:
            break
        noise = np.random.normal(0, 1, hat_len)
        env = np.exp(-np.linspace(0, 5, hat_len))
        track[start:start + hat_len] += noise * env * 0.02
    
    # Normalize
    peak = np.max(np.abs(track))
    if peak > 0:
        track = track / peak * 0.3  # keep it quiet (background level)
    
    return track

def save_wav(data, path, sample_rate):
    """Save numpy array as 16-bit mono WAV."""
    # Clip to [-1, 1] and convert to int16
    data = np.clip(data, -1.0, 1.0)
    int_data = (data * 32767).astype(np.int16)
    
    with wave.open(str(path), "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        f.writeframes(int_data.tobytes())

if __name__ == "__main__":
    print("Generating background music...")
    # Default 45s, can be overridden
    duration = 45.0
    track = make_track(duration, SAMPLE_RATE)
    save_wav(track, OUTPUT, SAMPLE_RATE)
    print(f"✅ Saved: {OUTPUT} ({duration:.0f}s)")
