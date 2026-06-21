import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import {
  BAR_COUNT,
  getSimulatedData,
  normalizeFrequencyData,
  decayBars
} from '@/utils/audioAnalyzer'

let analyzerInstances = []
const clearAllFrequencyBars = () => {
  analyzerInstances.forEach(inst => {
    inst.clearBars()
  })
}

export function useAudioAnalyzer(getFrequencyData) {
  const playerStore = usePlayerStore()
  const barCount = BAR_COUNT
  const frequencyBars = ref(new Array(barCount).fill(0))
  const animationId = ref(null)
  const prevSongId = ref(null)

  const instance = {
    clearBars: () => {
      frequencyBars.value = new Array(barCount).fill(0)
    }
  }
  analyzerInstances.push(instance)

  const clearBars = () => {
    frequencyBars.value = new Array(barCount).fill(0)
  }

  const animate = () => {
    if (playerStore.isPlaying) {
      const currentSongId = playerStore.currentSong?.id
      if (prevSongId.value !== null && prevSongId.value !== currentSongId) {
        clearBars()
      }
      prevSongId.value = currentSongId

      let freqData = getFrequencyData ? getFrequencyData() : null

      if (!freqData || freqData.length === 0) {
        freqData = getSimulatedData()
      }

      frequencyBars.value = normalizeFrequencyData(freqData, barCount)
    } else {
      frequencyBars.value = decayBars(frequencyBars.value)
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

  watch(
    () => playerStore.currentSong,
    (newSong, oldSong) => {
      if (newSong?.id !== oldSong?.id) {
        clearAllFrequencyBars()
        prevSongId.value = newSong?.id ?? null
      }
    }
  )

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    stopAnimation()
    const idx = analyzerInstances.indexOf(instance)
    if (idx >= 0) {
      analyzerInstances.splice(idx, 1)
    }
  })

  return {
    frequencyBars,
    barCount,
    startAnimation,
    stopAnimation,
    clearBars
  }
}
