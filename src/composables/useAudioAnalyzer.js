import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'

export function useAudioAnalyzer(getFrequencyData) {
  const playerStore = usePlayerStore()
  const barCount = 64
  const frequencyBars = ref(new Array(barCount).fill(0))
  const animationId = ref(null)

  const getSimulatedData = () => {
    const data = []
    const time = Date.now() / 1000
    for (let i = 0; i < barCount; i++) {
      const wave1 = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5
      const wave2 = Math.sin(time * 3 + i * 0.5) * 0.3 + 0.3
      const wave3 = Math.sin(time * 1.5 + i * 0.15) * 0.2 + 0.2
      const value = (wave1 + wave2 + wave3) / 3
      data.push(Math.floor(value * 255))
    }
    return new Uint8Array(data)
  }

  const animate = () => {
    if (playerStore.isPlaying) {
      let freqData = getFrequencyData ? getFrequencyData() : null

      if (!freqData || freqData.length === 0) {
        freqData = getSimulatedData()
      }

      const normalized = new Array(barCount).fill(0)
      const step = Math.floor(freqData.length / barCount)

      for (let i = 0; i < barCount; i++) {
        let sum = 0
        const start = i * step
        const end = start + step
        for (let j = start; j < end && j < freqData.length; j++) {
          sum += freqData[j]
        }
        normalized[i] = step > 0 ? sum / step : 0
        normalized[i] = Math.min(255, Math.max(0, normalized[i]))
      }

      frequencyBars.value = normalized
    } else {
      frequencyBars.value = frequencyBars.value.map(v => v * 0.95)
    }

    animationId.value = requestAnimationFrame(animate)
  }

  const startAnimation = () => {
    if (!animationId.value) {
      animate()
    }
  }

  const stopAnimation = () => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  }

  watch(
    () => playerStore.isPlaying,
    (playing) => {
      if (playing) {
        startAnimation()
      }
    }
  )

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    stopAnimation()
  })

  return {
    frequencyBars,
    barCount,
    startAnimation,
    stopAnimation
  }
}
