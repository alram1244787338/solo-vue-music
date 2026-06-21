import { describe, it, assert } from './runner.js'
import {
  BAR_COUNT,
  getSimulatedData,
  normalizeFrequencyData,
  decayBars
} from '../src/utils/audioAnalyzer.js'

describe('useAudioAnalyzer 频谱分析逻辑', () => {
  describe('BAR_COUNT 常量', () => {
    it('应该等于 64', () => {
      assert.equal(BAR_COUNT, 64)
    })
  })

  describe('getSimulatedData 模拟频谱数据生成', () => {
    it('返回 Uint8Array 类型', () => {
      const data = getSimulatedData(0)
      assert.ok(data instanceof Uint8Array)
    })

    it('默认返回长度等于 BAR_COUNT (64)', () => {
      const data = getSimulatedData(0)
      assert.equal(data.length, BAR_COUNT)
    })

    it('支持自定义 barCount', () => {
      const data = getSimulatedData(0, 32)
      assert.equal(data.length, 32)
    })

    it('所有值都在 0-255 范围内', () => {
      const data = getSimulatedData(1.5)
      for (let i = 0; i < data.length; i++) {
        assert.ok(data[i] >= 0, `索引 ${i} 的值 ${data[i]} 小于 0`)
        assert.ok(data[i] <= 255, `索引 ${i} 的值 ${data[i]} 大于 255`)
      }
    })

    it('不同时间点生成不同的数据（随时间变化）', () => {
      const data1 = getSimulatedData(0)
      const data2 = getSimulatedData(1)

      let hasDifference = false
      for (let i = 0; i < Math.min(data1.length, data2.length); i++) {
        if (data1[i] !== data2[i]) {
          hasDifference = true
          break
        }
      }
      assert.ok(hasDifference, '不同时间点应该生成不同的数据')
    })

    it('相同时间点生成相同的数据（确定性）', () => {
      const data1 = getSimulatedData(2.5)
      const data2 = getSimulatedData(2.5)

      assert.deepEqual(Array.from(data1), Array.from(data2))
    })

    it('数值有波动，不是全部相同', () => {
      const data = getSimulatedData(3.14)
      const firstValue = data[0]
      let hasDifferent = false

      for (let i = 1; i < data.length; i++) {
        if (data[i] !== firstValue) {
          hasDifferent = true
          break
        }
      }
      assert.ok(hasDifferent, '频谱数据应该有波动，不是全部相同')
    })
  })

  describe('normalizeFrequencyData 频谱数据归一化', () => {
    it('空数据返回全 0 数组', () => {
      const result = normalizeFrequencyData(new Uint8Array(0))
      assert.deepEqual(result, new Array(BAR_COUNT).fill(0))
    })

    it('null 或 undefined 返回全 0 数组', () => {
      let result = normalizeFrequencyData(null)
      assert.deepEqual(result, new Array(BAR_COUNT).fill(0))

      result = normalizeFrequencyData(undefined)
      assert.deepEqual(result, new Array(BAR_COUNT).fill(0))
    })

    it('所有值都被限制在 0-255 范围内', () => {
      const input = new Uint8Array(256)
      for (let i = 0; i < 256; i++) {
        input[i] = i
      }

      const result = normalizeFrequencyData(input)

      for (let i = 0; i < result.length; i++) {
        assert.ok(result[i] >= 0, `索引 ${i} 的值 ${result[i]} 小于 0`)
        assert.ok(result[i] <= 255, `索引 ${i} 的值 ${result[i]} 大于 255`)
      }
    })

    it('对输入数据进行分块平均', () => {
      const input = new Uint8Array(128)
      for (let i = 0; i < 128; i++) {
        input[i] = 100
      }

      const result = normalizeFrequencyData(input, 64)

      for (let i = 0; i < result.length; i++) {
        assert.equal(result[i], 100, `所有平均值应该等于 100，实际是 ${result[i]}`)
      }
    })

    it('支持自定义 barCount', () => {
      const input = new Uint8Array(32)
      for (let i = 0; i < 32; i++) {
        input[i] = 50
      }

      const result = normalizeFrequencyData(input, 16)
      assert.equal(result.length, 16)

      for (let i = 0; i < result.length; i++) {
        assert.equal(result[i], 50)
      }
    })

    it('输入长度小于 barCount 时也能正常工作', () => {
      const input = new Uint8Array([100, 200])
      const result = normalizeFrequencyData(input, 4)

      assert.equal(result.length, 4)
      assert.equal(result[0], 100)
      assert.equal(result[1], 200)
      assert.equal(result[2], 0)
      assert.equal(result[3], 0)
    })

    it('边界值：全 255 输入应该归一化为接近 255', () => {
      const input = new Uint8Array(256).fill(255)
      const result = normalizeFrequencyData(input)

      for (let i = 0; i < result.length; i++) {
        assert.equal(result[i], 255)
      }
    })

    it('边界值：全 0 输入应该归一化为 0', () => {
      const input = new Uint8Array(256).fill(0)
      const result = normalizeFrequencyData(input)

      for (let i = 0; i < result.length; i++) {
        assert.equal(result[i], 0)
      }
    })
  })

  describe('decayBars 暂停时衰减逻辑', () => {
    it('所有值大于 1 时，乘以 0.9 衰减', () => {
      const bars = [100, 50, 200, 150]
      const result = decayBars(bars)

      for (let i = 0; i < bars.length; i++) {
        assert.equal(result[i], bars[i] * 0.9)
      }
    })

    it('最大值 <= 1 时，全部归零', () => {
      const bars = [0.5, 1, 0.8, 0.3]
      const result = decayBars(bars)

      for (let i = 0; i < result.length; i++) {
        assert.equal(result[i], 0)
      }
    })

    it('最大值刚好 > 1 时，仍然衰减不归零', () => {
      const bars = [0.5, 1.1, 0.8]
      const result = decayBars(bars)

      for (let i = 0; i < bars.length; i++) {
        assert.equal(result[i], bars[i] * 0.9)
      }
    })

    it('最大值刚好等于 1 时，归零', () => {
      const bars = [1, 1, 1]
      const result = decayBars(bars)

      assert.deepEqual(result, [0, 0, 0])
    })

    it('全 0 数组保持全 0', () => {
      const bars = [0, 0, 0, 0]
      const result = decayBars(bars)

      assert.deepEqual(result, [0, 0, 0, 0])
    })

    it('连续调用会逐渐衰减到 0', () => {
      let bars = [100, 100, 100]

      for (let i = 0; i < 100; i++) {
        bars = decayBars(bars)
        if (Math.max(...bars) <= 1) {
          bars = decayBars(bars)
          break
        }
      }

      assert.deepEqual(bars, [0, 0, 0])
    })

    it('不修改原数组', () => {
      const bars = [100, 50, 200]
      const barsCopy = [...bars]
      decayBars(bars)

      assert.deepEqual(bars, barsCopy)
    })
  })
})
