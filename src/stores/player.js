import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const playlist = ref([])
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)

  const currentSong = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
      return playlist.value[currentIndex.value]
    }
    return null
  })

  const hasPlaylist = computed(() => playlist.value.length > 0)

  const addSong = (song) => {
    const exists = playlist.value.some(s => s.id === song.id)
    if (!exists) {
      playlist.value.push(song)
      if (playlist.value.length === 1) {
        currentIndex.value = 0
      }
    }
  }

  const addSongs = (songs) => {
    songs.forEach(song => addSong(song))
  }

  const removeSong = (index) => {
    if (index < 0 || index >= playlist.value.length) return

    playlist.value.splice(index, 1)

    if (playlist.value.length === 0) {
      currentIndex.value = -1
      isPlaying.value = false
    } else if (index < currentIndex.value) {
      currentIndex.value--
    } else if (index === currentIndex.value) {
      if (currentIndex.value >= playlist.value.length) {
        currentIndex.value = 0
      }
    }
  }

  const clearPlaylist = () => {
    playlist.value = []
    currentIndex.value = -1
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }

  const playSong = (index) => {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
      isPlaying.value = true
    }
  }

  const playNext = () => {
    if (playlist.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    isPlaying.value = true
  }

  const playPrev = () => {
    if (playlist.value.length === 0) return
    currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    isPlaying.value = true
  }

  const togglePlay = () => {
    if (currentSong.value) {
      isPlaying.value = !isPlaying.value
    }
  }

  const setPlaying = (playing) => {
    isPlaying.value = playing
  }

  const setCurrentTime = (time) => {
    currentTime.value = time
  }

  const setDuration = (dur) => {
    duration.value = dur
  }

  const seekTo = (time) => {
    currentTime.value = time
  }

  return {
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    currentSong,
    hasPlaylist,
    addSong,
    addSongs,
    removeSong,
    clearPlaylist,
    playSong,
    playNext,
    playPrev,
    togglePlay,
    setPlaying,
    setCurrentTime,
    setDuration,
    seekTo
  }
})
