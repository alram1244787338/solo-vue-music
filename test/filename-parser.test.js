import { describe, it, assert } from './runner.js'
import { extractTitleFromFilename } from '../src/utils/filename.js'

describe('extractTitleFromFilename 文件名解析', () => {
  describe('基础编号处理', () => {
    it('处理数字横杠前缀：01-歌手-歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('01-歌手-歌名.mp3'), '歌手 歌名')
    })

    it('处理数字点前缀：01.歌手_歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('01.歌手_歌名.mp3'), '歌手 歌名')
    })

    it('处理数字空格前缀：001 歌手 歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('001 歌手 歌名.mp3'), '歌手 歌名')
    })

    it('处理两位数编号：12-歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('12-歌名.mp3'), '歌名')
    })

    it('处理三位数编号：123 歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('123 歌名.mp3'), '歌名')
    })
  })

  describe('括号包裹编号', () => {
    it('处理中文方括号：【03】歌手·歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('【03】歌手·歌名.mp3'), '歌手 歌名')
    })

    it('处理英文方括号：[05] 歌手 - 歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('[05] 歌手 - 歌名.mp3'), '歌手 歌名')
    })

    it('处理英文圆括号：(02) 歌手_歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('(02) 歌手_歌名.mp3'), '歌手 歌名')
    })

    it('处理中文圆括号：（07）歌手 歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('（07）歌手 歌名.mp3'), '歌手 歌名')
    })
  })

  describe('括号内容移除', () => {
    it('移除质量标记：歌名 [高质量].mp3', () => {
      assert.equal(extractTitleFromFilename('01-歌名 [高质量].mp3'), '歌名')
    })

    it('移除 Live 标记：歌手_歌名 (Live).mp3', () => {
      assert.equal(extractTitleFromFilename('01-歌手_歌名 (Live).mp3'), '歌手 歌名')
    })

    it('移除中文括号：歌手【官方版】歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('01-歌手【官方版】歌名.mp3'), '歌手 歌名')
    })

    it('移除多个括号：(Live) [HQ] 歌名.mp3', () => {
      assert.equal(extractTitleFromFilename('01-(Live) [HQ] 歌名.mp3'), '歌名')
    })
  })

  describe('特殊符号处理', () => {
    it('处理下划线：歌手_歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手_歌名.mp3'), '歌手 歌名')
    })

    it('处理连字符：歌手-歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手-歌名.mp3'), '歌手 歌名')
    })

    it('处理中文间隔号：歌手·歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手·歌名.mp3'), '歌手 歌名')
    })

    it('处理中文顿号：歌手、歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手、歌名.mp3'), '歌手 歌名')
    })

    it('处理混合分隔符：歌手_-_歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手_-_歌名.mp3'), '歌手 歌名')
    })

    it('合并多余空格：歌手  歌名.mp3 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('歌手  歌名.mp3'), '歌手 歌名')
    })
  })

  describe('特殊边界情况', () => {
    it('只有编号和扩展名：001.mp3 → 001', () => {
      assert.equal(extractTitleFromFilename('001.mp3'), '001')
    })

    it('只有编号和分隔符：01-.mp3 → 01', () => {
      assert.equal(extractTitleFromFilename('01-.mp3'), '01')
    })

    it('没有扩展名：01-歌手-歌名 → 歌手 歌名', () => {
      assert.equal(extractTitleFromFilename('01-歌手-歌名'), '歌手 歌名')
    })

    it('开头全是特殊符号：---歌名.mp3 → 歌名', () => {
      assert.equal(extractTitleFromFilename('---歌名.mp3'), '歌名')
    })

    it('全是特殊符号：---___.mp3', () => {
      assert.equal(extractTitleFromFilename('---___.mp3'), '')
    })

    it('多段编号：01-02-歌名.mp3 → 歌名', () => {
      assert.equal(extractTitleFromFilename('01-02-歌名.mp3'), '歌名')
    })

    it('编号后紧跟括号：01(Live)歌名.mp3 → 歌名', () => {
      assert.equal(extractTitleFromFilename('01(Live)歌名.mp3'), '歌名')
    })
  })

  describe('真实场景用例', () => {
    it('复杂场景 1：001 - 周杰伦 - 晴天 [高质量].mp3', () => {
      assert.equal(
        extractTitleFromFilename('001 - 周杰伦 - 晴天 [高质量].mp3'),
        '周杰伦 晴天'
      )
    })

    it('复杂场景 2：【10】林俊杰_江南 (Live版).mp3', () => {
      assert.equal(
        extractTitleFromFilename('【10】林俊杰_江南 (Live版).mp3'),
        '林俊杰 江南'
      )
    })

    it('复杂场景 3：03.陈奕迅 - 十年 (2003).mp3', () => {
      assert.equal(
        extractTitleFromFilename('03.陈奕迅 - 十年 (2003).mp3'),
        '陈奕迅 十年'
      )
    })

    it('复杂场景 4：[007] 王菲·红豆 [无损音质].mp3', () => {
      assert.equal(
        extractTitleFromFilename('[007] 王菲·红豆 [无损音质].mp3'),
        '王菲 红豆'
      )
    })
  })
})
