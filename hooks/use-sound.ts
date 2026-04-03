"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getAudioContext, decodeAudioData } from "@/lib/audio/sound-engine"
import type {
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/audio/sound-types"

export function useSound(
  sound: SoundAsset,
  options: UseSoundOptions = {}
): UseSoundReturn {
  const {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    onPlay,
    onEnd,
    onPause,
    onStop,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(
    sound.duration ?? null
  )
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const loadingRef = useRef<Promise<AudioBuffer> | null>(null)

  const ensureBuffer = useCallback(async () => {
    if (bufferRef.current) {
      return bufferRef.current
    }

    const pendingLoad =
      loadingRef.current ??
      decodeAudioData(sound.dataUri).then((buffer) => {
        bufferRef.current = buffer
        setDuration(buffer.duration)
        loadingRef.current = null

        return buffer
      })

    loadingRef.current = pendingLoad

    return pendingLoad
  }, [sound.dataUri])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        // Already stopped
      }
      sourceRef.current = null
    }
    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const play = useCallback(
    (overrides?: { volume?: number; playbackRate?: number }) => {
      if (!soundEnabled) return

      void (async () => {
        const buffer = await ensureBuffer()
        const ctx = getAudioContext()

        if (ctx.state === "suspended") {
          await ctx.resume()
        }

        if (interrupt && sourceRef.current) {
          stop()
        }

        const source = ctx.createBufferSource()
        const gain = ctx.createGain()

        source.buffer = buffer
        source.playbackRate.value = overrides?.playbackRate ?? playbackRate
        gain.gain.value = overrides?.volume ?? volume

        source.connect(gain)
        gain.connect(ctx.destination)

        source.addEventListener("ended", () => {
          setIsPlaying(false)
          onEnd?.()
        })

        source.start(0)
        sourceRef.current = source
        gainRef.current = gain
        setIsPlaying(true)
        onPlay?.()
      })()
    },
    [
      soundEnabled,
      ensureBuffer,
      playbackRate,
      volume,
      interrupt,
      stop,
      onPlay,
      onEnd,
    ]
  )

  const pause = useCallback(() => {
    stop()
    onPause?.()
  }, [stop, onPause])

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop()
        } catch {
          // Already stopped
        }
      }
    }
  }, [])

  return [play, { stop, pause, isPlaying, duration, sound }] as const
}
