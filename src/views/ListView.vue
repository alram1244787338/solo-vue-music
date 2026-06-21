<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mockSongs = ref([
  { id: 1, title: '歌曲 1', artist: '艺术家 A', duration: '3:45', album: '专辑 1' },
  { id: 2, title: '歌曲 2', artist: '艺术家 B', duration: '4:12', album: '专辑 2' },
  { id: 3, title: '歌曲 3', artist: '艺术家 C', duration: '3:58', album: '专辑 1' },
  { id: 4, title: '歌曲 4', artist: '艺术家 A', duration: '5:20', album: '专辑 3' },
  { id: 5, title: '歌曲 5', artist: '艺术家 D', duration: '3:33', album: '专辑 2' }
])

const goToPlayer = () => {
  router.push('/player')
}

const playSong = (song) => {
  console.log('播放:', song.title)
}
</script>

<template>
  <div class="list-view">
    <div class="list-container">
      <div class="list-header">
        <div class="header-content">
          <h1 class="title">播放列表</h1>
          <p class="subtitle">Playlist View</p>
        </div>
        <div class="header-actions">
          <button class="btn-import">
            <span class="btn-icon">📁</span>
            导入本地 MP3
          </button>
          <button class="btn-play-all">
            <span class="btn-icon">▶</span>
            播放全部
          </button>
        </div>
      </div>

      <div class="list-content">
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
              v-for="(song, index) in mockSongs"
              :key="song.id"
              class="table-row"
              @click="playSong(song)"
            >
              <div class="col-index">
                <span class="index-text">{{ index + 1 }}</span>
                <span class="play-icon">▶</span>
              </div>
              <div class="col-title">
                <div class="song-title">{{ song.title }}</div>
                <div class="song-artist">{{ song.artist }}</div>
              </div>
              <div class="col-album">{{ song.album }}</div>
              <div class="col-duration">{{ song.duration }}</div>
              <div class="col-actions">
                <button class="row-btn" @click.stop>♥</button>
                <button class="row-btn" @click.stop>⋯</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-placeholder" v-if="mockSongs.length === 0">
          <span class="empty-icon">📭</span>
          <p class="empty-text">暂无歌曲</p>
          <p class="empty-hint">点击上方"导入本地 MP3"添加音乐</p>
        </div>
      </div>

      <div class="list-footer">
        <div class="list-stats">
          共 {{ mockSongs.length }} 首歌曲
        </div>
        <button class="nav-btn" @click="goToPlayer">
          ← 返回播放页
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

.btn-import,
.btn-play-all {
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

.btn-import:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
  background: var(--bg-hover);
}

.btn-play-all {
  background: var(--accent-gradient);
  color: white;
  border: none;
}

.btn-play-all:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
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

.table-row:hover .col-actions {
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
  background: var(--bg-tertiary);
  color: var(--accent-primary);
}

.empty-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 48px;
}

.empty-text {
  font-size: 16px;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 13px;
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
