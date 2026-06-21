export const BAR_COUNT = 64

export const getSimulatedData = (time = Date.now() / 1000, barCount = BAR_COUNT) => {
  const data = []
  for (let i = 0; i < barCount; i++) {
    const wave1 = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5
    const wave2 = Math.sin(time * 3 + i * 0.5) * 0.3 + 0.3
    const wave3 = Math.sin(time * 1.5 + i * 0.15) * 0.2 + 0.2
    const value = (wave1 + wave2 + wave3) / 3
    data.push(Math.floor(value * 255))
  }
  return new Uint8Array(data)
}

export const normalizeFrequencyData = (freqData, barCount = BAR_COUNT) => {
  if (!freqData || freqData.length === 0) {
    return new Array(barCount).fill(0)
  }
  const normalized = new Array(barCount).fill(0)
  const dataLen = freqData.length

  if (dataLen <= barCount) {
    for (let i = 0; i < dataLen && i < barCount; i++) {
      normalized[i] = Math.min(255, Math.max(0, freqData[i]))
    }
    return normalized
  }

  const step = Math.floor(dataLen / barCount)
  for (let i = 0; i < barCount; i++) {
    let sum = 0
    const start = i * step
    const end = Math.min(start + step, dataLen)
    for (let j = start; j < end; j++) {
      sum += freqData[j]
    }
    normalized[i] = step > 0 ? sum / step : 0
    normalized[i] = Math.min(255, Math.max(0, normalized[i]))
  }
  return normalized
}

export const decayBars = (bars) => {
  const currentMax = Math.max(...bars)
  if (currentMax > 1) {
    return bars.map(v => v * 0.9)
  }
  return bars.map(() => 0)
}
