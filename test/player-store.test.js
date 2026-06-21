import { describe, it, assert, beforeEach } from './runner.js'
import { createFreshPlayerStore, createMockSong } from './setup-pinia.js'

describe('player store 播放列表状态流转', () => {
  let store

  beforeEach(() => {
    store = createFreshPlayerStore()
  })

  describe('初始状态', () => {
    it('初始时播放列表为空', () => {
      assert.deepEqual(store.playlist, [])
      assert.equal(store.currentIndex, -1)
      assert.equal(store.isPlaying, false)
      assert.equal(store.currentTime, 0)
      assert.equal(store.duration, 0)
      assert.equal(store.currentSong, null)
      assert.equal(store.hasPlaylist, false)
    })
  })

  describe('addSong 添加歌曲', () => {
    it('添加第一首歌时，currentIndex 自动设为 0', () => {

      const song = createMockSong('song-1')

      store.addSong(song)

      assert.equal(store.playlist.length, 1)
      assert.equal(store.playlist[0].id, 'song-1')
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')
      assert.equal(store.hasPlaylist, true)
    })

    it('添加后续歌曲时，currentIndex 保持不变', () => {

      store.addSong(createMockSong('song-1'))
      assert.equal(store.currentIndex, 0)

      store.addSong(createMockSong('song-2'))
      assert.equal(store.playlist.length, 2)
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')
    })

    it('重复添加相同 ID 的歌曲不会重复', () => {

      const song = createMockSong('song-1')

      store.addSong(song)
      store.addSong(song)
      store.addSong(song)

      assert.equal(store.playlist.length, 1)
    })

    it('addSongs 可以批量添加歌曲', () => {


      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])

      assert.equal(store.playlist.length, 3)
      assert.equal(store.currentIndex, 0)
      assert.equal(store.playlist[0].id, 'song-1')
      assert.equal(store.playlist[2].id, 'song-3')
    })
  })

  describe('removeSong 删除歌曲', () => {
    it('删除索引超出范围时不报错', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])

      assert.doesNotThrow(() => store.removeSong(-1))
      assert.doesNotThrow(() => store.removeSong(999))
      assert.equal(store.playlist.length, 3)
    })

    it('删除当前播放歌曲前面的歌曲，currentIndex 应减 1', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(2)
      assert.equal(store.currentIndex, 2)
      assert.equal(store.currentSong.id, 'song-3')

      store.removeSong(0)

      assert.equal(store.playlist.length, 2)
      assert.equal(store.currentIndex, 1)
      assert.equal(store.currentSong.id, 'song-3')
    })

    it('删除当前播放歌曲，currentIndex 不变（指向同一位置的新歌）', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(1)
      assert.equal(store.currentIndex, 1)
      assert.equal(store.currentSong.id, 'song-2')

      store.removeSong(1)

      assert.equal(store.playlist.length, 2)
      assert.equal(store.currentIndex, 1)
      assert.equal(store.currentSong.id, 'song-3')
    })

    it('删除最后一首歌（也是当前播放），currentIndex 重置为 0', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2')
      ])
      store.playSong(1)
      assert.equal(store.currentIndex, 1)

      store.removeSong(1)

      assert.equal(store.playlist.length, 1)
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')
    })

    it('删除最后一首歌时，清空播放状态', () => {

      store.addSong(createMockSong('song-1'))
      store.playSong(0)
      store.setPlaying(true)
      store.setCurrentTime(100)
      store.setDuration(200)

      assert.equal(store.isPlaying, true)
      assert.equal(store.currentTime, 100)

      store.removeSong(0)

      assert.equal(store.playlist.length, 0)
      assert.equal(store.currentIndex, -1)
      assert.equal(store.currentSong, null)
      assert.equal(store.isPlaying, false)
      assert.equal(store.currentTime, 0)
      assert.equal(store.duration, 0)
      assert.equal(store.hasPlaylist, false)
    })
  })

  describe('clearPlaylist 清空播放列表', () => {
    it('清空播放列表后所有状态重置', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2')
      ])
      store.playSong(0)
      store.setPlaying(true)
      store.setCurrentTime(50)
      store.setDuration(200)

      store.clearPlaylist()

      assert.deepEqual(store.playlist, [])
      assert.equal(store.currentIndex, -1)
      assert.equal(store.currentSong, null)
      assert.equal(store.isPlaying, false)
      assert.equal(store.currentTime, 0)
      assert.equal(store.duration, 0)
      assert.equal(store.hasPlaylist, false)
    })
  })

  describe('playSong 播放指定歌曲', () => {
    it('索引合法时，切换到指定歌曲并设置播放状态', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.setPlaying(false)

      store.playSong(1)

      assert.equal(store.currentIndex, 1)
      assert.equal(store.currentSong.id, 'song-2')
      assert.equal(store.isPlaying, true)
    })

    it('索引越界时，不改变任何状态', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2')
      ])
      store.playSong(0)

      store.playSong(-1)
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')

      store.playSong(99)
      assert.equal(store.currentIndex, 0)
    })

    it('空列表时 playSong 不报错', () => {

      assert.doesNotThrow(() => store.playSong(0))
      assert.equal(store.currentIndex, -1)
    })
  })

  describe('playNext 下一首', () => {
    it('正常切到下一首', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(0)

      store.playNext()

      assert.equal(store.currentIndex, 1)
      assert.equal(store.currentSong.id, 'song-2')
      assert.equal(store.isPlaying, true)
    })

    it('最后一首的下一首循环到第一首', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(2)

      store.playNext()

      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')
    })

    it('空列表时 playNext 不报错', () => {

      assert.doesNotThrow(() => store.playNext())
      assert.equal(store.currentIndex, -1)
    })
  })

  describe('playPrev 上一首', () => {
    it('正常切到上一首', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(1)

      store.playPrev()

      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'song-1')
      assert.equal(store.isPlaying, true)
    })

    it('第一首的上一首循环到最后一首', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(0)

      store.playPrev()

      assert.equal(store.currentIndex, 2)
      assert.equal(store.currentSong.id, 'song-3')
    })

    it('空列表时 playPrev 不报错', () => {

      assert.doesNotThrow(() => store.playPrev())
      assert.equal(store.currentIndex, -1)
    })
  })

  describe('togglePlay 播放/暂停切换', () => {
    it('有歌曲时切换播放状态', () => {

      store.addSong(createMockSong('song-1'))

      assert.equal(store.isPlaying, false)
      store.togglePlay()
      assert.equal(store.isPlaying, true)
      store.togglePlay()
      assert.equal(store.isPlaying, false)
    })

    it('没有歌曲时 togglePlay 不改变状态', () => {

      assert.equal(store.isPlaying, false)
      store.togglePlay()
      assert.equal(store.isPlaying, false)
    })
  })

  describe('setPlaying / setCurrentTime / setDuration', () => {
    it('setPlaying 可以设置播放状态', () => {

      store.setPlaying(true)
      assert.equal(store.isPlaying, true)
      store.setPlaying(false)
      assert.equal(store.isPlaying, false)
    })

    it('setCurrentTime 可以设置当前时间', () => {

      store.setCurrentTime(123.45)
      assert.equal(store.currentTime, 123.45)
    })

    it('setDuration 可以设置歌曲时长', () => {

      store.setDuration(256.78)
      assert.equal(store.duration, 256.78)
    })

    it('seekTo 与 setCurrentTime 等效（目前实现）', () => {

      store.seekTo(88.8)
      assert.equal(store.currentTime, 88.8)
    })
  })

  describe('边界情况综合测试', () => {
    it('空列表时切歌不会崩溃', () => {

      assert.doesNotThrow(() => store.playNext())
      assert.doesNotThrow(() => store.playPrev())
      assert.doesNotThrow(() => store.playSong(0))
      assert.doesNotThrow(() => store.removeSong(0))
      assert.doesNotThrow(() => store.togglePlay())
      assert.doesNotThrow(() => store.clearPlaylist())
    })

    it('删除正在播放的歌曲后立即切歌', () => {

      store.addSongs([
        createMockSong('song-1'),
        createMockSong('song-2'),
        createMockSong('song-3')
      ])
      store.playSong(1)

      store.removeSong(1)
      store.playNext()

      assert.equal(store.currentSong.id, 'song-1')
    })

    it('单首歌曲循环切歌', () => {

      store.addSong(createMockSong('only-song'))
      store.playSong(0)

      store.playNext()
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'only-song')

      store.playPrev()
      assert.equal(store.currentIndex, 0)
      assert.equal(store.currentSong.id, 'only-song')
    })
  })
})
