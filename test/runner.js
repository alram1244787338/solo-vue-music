import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const testResults = []
let currentTest = null
let currentSuite = null
const beforeEachHooksStack = [[]]

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
}

const findTestFiles = (dir) => {
  const files = []
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      files.push(...findTestFiles(fullPath))
    } else if (entry.endsWith('.test.js')) {
      files.push(fullPath)
    }
  }
  return files
}

export const describe = (name, fn) => {
  currentSuite = name
  beforeEachHooksStack.push([])
  console.log(`\n${colors.blue}${colors.bold}📦 ${name}${colors.reset}`)
  fn()
  beforeEachHooksStack.pop()
  currentSuite = null
}

export const it = (name, fn) => {
  currentTest = { suite: currentSuite, name, status: 'pending' }
  try {
    for (const hooks of beforeEachHooksStack) {
      for (const hook of hooks) {
        hook()
      }
    }
    fn()
    currentTest.status = 'passed'
    testResults.push(currentTest)
    console.log(`  ${colors.green}✓${colors.reset} ${colors.gray}${name}${colors.reset}`)
  } catch (err) {
    currentTest.status = 'failed'
    currentTest.error = err
    testResults.push(currentTest)
    console.log(`  ${colors.red}✗${colors.reset} ${colors.red}${name}${colors.reset}`)
    console.log(`    ${colors.gray}${err.message}${colors.reset}`)
    if (err.expected !== undefined) {
      console.log(`    ${colors.gray}expected: ${JSON.stringify(err.expected)}${colors.reset}`)
      console.log(`    ${colors.gray}actual:   ${JSON.stringify(err.actual)}${colors.reset}`)
    }
  }
  currentTest = null
}

export const beforeEach = (fn) => {
  const currentHooks = beforeEachHooksStack[beforeEachHooksStack.length - 1]
  currentHooks.push(fn)
}

export { assert }

export const runTests = async () => {
  const testFiles = findTestFiles(__dirname)

  console.log(`${colors.bold}🚀 运行测试中...${colors.reset}`)
  console.log(`${colors.gray}找到 ${testFiles.length} 个测试文件${colors.reset}`)

  for (const file of testFiles) {
    const fileUrl = pathToFileURL(file).href
    try {
      await import(fileUrl)
    } catch (err) {
      console.log(`\n${colors.red}✗ 加载测试文件失败: ${file}${colors.reset}`)
      console.log(`  ${err.message}${colors.reset}`)
      if (err.stack) {
        console.log(`  ${colors.gray}${err.stack.split('\n').slice(0, 3).join('\n  ')}${colors.reset}`)
      }
      testResults.push({
        suite: file,
        name: '加载测试文件',
        status: 'failed',
        error: err
      })
    }
  }

  const passed = testResults.filter(t => t.status === 'passed').length
  const failed = testResults.filter(t => t.status === 'failed').length
  const total = testResults.length

  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)

  if (failed > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ 测试失败${colors.reset}`)
    console.log(`   ${colors.gray}通过: ${passed}${colors.reset}`)
    console.log(`   ${colors.red}失败: ${failed}${colors.reset}`)
    console.log(`   ${colors.gray}总计: ${total}${colors.reset}`)
    process.exit(1)
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ 所有测试通过${colors.reset}`)
    console.log(`   ${colors.green}通过: ${passed}${colors.reset}`)
    console.log(`   ${colors.gray}总计: ${total}${colors.reset}`)
    process.exit(0)
  }
}
