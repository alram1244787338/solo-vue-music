<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { useAudioAnalyzer } from '@/composables/useAudioAnalyzer'
import { formatTime } from '@/utils/format'
import albumPlaceholder from '@/assets/album-placeholder.svg'

const router = useRouter()
const playerStore = usePlayerStore()

const {
  togglePlay,
  playNext,
  playPrev,
  getFrequencyData,
  effectiveCurrentTime,
  isDragging,
  handleProgressInput,
  handleProgressChange
} = useAudioPlayer()

const { frequencyBars, barCount } = useAudioAnalyzer(getFrequencyData)

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const duration = computed(() => playerStore.duration)
const hasPlaylist = computed(() => playerStore.hasPlaylist)

const progressInputRef = ref(null)

const progressPercent = computed(() => {
  if (!duration.value || duration.value <= 0) return 0
  return (effectiveCurrentTime.value / duration.value) * 100
})

const formattedCurrentTime = computed(() => formatTime(effectiveCurrentTime.value))

const formattedDuration = computed(() => formatTime(duration.value))

const goToList = () => {
  router.push('/list')
}

const getBarHeight = (value) => {
  const minHeight = 4
  const maxHeight = 100
  const normalized = value / 255
  return minHeight + normalized * (maxHeight - minHeight) + '%'
}
</script>

<template>
  <div class="player-view">
    <div class="player-container">
      <div class="player-header">
        <h1 class="title">正在播放</h1>
        <p class="subtitle">{{ currentSong ? currentSong.title : '请先添加歌曲' }}</p>
      </div>

      <template v-if="currentSong">
        <div class="player-content">
          <div class="album-art">
            <div
              class="album-cover"
              :class="{ 'album-spinning': isPlaying }"
            >
              <img :src="albumPlaceholder" alt="专辑封面" />
            </div>
          </div>

          <div class="track-info">
            <h2 class="track-title">{{ currentSong.title }}</h2>
            <p class="track-artist">{{ currentSong.artist }}</p>
            <p class="track-album">{{ currentSong.album }}</p>
          </div>

          <div class="spectrum-container">
            <div class="spectrum-bars">
              <div
                v-for="(value, index) in frequencyBars"
                :key="index"
                class="bar"
                :style="{
                  height: getBarHeight(value),
                  opacity: isPlaying ? 1 : 0.3
                }"
              ></div>
            </div>
            <p class="spectrum-label">
              {{ isPlaying ? '🎵 正在播放 - 频谱可视化' : '⏸ 已暂停' }}
            </p>
          </div>

          <div class="lyrics-placeholder">
            <p class="lyrics-line">🎤 歌词解析区域</p>
            <p class="lyrics-line secondary">后续将支持 LRC 歌词解析与同步显示</p>
          </div>

          <div class="player-controls">
            <div class="progress-section">
              <span class="time-text">{{ formattedCurrentTime }}</span>
              <div class="progress-wrapper">
                <input
                  ref="progressInputRef"
                  type="range"
                  class="progress-input"
                  :min="0"
                  :max="duration || 0"
                  :step="0.1"
                  :value="effectiveCurrentTime"
                  @input="handleProgressInput"
                  @change="handleProgressChange"
                />
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: progressPercent + '%' }"
                  ></div>
                </div>
              </div>
              <span class="time-text">{{ formattedDuration }}</span>
            </div>

            <div class="control-buttons">
              <button
                class="btn-icon"
                :disabled="!hasPlaylist"
                @click="playPrev"
                title="上一首"
              >
                ⏮
              </button>
              <button
                class="btn-play"
                :disabled="!currentSong"
                @click="togglePlay"
                :title="isPlaying ? '暂停' : '播放'"
              >
                {{ isPlaying ? '⏸' : '▶' }}
              </button>
              <button
                class="btn-icon"
                :disabled="!hasPlaylist"
                @click="playNext"
                title="下一首"
              >
                ⏭
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="empty-player">
          <div class="empty-album">
            <img :src="albumPlaceholder" alt="空状态" />
          </div>
          <p class="empty-text">播放列表为空</p>
          <p class="empty-hint">请先到列表页导入本地 MP3 文件</p>
          <button class="btn-goto-list" @click="goToList">
            📋 前往播放列表
          </button>
        </div>
      </template>

      <div class="nav-footer" v-if="currentSong">
        <button class="nav-btn" @click="goToList">
          📋 查看播放列表
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-primary);
  overflow-y: auto;
}

.player-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.player-header {
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.player-content {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.album-art {
  display: flex;
  justify-content: center;
}

.album-cover {
  width: 220px;
  height: 220px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-glow);
  background: var(--accent-gradient);
  transition: transform var(--transition-slow);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-spinning {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.track-info {
  text-align: center;
}

.track-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.track-album {
  font-size: 13px;
  color: var(--text-muted);
}

.spectrum-container {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.spectrum-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  height: 80px;
  margin-bottom: 12px;
}

.bar {
  width: 4px;
  min-height: 4px;
  background: var(--accent-gradient);
  border-radius: 3px;
  transition: height 0.08s ease-out, opacity var(--transition-normal);
}

.spectrum-label {
  font-size: 12px;
  color: var(--text-muted);
}

.lyrics-placeholder {
  text-align: center;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-light);
}

.lyrics-line {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.lyrics-line.secondary {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.player-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-text {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  min-width: 45px;
  text-align: center;
}

.progress-wrapper {
  flex: 1;
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

.progress-wrapper:hover .progress-bar {
  height: 6px;
}

.progress-wrapper:hover .progress-fill {
  box-shadow: 0 0 10px var(--accent-primary);
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.btn-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  font-size: 22px;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover:not(:disabled) {
  color: var(--text-primary);
  background: var(--bg-hover);
  transform: scale(1.1);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-play {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--accent-gradient);
  font-size: 28px;
  color: white;
  box-shadow: var(--shadow-glow);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-play:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.7);
}

.btn-play:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-player {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 48px 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.empty-album {
  width: 160px;
  height: 160px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  opacity: 0.6;
  margin-bottom: 8px;
}

.empty-album img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.btn-goto-list {
  padding: 12px 28px;
  border-radius: var(--radius-md);
  background: var(--accent-gradient);
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.btn-goto-list:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.nav-footer {
  display: flex;
  justify-content: center;
}

.nav-btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.nav-btn:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
  background: var(--bg-hover);
}
</style>
