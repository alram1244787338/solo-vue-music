import { describe, it, assert } from './runner.js'
import { formatTime } from '../src/utils/format.js'

describe('formatTime 时间格式化', () => {
  it('正常秒数转换（< 1分钟）', () => {
    assert.equal(formatTime(0), '0:00')
    assert.equal(formatTime(1), '0:01')
    assert.equal(formatTime(30), '0:30')
    assert.equal(formatTime(59), '0:59')
  })

  it('正常秒数转换（> 1分钟）', () => {
    assert.equal(formatTime(60), '1:00')
    assert.equal(formatTime(61), '1:01')
    assert.equal(formatTime(125), '2:05')
    assert.equal(formatTime(3599), '59:59')
  })

  it('处理超过1小时的情况', () => {
    assert.equal(formatTime(3600), '60:00')
    assert.equal(formatTime(3661), '61:01')
    assert.equal(formatTime(7200), '120:00')
  })

  it('处理小数秒数', () => {
    assert.equal(formatTime(1.2), '0:01')
    assert.equal(formatTime(61.999), '1:01')
    assert.equal(formatTime(125.5), '2:05')
  })

  it('处理 0 值', () => {
    assert.equal(formatTime(0), '0:00')
  })

  it('处理负数（应该返回 0:00）', () => {
    assert.equal(formatTime(-1), '0:00')
    assert.equal(formatTime(-100), '0:00')
    assert.equal(formatTime(-0.5), '0:00')
  })

  it('处理 NaN（应该返回 0:00）', () => {
    assert.equal(formatTime(NaN), '0:00')
    assert.equal(formatTime(undefined), '0:00')
    assert.equal(formatTime(null), '0:00')
    assert.equal(formatTime('not a number'), '0:00')
  })
})
