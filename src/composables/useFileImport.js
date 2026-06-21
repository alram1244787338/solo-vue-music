import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { extractTitleFromFilename } from '@/utils/filename'

export function useFileImport() {
  const playerStore = usePlayerStore()
  const isLoading = ref(false)

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const processFile = async (file) => {
    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3')) {
      return null
    }

    const url = await readFileAsDataURL(file)
    const title = extractTitleFromFilename(file.name)

    return {
      id: generateId(),
      title,
      artist: '未知艺术家',
      album: '未知专辑',
      duration: 0,
      url,
      filename: file.name,
      size: file.size,
      addedAt: Date.now()
    }
  }

  const importFiles = async (files) => {
    isLoading.value = true

    try {
      const audioFiles = Array.from(files).filter(
        (f) => f.type.startsWith('audio/') || f.name.endsWith('.mp3')
      )

      const songs = []
      for (const file of audioFiles) {
        const song = await processFile(file)
        if (song) {
          songs.push(song)
        }
      }

      if (songs.length > 0) {
        playerStore.addSongs(songs)
      }

      return songs.length
    } finally {
      isLoading.value = false
    }
  }

  const handleFileSelect = async (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return 0

    const count = await importFiles(files)
    event.target.value = ''
    return count
  }

  const triggerFileInput = (inputRef) => {
    if (inputRef.value) {
      inputRef.value.click()
    }
  }

  return {
    isLoading,
    importFiles,
    handleFileSelect,
    triggerFileInput,
    processFile
  }
}
