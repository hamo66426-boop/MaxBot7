// plugins/تغيير.js
// تغيير هوية البوت بالكامل - ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ===============================
// الهوية الجديدة
// ===============================

const NEW_NAME = '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂'

const NEW_CHANNEL_URL =
  'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

const NEW_CHANNEL_JID =
  '120363424844460135@newsletter'

const NEW_IMAGES = [
  'https://files.catbox.moe/p6jm0g.jpg',
  'https://files.catbox.moe/qeqajh.jpg',
  'https://files.catbox.moe/kahw8j.jpg'
]

// ===============================
// ملفات / مجلدات ممنوع لمسها
// ===============================

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.npm',
  '.cache',
  'sessions',
  'session',
  'auth',
  'auth_info',
  'jadibot',
  'tmp',
  'temp',
  '.change-backup'
])

const ALLOWED_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.txt'
])

// ===============================
// صاحب الأمر فقط
// ===============================

function getSenderNumber(m) {
  const jid =
    m.sender ||
    m.participant ||
    m.key?.participant ||
    ''

  return String(jid)
    .split('@')[0]
    .replace(/\D/g, '')
}

function isOwnerUser(m) {
  const sender = getSenderNumber(m)

  const owners = [
    ...(global.owner || []),
    ...(global.mods || [])
  ]
    .map(x => String(x).replace(/\D/g, ''))
    .filter(Boolean)

  return owners.includes(sender)
}

// ===============================
// البحث عن مجلد البوت
// ===============================

function getBotRoot() {
  // في أغلب الحالات plugins موجودة مباشرة داخل جذر البوت
  const possible = [
    path.resolve(__dirname, '..'),
    process.cwd()
  ]

  for (const p of possible) {
    if (
      fs.existsSync(path.join(p, 'index.js')) ||
      fs.existsSync(path.join(p, 'settings.js')) ||
      fs.existsSync(path.join(p, 'handler.js'))
    ) {
      return p
    }
  }

  return path.resolve(__dirname, '..')
}

// ===============================
// جمع الملفات
// ===============================

function collectFiles(dir, result = []) {
  let entries

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return result
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue

      // تجاهل المجلدات المخفية غير المهمة
      if (
        entry.name.startsWith('.') &&
        entry.name !== '.plugins'
      ) {
        continue
      }

      collectFiles(fullPath, result)
      continue
    }

    if (!entry.isFile()) continue

    const ext = path.extname(entry.name).toLowerCase()

    if (!ALLOWED_EXTENSIONS.has(ext)) continue

    // لا يعدل نفسه أثناء البحث
    if (path.resolve(fullPath) === path.resolve(__filename)) {
      continue
    }

    result.push(fullPath)
  }

  return result
}

// ===============================
// استبدال اسم البوت
// ===============================

function replaceBotNames(content) {
  let changed = content

  /*
   * الأسماء الكاملة الموجودة فعلياً في نسخة البوت.
   *
   * الترتيب مهم:
   * نستبدل الاسم الكامل أولاً حتى نحافظ
   * على الزخارف الموجودة حول الاسم.
   */

  const exactNames = [
    '✧ 𝟐𝐁 - YoRHa Unit No.2 Type B ✧',
    '✧ 𝟐𝐁 - YoRHa Unit ✧',

    '✧ 2B - YoRHa Unit No.2 Type B ✧',
    '✧ 2B - YoRHa Unit ✧',

    '❄️ 2B - YoRHa Unit No.2 Type B ❄️',
    '❄️ 2B - YoRHa Unit ❄️',

    '2B - YoRHa Unit No.2 Type B',
    '2B - YoRHa Unit No.2 Type B',
    '2B - YoRHa Unit',
    'YoRHa No.2 Type B',

    '𝟐𝐁 - YoRHa Unit No.2 Type B',
    '𝟐𝐁 - YoRHa Unit',

    '𝟐𝐁'
  ]

  for (const oldName of exactNames) {
    changed = changed.split(oldName).join(NEW_NAME)
  }

  /*
   * حالات مثل:
   *
   * "2B: خطأ"
   * "[2B]"
   * "2B:"
   *
   * نستبدل 2B فقط عندما تكون داخل نص واضح،
   * بدون لمس أرقام أو IDs أو أسماء متغيرات.
   */

  changed = changed.replace(
    /(["'`])([^"'`\n]*?)\b2B\b([^"'`\n]*?)\1/g,
    (match, quote, before, after) => {
      return `${quote}${before}${NEW_NAME}${after}${quote}`
    }
  )

  changed = changed.replace(
    /(["'`])([^"'`\n]*?)𝟐𝐁([^"'`\n]*?)\1/g,
    (match, quote, before, after) => {
      return `${quote}${before}${NEW_NAME}${after}${quote}`
    }
  )

  return changed
}

// ===============================
// استبدال روابط القنوات
// ===============================

function replaceChannels(content) {
  let changed = content

  // روابط القناة القديمة
  changed = changed.replace(
    /https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9?=&._%-]+/g,
    (url) => {
      // لا نغير الرابط الجديد
      if (url === NEW_CHANNEL_URL) return url
      return NEW_CHANNEL_URL
    }
  )

  // JID القنوات
  changed = changed.replace(
    /\b\d{15,25}@newsletter\b/g,
    (jid) => {
      if (jid === NEW_CHANNEL_JID) return jid
      return NEW_CHANNEL_JID
    }
  )

  return changed
}

// ===============================
// اكتشاف روابط الصور
// ===============================

function isImageUrl(value) {
  if (!/^https?:\/\//i.test(value)) return false

  return /\.(?:jpg|jpeg|png|webp|gif)(?:\?.*)?$/i.test(value)
}

// ===============================
// تغيير الصور
// ===============================

function replaceImages(content, imageState) {
  let changed = content

  /*
   * نبحث عن روابط الصور الموجودة داخل النصوص.
   * الصور الجديدة نفسها لا يتم تغييرها.
   */

  const imageRegex =
    /https?:\/\/[^\s"'`<>\\]+?\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'`<>\\]*)?/gi

  changed = changed.replace(imageRegex, (oldUrl) => {
    if (NEW_IMAGES.includes(oldUrl)) {
      return oldUrl
    }

    const image =
      NEW_IMAGES[imageState.index % NEW_IMAGES.length]

    imageState.index++

    return image
  })

  return changed
}

// ===============================
// تعديل إعدادات الاسم العالمية
// ===============================

function replaceGlobalIdentity(content) {
  let changed = content

  // global.botName
  changed = changed.replace(
    /global\.botName\s*=\s*(['"`])[\s\S]*?\1/g,
    `global.botName = '${NEW_NAME}'`
  )

  // global.botNameShort
  changed = changed.replace(
    /global\.botNameShort\s*=\s*(['"`])[\s\S]*?\1/g,
    `global.botNameShort = '${NEW_NAME}'`
  )

  // global.watermark
  changed = changed.replace(
    /global\.watermark\s*=\s*(['"`])[\s\S]*?\1/g,
    `global.watermark = '${NEW_NAME}'`
  )

  // packname
  changed = changed.replace(
    /global\.packname\s*=\s*(['"`])[\s\S]*?\1/g,
    `global.packname = '${NEW_NAME}'`
  )

  // author
  changed = changed.replace(
    /global\.author\s*=\s*(['"`])[\s\S]*?\1/g,
    `global.author = '${NEW_NAME}'`
  )

  return changed
}

// ===============================
// النسخ الاحتياطي
// ===============================

function createBackup(root) {
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')

  const backupDir = path.join(
    root,
    '.change-backup',
    stamp
  )

  fs.mkdirSync(backupDir, { recursive: true })

  return backupDir
}

function backupFile(root, backupDir, file) {
  const relative = path.relative(root, file)
  const destination = path.join(backupDir, relative)

  fs.mkdirSync(path.dirname(destination), {
    recursive: true
  })

  fs.copyFileSync(file, destination)
}

// ===============================
// Handler
// ===============================

let handler = async (m, { conn }) => {

  // حماية الأمر
  if (!isOwnerUser(m)) {
    return m.reply(
      '☠️💀 *الأمر ده للمطور/المالك فقط.*'
    )
  }

  const root = getBotRoot()

  try {

    await m.reply(
      '☠️💀 *جاري تغيير هوية البوت...*\n\n' +
      '⏳ بفحص ملفات البوت كلها...'
    )

    const files = collectFiles(root)

    if (!files.length) {
      return m.reply(
        '❌ لم أجد ملفات برمجية داخل البوت.'
      )
    }

    const backupDir = createBackup(root)

    let changedFiles = 0
    let changedNames = 0
    let changedImages = 0
    let changedChannels = 0

    const imageState = {
      index: 0
    }

    for (const file of files) {

      let original

      try {
        original = fs.readFileSync(file, 'utf8')
      } catch {
        continue
      }

      let updated = original

      // الاسم
      const afterNames = replaceBotNames(updated)

      if (afterNames !== updated) {
        changedNames++
      }

      updated = afterNames

      // الإعدادات العالمية
      updated = replaceGlobalIdentity(updated)

      // القنوات
      const beforeChannel = updated
      updated = replaceChannels(updated)

      if (beforeChannel !== updated) {
        changedChannels++
      }

      // الصور
      const beforeImages = updated
      updated = replaceImages(updated, imageState)

      if (beforeImages !== updated) {
        changedImages++
      }

      // الملف لم يتغير
      if (updated === original) {
        continue
      }

      // نسخة احتياطية
      try {
        backupFile(root, backupDir, file)
      } catch {
        continue
      }

      try {
        fs.writeFileSync(file, updated, 'utf8')
        changedFiles++
      } catch (e) {
        console.error(
          '[تغيير] فشل تعديل:',
          file,
          e
        )
      }
    }

    // ===============================
    // تحديث الإعدادات في الذاكرة
    // ===============================

    global.botName = NEW_NAME
    global.botNameShort = NEW_NAME
    global.watermark = NEW_NAME
    global.packname = NEW_NAME
    global.author = NEW_NAME

    global.ch = {
      ch1: NEW_CHANNEL_JID
    }

    global.soporteGB = NEW_CHANNEL_URL

    global.dfailPool = [...NEW_IMAGES]

    // ===============================
    // النتيجة
    // ===============================

    await conn.sendMessage(
      m.chat,
      {
        text:
`☠️💀 *تم تغيير هوية البوت بنجاح*

╭━━━〔 ☠️💀 〕━━━╮
┃ الاسم الجديد:
┃ ${NEW_NAME}
┃
┃ القناة:
┃ ${NEW_CHANNEL_URL}
┃
┃ JID:
┃ ${NEW_CHANNEL_JID}
┃
┃ الملفات المعدلة:
┃ ${changedFiles}
┃
┃ ملفات تم تغيير الاسم فيها:
┃ ${changedNames}
┃
┃ ملفات الصور:
┃ ${changedImages}
┃
┃ ملفات القنوات:
┃ ${changedChannels}
╰━━━〔 ☠️💀 〕━━━╯

☠️💀 *تم أخذ نسخة احتياطية قبل التعديل.*

📁 ${path.relative(root, backupDir)}

⚠️ *أعد تشغيل البوت بعد تنفيذ الأمر حتى تظهر الهوية الجديدة في كل مكان.*`
      },
      { quoted: m }
    )

  } catch (error) {

    console.error(
      '[تغيير] ERROR:',
      error
    )

    await m.reply(
      '❌ حصل خطأ أثناء تغيير الهوية.\n\n' +
      '```' +
      String(error?.message || error) +
      '```'
    )
  }
}

handler.help = ['تغيير']
handler.tags = ['owner']
handler.command = /^(تغيير)$/i

export default handler