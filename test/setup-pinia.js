import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { usePlayerStore } from '../src/stores/player.js'

let piniaInstance = null

export const setupPiniaForTesting = () => {
  piniaInstance = createPinia()
  setActivePinia(piniaInstance)
  return piniaInstance
}

export const resetPlayerStore = (store) => {
  store.$patch({
    playlist: [],
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0
  })
}

export const createFreshPlayerStore = () => {
  setupPiniaForTesting()
  const store = usePlayerStore(piniaInstance)
  return store
}

export const createMockSong = (id, overrides = {}) => ({
  id,
  title: `歌曲 ${id}`,
  artist: '艺术家',
  album: '专辑',
  duration: 200,
  url: `data:audio/mp3;base64,${id}`,
  filename: `${id}.mp3`,
  size: 1024,
  addedAt: Date.now(),
  ...overrides
})
