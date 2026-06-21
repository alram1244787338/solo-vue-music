<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MiniPlayer from '@/components/MiniPlayer.vue'

const route = useRoute()

const navItems = [
  { path: '/player', name: '播放', icon: '🎵' },
  { path: '/list', name: '列表', icon: '📋' }
]

const isActive = (path) => route.path === path
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
      <MiniPlayer />
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
  position: relative;
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
}
</style>
