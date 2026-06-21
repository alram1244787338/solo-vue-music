<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { formatTime } from '@/utils/format'
import albumPlaceholder from '@/assets/album-placeholder.svg'

const router = useRouter()
const playerStore = usePlayerStore()
const { togglePlay, playNext, playPrev, effectiveCurrentTime } = useAudioPlayer()

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const duration = computed(() => playerStore.duration)
const hasPlaylist = computed(() => playerStore.hasPlaylist)

const progressPercent = computed(() => {
  if (!duration.value || duration.value <= 0) return 0
  return (effectiveCurrentTime.value / duration.value) * 100
})

const formattedCurrentTime = computed(() => formatTime(effectiveCurrentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const goToPlayer = () => {
  router.push('/player')
}
</script>

<template>
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
        {{ formattedCurrentTime }} / {{ formattedDuration }}
      </div>
    </div>
    <div class="mini-progress">
      <div
        class="mini-progress-fill"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
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
  .mini-time {
    display: none;
  }

  .mini-info {
    max-width: 120px;
  }
}
</style>
