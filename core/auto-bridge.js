// auto-bridge.js
// 🌉 Auto-Bridge Generator - 2B 𝑴𝑨𝑿 𝑩𝑶𝑻
// بيكتشف نوع الـ exports تلقائيًا ويعمل جسر صحيح لكل ملف

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CORE_DIR = path.join(__dirname, 'core')
const PLUGINS_DIR = path.join(__dirname, 'plugins')
const BRIDGE_DIR = path.join(PLUGINS_DIR, 'core')

// ═══════════════════════════════════════════════════════
// 🔍 كشف نوع الـ exports
// ═══════════════════════════════════════════════════════
function detectExports(filePath) {
  let content = ''
  try {
    content = fs.readFileSync(filePath, 'utf8')
  } catch {
    return { hasDefault: false, hasNamed: false }
  }

  // نشيل التعليقات عشان منغلطش
  const clean = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')

  const hasDefault = /export\s+default\s+/.test(clean)
  const hasNamed =
    /export\s+(const|let|var|function|class|async\s+function)\s+/.test(clean) ||
    /export\s*\{[^}]*\}/.test(clean)

  return { hasDefault, hasNamed }
}

// ═══════════════════════════════════════════════════════
// 📝 توليد محتوى الجسر
// ═══════════════════════════════════════════════════════
export function generateBridgeContent(fileName) {
  const rel = `../../core/${fileName}`
  const header = `// 🌉 Auto-Bridge → ${rel}\n// ⚠️ متعدلش الملف ده — بيتعمل تلقائيًا\n\n`

  const realPath = path.join(CORE_DIR, fileName)
  const { hasDefault, hasNamed } = detectExports(realPath)

  if (hasDefault && hasNamed) {
    return `${header}export { default } from '${rel}'\nexport * from '${rel}'\n`
  }
  if (hasDefault) {
    return `${header}export { default } from '${rel}'\n`
  }
  if (hasNamed) {
    return `${header}export * from '${rel}'\n`
  }
  // لو مش معروف، نستخدم named (أأمن)
  return `${header}export * from '${rel}'\n`
}

// ═══════════════════════════════════════════════════════
// 🎯 إنشاء الجسور
// ═══════════════════════════════════════════════════════
export function createBridges({ force = true, silent = false, logger = console } = {}) {
  const log = silent ? () => {} : (msg) => logger.info ? logger.info(msg) : console.log(msg)
  const logErr = silent ? () => {} : (msg) => logger.error ? logger.error(msg) : console.error(msg)

  if (!fs.existsSync(CORE_DIR)) {
    logErr('[🌉] مجلد core/ مش موجود')
    return { created: 0, updated: 0, skipped: 0, failed: 0 }
  }

  if (!fs.existsSync(BRIDGE_DIR)) {
    fs.mkdirSync(BRIDGE_DIR, { recursive: true })
    log('[🌉] تم إنشاء plugins/core/')
  }

  const coreFiles = fs.readdirSync(CORE_DIR).filter((f) => f.endsWith('.js'))

  let created = 0
  let updated = 0
  let skipped = 0
  let failed = 0

  for (const fileName of coreFiles) {
    const bridgePath = path.join(BRIDGE_DIR, fileName)
    const exists = fs.existsSync(bridgePath)

    if (exists && !force) {
      skipped++
      continue
    }

    try {
      const content = generateBridgeContent(fileName)
      const old = exists ? fs.readFileSync(bridgePath, 'utf8') : ''

      if (old === content) {
        skipped++
        continue
      }

      fs.writeFileSync(bridgePath, content, 'utf8')

      if (exists) {
        updated++
        log(`[🌉] Updated: ${fileName}`)
      } else {
        created++
        log(`[🌉] Created: ${fileName}`)
      }
    } catch (err) {
      failed++
      logErr(`[🌉] Failed ${fileName}: ${err.message}`)
    }
  }

  log(`[🌉] Bridges: ${created} created, ${updated} updated, ${skipped} skipped, ${failed} failed`)
  return { created, updated, skipped, failed }
}

// ═══════════════════════════════════════════════════════
// 🗑️ حذف الجسور
// ═══════════════════════════════════════════════════════
export function removeBridges({ silent = false } = {}) {
  const log = silent ? () => {} : console.log

  if (!fs.existsSync(BRIDGE_DIR)) {
    log('[🌉] مفيش جسور')
    return
  }

  const files = fs.readdirSync(BRIDGE_DIR).filter((f) => f.endsWith('.js'))
  for (const f of files) {
    fs.unlinkSync(path.join(BRIDGE_DIR, f))
  }

  if (fs.readdirSync(BRIDGE_DIR).length === 0) {
    fs.rmdirSync(BRIDGE_DIR)
  }

  log(`[🌉] تم حذف ${files.length} جسر`)
}

// ═══════════════════════════════════════════════════════
// 📋 عرض حالة الجسور
// ═══════════════════════════════════════════════════════
export function listBridges({ silent = false } = {}) {
  const log = silent ? () => {} : console.log

  if (!fs.existsSync(BRIDGE_DIR)) {
    log('[🌉] مفيش مجلد جسور')
    return []
  }

  const bridges = fs.readdirSync(BRIDGE_DIR).filter((f) => f.endsWith('.js'))
  log(`[🌉] عدد الجسور: ${bridges.length}`)

  for (const file of bridges.sort()) {
    const realPath = path.join(CORE_DIR, file)
    const exists = fs.existsSync(realPath)
    const status = exists ? '✅' : '❌'
    log(`  ${status} ${file}`)
  }

  return bridges
}

// ═══════════════════════════════════════════════════════
// 🚀 تشغيل مباشر (node auto-bridge.js)
// ═══════════════════════════════════════════════════════
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`

if (isMain) {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║  🌉 Auto-Bridge Generator — ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ 𝑴𝑨𝑿 𝑩𝑶𝑻     ║')
  console.log('╚══════════════════════════════════════════╝\n')

  const args = process.argv.slice(2)

  if (args.includes('--remove') || args.includes('-r')) {
    removeBridges()
  } else if (args.includes('--list') || args.includes('-l')) {
    listBridges()
  } else {
    // افتراضي: force لإعادة إنشاء كل الجسور صح
    createBridges({ force: true })
  }
}

export default { createBridges, removeBridges, listBridges }