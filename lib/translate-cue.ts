import type { TranslatePhase } from '@/lib/realtime-translate'

/** A cue marks the spoken translation, not the Start or End button. */
export function translationCue(previous: TranslatePhase, next: TranslatePhase): 'start' | 'end' | null {
  if (next === 'translating' && previous !== 'translating') return 'start'
  if (previous === 'translating' && next === 'listening') return 'end'
  return null
}

type CueKind = 'start' | 'end' | 'doctor' | 'patient'

const clips = new Map<CueKind, HTMLAudioElement>()

function sineWav(notes: Array<{ frequency: number; ms: number }>, peak: number): string {
  const sampleRate = 22050
  const rendered = notes.map((note) => {
    const count = Math.max(1, Math.floor((sampleRate * note.ms) / 1000))
    const samples = new Int16Array(count)
    for (let index = 0; index < count; index += 1) {
      const envelope = Math.sin(Math.PI * (index / count))
      const wave = Math.sin((2 * Math.PI * note.frequency * index) / sampleRate)
      samples[index] = Math.round(wave * envelope * peak * 32767)
    }
    return samples
  })
  const total = rendered.reduce((sum, samples) => sum + samples.length, 0)
  const bytes = new Uint8Array(44 + total * 2)
  const view = new DataView(bytes.buffer)
  const write = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) bytes[offset + index] = text.charCodeAt(index)
  }
  write(0, 'RIFF')
  view.setUint32(4, 36 + total * 2, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, total * 2, true)
  let offset = 44
  for (const samples of rendered) {
    for (let index = 0; index < samples.length; index += 1) {
      view.setInt16(offset, samples[index], true)
      offset += 2
    }
  }
  let binary = ''
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index])
  return `data:audio/wav;base64,${btoa(binary)}`
}

const sources: Record<CueKind, () => string> = {
  start: () => sineWav([{ frequency: 1046, ms: 90 }], 0.16),
  end: () => sineWav([{ frequency: 659, ms: 130 }, { frequency: 523, ms: 170 }], 0.1),
  doctor: () => sineWav([{ frequency: 523, ms: 110 }, { frequency: 784, ms: 150 }], 0.42),
  patient: () => sineWav(
    [{ frequency: 349, ms: 90 }, { frequency: 440, ms: 90 }, { frequency: 523, ms: 150 }],
    0.42,
  ),
}

function clip(kind: CueKind): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null
  const existing = clips.get(kind)
  if (existing) return existing
  const audio = new Audio(sources[kind]())
  audio.preload = 'auto'
  audio.setAttribute('playsinline', 'true')
  if (typeof document !== 'undefined') {
    audio.hidden = true
    document.body.appendChild(audio)
  }
  clips.set(kind, audio)
  return audio
}

let playback = 0

/** Call from a click, before any await, so a later chime is allowed to play. */
export function unlockTranslateCue(): void {
  for (const kind of ['end', 'doctor', 'patient', 'start'] as const) {
    const audio = clip(kind)
    if (!audio) continue
    const token = playback
    audio.muted = true
    try {
      audio.currentTime = 0
    } catch {
      // Ignore until the clip has data.
    }
    void audio.play()?.finally(() => {
      if (playback !== token) return
      audio.pause()
      audio.currentTime = 0
      audio.muted = false
    })
  }
}

function playNow(kind: CueKind): void {
  const audio = clip(kind)
  if (!audio) return
  playback += 1
  audio.muted = false
  audio.volume = kind === 'end' ? 0.2 : kind === 'start' ? 0.35 : 0.9
  try {
    audio.pause()
    audio.currentTime = 0
  } catch {
    // The clip is not ready yet; play() still starts from the beginning.
  }
  void audio.play().catch(() => {
    // A blocked chime must not break the translator.
  })
}

let lastCue: { kind: CueKind; at: number } | null = null

export function playTranslateCue(kind: CueKind): void {
  const now = Date.now()
  if (lastCue && lastCue.kind === kind && now - lastCue.at < 1200) return
  lastCue = { kind, at: now }
  playNow(kind)
}
