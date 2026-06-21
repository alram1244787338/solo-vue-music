<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goToList = () => {
  router.push('/list')
}
</script>

<template>
  <div class="player-view">
    <div class="player-container">
      <div class="player-header">
        <h1 class="title">播放页</h1>
        <p class="subtitle">Player View</p>
      </div>

      <div class="player-content">
        <div class="album-art">
          <div class="album-placeholder">
            <span class="placeholder-icon">🎵</span>
          </div>
        </div>

        <div class="track-info">
          <h2 class="track-title">歌曲名称</h2>
          <p class="track-artist">艺术家</p>
        </div>

        <div class="spectrum-placeholder">
          <div class="spectrum-bars">
            <div v-for="i in 32" :key="i" class="bar" :style="{ animationDelay: `${i * 0.05}s` }"></div>
          </div>
          <p class="spectrum-label">频谱动画占位</p>
        </div>

        <div class="lyrics-placeholder">
          <p class="lyrics-line">歌词显示区域占位</p>
          <p class="lyrics-line secondary">将在这里展示解析后的歌词</p>
        </div>

        <div class="player-controls">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="control-buttons">
            <button class="btn-icon">⏮</button>
            <button class="btn-play">▶</button>
            <button class="btn-icon">⏭</button>
          </div>
        </div>
      </div>

      <div class="nav-footer">
        <button class="nav-btn" @click="goToList">
          → 前往播放列表
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

.album-placeholder {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow);
}

.placeholder-icon {
  font-size: 64px;
}

.track-info {
  text-align: center;
}

.track-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.track-artist {
  font-size: 14px;
  color: var(--text-secondary);
}

.spectrum-placeholder {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  border: 1px dashed var(--border-light);
}

.spectrum-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 60px;
  margin-bottom: 12px;
}

.bar {
  width: 8px;
  background: var(--accent-gradient);
  border-radius: 4px;
  animation: pulse 0.8s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    height: 20%;
    opacity: 0.5;
  }
  to {
    height: 100%;
    opacity: 1;
  }
}

.spectrum-label {
  font-size: 12px;
  color: var(--text-muted);
}

.lyrics-placeholder {
  text-align: center;
  padding: 16px;
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
}

.player-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  width: 35%;
  height: 100%;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  font-size: 20px;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}

.btn-icon:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.btn-play {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--accent-gradient);
  font-size: 24px;
  color: white;
  box-shadow: var(--shadow-glow);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.btn-play:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
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
