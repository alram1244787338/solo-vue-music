<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useFileImport } from '@/composables/useFileImport'
import { formatTime } from '@/utils/format'

const router = useRouter()
const playerStore = usePlayerStore()
const { isLoading, handleFileSelect, triggerFileInput } = useFileImport()

const fileInputRef = ref(null)

const playlist = computed(() => playerStore.playlist)
const currentIndex = computed(() => playerStore.currentIndex)
const isPlaying = computed(() => playerStore.isPlaying)

const goToPlayer = () => {
  router.push('/player')
}

const onImportClick = () => {
  triggerFileInput(fileInputRef)
}

const onFileSelected = async (event) => {
  await handleFileSelect(event)
}

const playSongAtIndex = (index) => {
  playerStore.playSong(index)
}

const togglePlaySong = (index) => {
  if (currentIndex.value === index) {
    playerStore.togglePlay()
  } else {
    playSongAtIndex(index)
  }
}

const removeSong = (index, event) => {
  event.stopPropagation()
  playerStore.removeSong(index)
}

const playAll = () => {
  if (playlist.value.length === 0) return
  if (currentIndex.value < 0) {
    playerStore.currentIndex = 0
  }
  playerStore.setPlaying(true)
}

const clearAll = () => {
  if (playlist.value.length === 0) return
  if (confirm('确定要清空播放列表吗？')) {
    playerStore.clearPlaylist()
  }
}

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '--:--'
  return formatTime(seconds)
}

const isCurrentSong = (index) => index === currentIndex.value
</script>

<template>
  <div class="list-view">
    <div class="list-container">
      <div class="list-header">
        <div class="header-content">
          <h1 class="title">播放列表</h1>
          <p class="subtitle">共 {{ playlist.length }} 首歌曲</p>
        </div>
        <div class="header-actions">
          <input
            ref="fileInputRef"
            type="file"
            accept="audio/*,.mp3"
            multiple
            class="hidden-input"
            @change="onFileSelected"
          />
          <button class="btn-import" :disabled="isLoading" @click="onImportClick">
            <span class="btn-icon">{{ isLoading ? '⏳' : '📁' }}</span>
            {{ isLoading ? '导入中...' : '导入本地 MP3' }}
          </button>
          <button
            class="btn-play-all"
            :disabled="playlist.length === 0"
            @click="playAll"
          >
            <span class="btn-icon">▶</span>
            播放全部
          </button>
          <button
            class="btn-clear"
            :disabled="playlist.length === 0"
            @click="clearAll"
          >
            <span class="btn-icon">🗑</span>
            清空
          </button>
        </div>
      </div>

      <div class="list-content">
        <template v-if="playlist.length > 0">
          <div class="list-table">
            <div class="table-header">
              <div class="col-index">#</div>
              <div class="col-title">歌曲</div>
              <div class="col-album">专辑</div>
              <div class="col-duration">时长</div>
              <div class="col-actions">操作</div>
            </div>

            <div class="table-body">
              <div
                v-for="(song, index) in playlist"
                :key="song.id"
                class="table-row"
                :class="{ 'playing': isCurrentSong(index), 'is-playing': isCurrentSong(index) && isPlaying }"
                @click="togglePlaySong(index)"
              >
                <div class="col-index">
                  <span class="index-text" v-if="!isCurrentSong(index)">{{ index + 1 }}</span>
                  <span class="play-icon" v-else>
                    <span v-if="isPlaying" class="playing-indicator">
                        <span v-for="i in 3" :key="i"></span>
                    </span>
                    <span v-else>▶</span>
                  </span>
                </div>
                <div class="col-title">
                  <div class="song-title">{{ song.title }}</div>
                  <div class="song-artist">{{ song.artist }}</div>
                </div>
                <div class="col-album">{{ song.album }}</div>
                <div class="col-duration">{{ formatDuration(song.duration) }}</div>
                <div class="col-actions">
                  <button class="row-btn" @click.stop="removeSong(index)" title="删除">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="empty-placeholder" v-else>
          <span class="empty-icon">🎵</span>
          <p class="empty-text">暂无歌曲</p>
          <p class="empty-hint">点击上方"导入本地 MP3"添加音乐</p>
          <button class="btn-import-empty" @click="onImportClick">
            <span class="btn-icon">📁</span>
            选择音乐文件
          </button>
        </div>
      </div>

      <div class="list-footer">
        <div class="list-stats" v-if="playlist.length > 0">
          当前播放: {{ currentIndex >= 0 ? playlist[currentIndex]?.title : '无' }}
        </div>
        <button class="nav-btn" @click="goToPlayer">
          → 前往播放页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-primary);
  overflow: hidden;
}

.list-container {
  width: 100%;
  max-width: 900px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.hidden-input {
  display: none;
}

.btn-import,
.btn-play-all,
.btn-clear {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
}

.btn-import {
  background: var(--bg-card);
  color: var(--text-secondary);
}

.btn-import:hover:not(:disabled) {
  border-color: var(--accent-primary);
  color: var(--text-primary);
  background: var(--bg-hover);
}

.btn-import:disabled,
.btn-play-all:disabled,
.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-play-all {
  background: var(--accent-gradient);
  color: white;
  border: none;
}

.btn-play-all:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-clear {
  background: var(--bg-card);
  color: var(--text-secondary);
}

.btn-clear:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.btn-icon {
  font-size: 16px;
}

.list-content {
  flex: 1;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.list-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 48px 1fr 160px 80px 80px;
  gap: 16px;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  flex: 1;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 48px 1fr 160px 80px 80px;
  gap: 16px;
  padding: 12px 24px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--bg-hover);
}

.table-row.playing {
  background: var(--accent-bg);
}

.table-row.playing .song-title {
  color: var(--accent-secondary);
}

.table-row:hover .index-text {
  display: none;
}

.table-row:hover .play-icon {
  display: inline;
}

.col-index {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-muted);
}

.play-icon {
  display: none;
  color: var(--accent-primary);
  font-size: 12px;
}

.playing-indicator {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.playing-indicator span {
  width: 3px;
  background: var(--accent-gradient);
  border-radius: 2px;
  animation: equalizer 0.8s ease-in-out infinite;
}

.playing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.playing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.playing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes equalizer {
  0%, 100% {
    height: 4px;
  }
  50% {
    height: 14px;
  }
}

.col-title {
  min-width: 0;
}

.song-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-album,
.col-duration {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.table-row:hover .col-actions,
.table-row.playing .col-actions {
  opacity: 1;
}

.row-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.row-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.empty-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 14px;
}

.btn-import-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  background: var(--accent-gradient);
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.btn-import-empty:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.list-stats {
  font-size: 13px;
  color: var(--text-muted);
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

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 32px 1fr 80px 60px;
  }

  .col-album,
  .table-header .col-album {
    display: none;
  }

  .col-actions {
    opacity: 1;
  }
}
</style>
