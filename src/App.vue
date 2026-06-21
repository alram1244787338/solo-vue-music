<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { formatTime } from '@/utils/format'
import albumPlaceholder from '@/assets/album-placeholder.svg'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const { togglePlay, playNext, playPrev } = useAudioPlayer()

const navItems = [
  { path: '/player', name: '播放', icon: '🎵' },
  { path: '/list', name: '列表', icon: '📋' }
]

const isActive = (path) => route.path === path
const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const hasPlaylist = computed(() => playerStore.hasPlaylist)

const progressPercent = computed(() => {
  if (!duration.value || duration.value <= 0) return 0
  return (currentTime.value / duration.value) * 100
})

const goToPlayer = () => {
  router.push('/player')
}
</script>

<template>
  <div class="app-layout">
    <nav class="app-nav">
      <div class="nav-brand">
        <span class="brand-icon">🎧</span>
        <span class="brand-text">音乐播放器</span>
      </div>
      <div class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>

    <div class="app-content">
      <main class="app-main">
        <router-view />
      </main>

      <div class="mini-player" v-if="currentSong" @click="goToPlayer">
        <div class="mini-player-content">
          <div class="mini-album">
            <img :src="albumPlaceholder" alt="专辑" />
          </div>
          <div class="mini-info">
            <div class="mini-title">{{ currentSong.title }}</div>
            <div class="mini-artist">{{ currentSong.artist }}</div>
          </div>
          <div class="mini-controls" @click.stop>
            <button
              class="mini-btn"
              :disabled="!hasPlaylist"
              @click="playPrev"
              title="上一首"
            >
              ⏮
            </button>
            <button
              class="mini-play-btn"
              @click="togglePlay"
              :title="isPlaying ? '暂停' : '播放'"
            >
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button
              class="mini-btn"
              :disabled="!hasPlaylist"
              @click="playNext"
              title="下一首"
            >
              ⏭
            </button>
          </div>
          <div class="mini-time">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>
        <div class="mini-progress">
          <div
            class="mini-progress-fill"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.app-nav {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid var(--border-color);
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-link.active {
  background: var(--accent-bg);
  color: var(--text-primary);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  width: 3px;
  height: 20px;
  background: var(--accent-gradient);
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
}

.nav-link {
  position: relative;
}

.nav-icon {
  font-size: 18px;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mini-player {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  cursor: pointer;
  transition: background var(--transition-fast);
  flex-shrink: 0;
}

.mini-player:hover {
  background: var(--bg-tertiary);
}

.mini-player-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
}

.mini-album {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.mini-album img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-info {
  flex: 1;
  min-width: 0;
}

.mini-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-artist {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.mini-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  font-size: 16px;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-btn:hover:not(:disabled) {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.mini-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mini-play-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--accent-gradient);
  font-size: 18px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.mini-play-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-glow);
}

.mini-time {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  min-width: 110px;
  text-align: right;
  flex-shrink: 0;
}

.mini-progress {
  height: 3px;
  background: var(--bg-tertiary);
  width: 100%;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  transition: width 0.1s linear;
}

@media (max-width: 768px) {
  .app-nav {
    width: 64px;
  }

  .nav-text,
  .brand-text {
    display: none;
  }

  .nav-brand {
    justify-content: center;
  }

  .nav-link {
    justify-content: center;
    padding: 12px;
  }

  .mini-time {
    display: none;
  }

  .mini-info {
    max-width: 120px;
  }
}
</style>
