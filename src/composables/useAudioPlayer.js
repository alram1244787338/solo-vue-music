import { ref, watch, onUnmounted, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'

let audioInstance = null
let audioContextInstance = null
let analyserInstance = null
let sourceInstance = null
let instanceCount = 0
let playerStoreRef = null

const createEventHandlers = (store) => ({
  onTimeUpdate: () => {
    if (!audioInstance) return
    store.setCurrentTime(audioInstance.currentTime)
  },
  onLoadedMetadata: () => {
    if (!audioInstance) return
    store.setDuration(audioInstance.duration)
  },
  onEnded: async () => {
    store.playNext()
    if (audioInstance && store.currentSong) {
      try {
        if (audioInstance.src !== store.currentSong.url) {
          audioInstance.src = store.currentSong.url
          audioInstance.load()
        }
        await audioInstance.play()
        store.setPlaying(true)
      } catch (e) {
        console.error('自动播放下一首失败:', e)
      }
    }
  },
  onPlay: () => {
    store.setPlaying(true)
  },
  onPause: () => {
    store.setPlaying(false)
  }
})

const initAudio = (handlers) => {
  if (!audioInstance) {
    audioInstance = new Audio()
    audioInstance.addEventListener('timeupdate', handlers.onTimeUpdate)
    audioInstance.addEventListener('loadedmetadata', handlers.onLoadedMetadata)
    audioInstance.addEventListener('ended', handlers.onEnded)
    audioInstance.addEventListener('play', handlers.onPlay)
    audioInstance.addEventListener('pause', handlers.onPause)
  }
}

const cleanupAudio = (handlers) => {
  if (audioInstance) {
    audioInstance.pause()
    audioInstance.removeEventListener('timeupdate', handlers.onTimeUpdate)
    audioInstance.removeEventListener('loadedmetadata', handlers.onLoadedMetadata)
    audioInstance.removeEventListener('ended', handlers.onEnded)
    audioInstance.removeEventListener('play', handlers.onPlay)
    audioInstance.removeEventListener('pause', handlers.onPause)
    audioInstance.src = ''
    audioInstance = null
  }
  if (audioContextInstance) {
    audioContextInstance.close()
    audioContextInstance = null
  }
  analyserInstance = null
  sourceInstance = null
}

export function useAudioPlayer() {
  const playerStore = usePlayerStore()
  playerStoreRef = playerStore

  const handlers = createEventHandlers(playerStore)

  const audio = ref(audioInstance)
  const isDragging = ref(false)
  const audioContext = ref(audioContextInstance)
  const analyser = ref(analyserInstance)
  const isAudioContextReady = ref(!!analyserInstance)

  const initAudioContext = () => {
    if (!audioInstance) return

    if (!audioContextInstance) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      audioContextInstance = new AudioCtx()
      analyserInstance = audioContextInstance.createAnalyser()
      analyserInstance.fftSize = 256
      analyserInstance.smoothingTimeConstant = 0.8

      sourceInstance = audioContextInstance.createMediaElementSource(audioInstance)
      sourceInstance.connect(analyserInstance)
      analyserInstance.connect(audioContextInstance.destination)

      audioContext.value = audioContextInstance
      analyser.value = analyserInstance
      isAudioContextReady.value = true
    }

    if (audioContextInstance.state === 'suspended') {
      audioContextInstance.resume()
    }
  }

  const getFrequencyData = () => {
    if (!analyserInstance) return new Uint8Array(0)
    const bufferLength = analyserInstance.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserInstance.getByteFrequencyData(dataArray)
    return dataArray
  }

  const loadSong = () => {
    if (!audioInstance || !playerStore.currentSong) return

    if (audioInstance.src !== playerStore.currentSong.url) {
      audioInstance.src = playerStore.currentSong.url
      audioInstance.load()
    }
  }

  const play = async () => {
    if (!audioInstance || !playerStore.currentSong) return

    initAudioContext()
    loadSong()

    try {
      await audioInstance.play()
      playerStore.setPlaying(true)
    } catch (err) {
      console.error('播放失败:', err)
      playerStore.setPlaying(false)
    }
  }

  const pause = () => {
    if (!audioInstance) return
    audioInstance.pause()
    playerStore.setPlaying(false)
  }

  const togglePlay = async () => {
    if (playerStore.isPlaying) {
      pause()
    } else {
      await play()
    }
  }

  const playNext = async () => {
    playerStore.playNext()
    await play()
  }

  const playPrev = async () => {
    if (audioInstance && audioInstance.currentTime > 3) {
      audioInstance.currentTime = 0
      return
    }
    playerStore.playPrev()
    await play()
  }

  const seekTo = (time) => {
    if (!audioInstance) return
    audioInstance.currentTime = time
    playerStore.seekTo(time)
  }

  const handleDragStart = () => {
    isDragging.value = true
  }

  const handleDragEnd = (value) => {
    isDragging.value = false
    seekTo(value)
  }

  watch(
    () => playerStore.currentSong,
    (newSong, oldSong) => {
      if (newSong && newSong.id !== oldSong?.id) {
        loadSong()
        if (playerStore.isPlaying) {
          play()
        }
      }
    }
  )

  watch(
    () => playerStore.isPlaying,
    async (playing) => {
      if (!audioInstance || !playerStore.currentSong) return
      if (playing) {
        if (audioInstance.paused) {
          initAudioContext()
          try {
            await audioInstance.play()
          } catch (e) {
            console.error('恢复播放失败:', e)
          }
        }
      } else {
        if (!audioInstance.paused) {
          audioInstance.pause()
        }
      }
    }
  )

  onMounted(() => {
    initAudio(handlers)
    audio.value = audioInstance
    instanceCount++
  })

  onUnmounted(() => {
    instanceCount--
    if (instanceCount <= 0) {
      cleanupAudio(handlers)
    }
  })

  return {
    audio,
    audioContext,
    analyser,
    isAudioContextReady,
    formatTime,
    play,
    pause,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    getFrequencyData,
    handleDragStart,
    handleDragEnd,
    loadSong
  }
}
