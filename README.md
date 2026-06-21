# Solo Music Player

一个纯前端本地音乐播放器，支持 MP3 导入、播放控制、进度条拖拽、实时频谱可视化和播放列表管理。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 5173，自动打开浏览器）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm test
```

启动后浏览器会自动打开 `http://localhost:5173`，默认跳转到播放页。

## 功能列表

- **本地 MP3 导入**：支持选择本地音频文件，自动解析文件名（去除编号前缀、括号标记、特殊分隔符），以 Data URL 形式加载，无需上传到服务器
- **播放控制**：播放 / 暂停切换、上一首 / 下一首、单曲循环切歌、播放结束自动切下一首
- **进度条拖拽**：拖拽进度条跳转到指定位置，拖拽期间暂停时间更新避免回弹，松手后统一 seek
- **频谱可视化**：基于 Web Audio API 的 AnalyserNode 实时采集频域数据，归一化映射为 64 根频谱柱；播放时驱动动画，暂停时按 0.9 系数衰减归零，切歌时清空残留数据
- **播放列表管理**：查看已导入歌曲列表，点击切歌，单曲删除，清空列表，重复添加相同 ID 自动去重
- **迷你播放条**：底部常驻迷你播放条，显示当前歌曲信息、播放控制按钮和进度，点击跳转播放页，与播放页共享同一时间源

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架，使用 Composition API + `<script setup>` |
| Vite | 构建工具与开发服务器 |
| Pinia | 全局状态管理（播放列表、播放状态、时间） |
| Web Audio API | 音频频谱分析（AnalyserNode、MediaElementSource） |
| Vue Router | 页面路由（Hash 模式，播放页 / 列表页） |

## 目录结构

```
work/
├── index.html                  # 应用入口 HTML
├── package.json                # 依赖与脚本配置
├── vite.config.js              # Vite 配置（别名 @ → src/，端口 5173）
├── src/
│   ├── main.js                 # 应用入口，挂载 Pinia 和 Vue Router
│   ├── App.vue                 # 根组件，侧边导航 + 路由出口 + 迷你播放条
│   ├── assets/
│   │   └── album-placeholder.svg   # 默认专辑封面
│   ├── components/
│   │   └── MiniPlayer.vue      # 底部迷你播放条组件
│   ├── composables/
│   │   ├── useAudioPlayer.js   # 音频播放核心逻辑：Audio 实例管理、播放控制、进度拖拽、AudioContext 初始化
│   │   ├── useAudioAnalyzer.js # 频谱动画逻辑：requestAnimationFrame 驱动、播放时更新、暂停衰减、切歌清零
│   │   └── useFileImport.js    # 文件导入逻辑：读取本地音频、解析文件名、写入播放列表
│   ├── router/
│   │   └── index.js            # 路由配置（/player 播放页，/list 列表页）
│   ├── stores/
│   │   └── player.js           # Pinia store：播放列表、currentIndex、isPlaying、currentTime 等
│   ├── styles/
│   │   ├── variables.css       # CSS 变量（颜色、圆角、间距、动画）
│   │   └── global.css          # 全局样式重置与基础布局
│   ├── utils/
│   │   ├── audioAnalyzer.js    # 频谱工具：BAR_COUNT、getSimulatedData、normalizeFrequencyData、decayBars
│   │   ├── filename.js         # 文件名解析：extractTitleFromFilename
│   │   └── format.js           # 时间格式化：formatTime（秒 → m:ss）
│   └── views/
│       ├── PlayerView.vue      # 播放页：专辑封面、频谱可视化、进度条、播放控制
│       └── ListView.vue        # 列表页：文件导入、歌曲列表、删除/清空
└── test/
    ├── index.js                # 测试入口
    ├── runner.js               # 轻量测试运行器（describe / it / beforeEach / assert）
    ├── setup-pinia.js          # 测试用 Pinia 实例初始化与 mock 数据
    ├── format.test.js          # formatTime 测试
    ├── filename-parser.test.js # extractTitleFromFilename 测试
    ├── audio-analyzer.test.js  # 频谱分析工具测试
    └── player-store.test.js    # player store 状态流转测试
```

## 测试

运行测试：

```bash
npm test
```

测试基于 Node.js 原生 `assert` 模块实现的轻量测试运行器，无外部测试框架依赖。共 89 个测试用例，覆盖以下 4 个模块：

| 测试文件 | 测试内容 | 用例数 |
|----------|----------|--------|
| `format.test.js` | formatTime：正常秒数、超过 1 分钟、超过 1 小时、小数、0、负数、NaN | 7 |
| `filename-parser.test.js` | extractTitleFromFilename：数字前缀、中英文括号、括号内容移除、特殊分隔符、无扩展名、全符号、真实场景 | 32 |
| `audio-analyzer.test.js` | getSimulatedData / normalizeFrequencyData / decayBars：数据类型、范围、分块平均、短输入、衰减归零、不修改原数组 | 25 |
| `player-store.test.js` | addSong / removeSong / playNext / playPrev / clearPlaylist / togglePlay / playSong：初始状态、重复添加、删除当前歌曲、空列表边界、单曲循环 | 25 |

测试运行器支持 `describe` / `it` / `beforeEach` 语法，`beforeEach` 钩子在每个 `it` 执行前运行，支持嵌套 `describe` 场景下父级钩子的逐层执行。

## 浏览器兼容要求

本项目为纯前端应用，不依赖任何后端服务，所有数据处理在浏览器本地完成。需使用支持以下 API 的现代浏览器：

| API | 用途 | 最低浏览器版本 |
|-----|------|----------------|
| ES Modules + Optional Chaining | 源码模块系统与语法 | Chrome 80+, Firefox 74+, Safari 13.1+ |
| Web Audio API (AudioContext) | 频谱分析与可视化 | Chrome 66+, Firefox 60+, Safari 14.1+ |
| MediaElementSourceNode | 连接 audio 元素到 AnalyserNode | Chrome 66+, Firefox 60+, Safari 14.1+ |
| File API (FileReader) | 读取本地音频文件为 Data URL | Chrome 6+, Firefox 3.6+, Safari 6+ |
| requestAnimationFrame | 频谱动画驱动 | Chrome 24+, Firefox 23+, Safari 7+ |

**推荐使用**：Chrome 90+ / Firefox 90+ / Safari 15+ / Edge 90+

> **注意**：由于浏览器自动播放策略限制，首次播放需要用户交互触发（点击播放按钮）。AudioContext 会在首次播放时自动 resume。
