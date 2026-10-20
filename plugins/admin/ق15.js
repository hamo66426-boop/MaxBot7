// plugins/ق15.js - قسم البحث 🔍
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'
import fetch from 'node-fetch'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'
const DEV_NUMBER = '201118680635'
const DEV_URL = `https://wa.me/${DEV_NUMBER}`
const FOOTER = '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️'

const ALL_SECTIONS = [
  { title: '👮‍♂️ قـسـم المشرفين',           description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق1'  },
  { title: '🎨 قـسـم الملصقات',             description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق2'  },
  { title: '🎮 قـسـم الألعاب',              description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق3'  },
  { title: '📥 قـسـم التحميل',             description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق4'  },
  { title: '🔧 قـسـم الأدوات',             description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق5'  },
  { title: '🤖 قـسـم الذكاء',              description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق7'  },
  { title: '🖼️ قـسـم الصور',              description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق9'  },
  { title: '🎉 قـسـم التسلية',             description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق10' },
  { title: '📿 قـسـم الإسلاميات',          description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق16' },
  { title: '🔍 قـسـم البحث',               description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق15' },
  { title: '🤖 قـسـم بوتات فرعية',          description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق14' },
  { title: '👥 قـسـم الجروبات',            description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق13' },
  { title: '👑 قـسـم المطور',              description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق12' },
  { title: '📂 قـسـم آخر',                description: '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻', id: '.ق17' }
]

function extractCommandsByTag(tags, usedPrefix = '.') {
  const target = []
  if (!global.plugins) return target
  const tagsArr = Array.isArray(tags) ? tags : [tags]
  for (const plugin of Object.values(global.plugins)) {
    if (!plugin || !plugin.tags || !Array.isArray(plugin.tags)) continue
    if (!tagsArr.some((t) => plugin.tags.includes(t))) continue
    const cmdDef = plugin.command
    if (!cmdDef) continue
    const addCmd = (c) => { if (typeof c === 'string' && c.trim()) target.push(usedPrefix + c.trim()) }
    if (Array.isArray(cmdDef)) cmdDef.forEach(addCmd)
    else if (typeof cmdDef === 'string') addCmd(cmdDef)
    else if (cmdDef instanceof RegExp) {
      const src = cmdDef.source.replace(/^\^/, '').replace(/\$$/, '').replace(/\/[gis]*$/, '')
      const first = src.split('|')[0].replace(/[()]/g, '')
      if (first) target.push(usedPrefix + first)
    }
  }
  return [...new Set(target)].sort()
}

function formatCommandsList(commands) {
  if (!commands || commands.length === 0) return '├ׁ̟̇˚₊· ͟͟͞͞➳❥ لا توجد أوامر بعد'
  return commands.map((cmd) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${cmd}`).join('\n')
}

async function makeFkontak(imageUrl) {
  try {
    const res = await fetch(imageUrl)
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂' },
      message: { locationMessage: { name: FOOTER, jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch { return undefined }
}

let handler = async (m, { conn }) => {
  try {
    const emoji = '🔍'
    const title = 'قـسـم البحث'
    const imageUrl = 'https://github.com/tast53534-svg/-26-/raw/refs/heads/main/IMG-20260904-WA0059.jpg'
    const SECTION_TAGS = ['search']

    const speed = (performance.now() - performance.now()).toFixed(4)
    const user = await conn.getName(m.sender)
    const number = m.sender.split('@')[0]
    const fecha = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const hora = new Date().toLocaleTimeString('ar-SA')

    await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

    const commands = extractCommandsByTag(SECTION_TAGS, '.')

    const menuText = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ${emoji} *${title}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الاسم: ${user}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الرقم: ${number}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ البينج: ${speed}ms
├ׁ̟̇˚₊· ͟͟͞͞➳❥ التاريخ: ${fecha}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الوقت: ${hora}
│
│ ❄️ ═══════════════ ❄️
│ ${emoji} *الأوامر (${commands.length}):*
│
${formatCommandsList(commands)}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

    let media = null
    try {
      const res = await fetch(imageUrl)
      const buf = Buffer.from(await res.arrayBuffer())
      media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer })
    } catch {}

    const payload = {
      body: { text: menuText },
      footer: { text: FOOTER },
      header: { hasMediaAttachment: !!media, subtitle: title, ...(media ? { imageMessage: media.imageMessage } : {}) },
      nativeFlowMessage: {
        buttons: [
          { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📂 عـرض الأقـسـام', sections: [{ title: 'اخـتـر الـقـسـم الـمـطـلـوب', rows: ALL_SECTIONS }] }) },
          { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 قـنـاة الـبـوت', url: CHANNEL }) },
          { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🤖 تـنـصـيـب وحـدة', id: '.تنصيب' }) },
          { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '👑 الـمـطـور', url: DEV_URL }) }
        ],
        messageParamsJson: JSON.stringify({
          limited_time_offer: { text: `⚡ ${speed}ms`, url: DEV_URL, copy_code: `المطور: +${DEV_NUMBER}`, expiration_time: Date.now() + 86400000 },
          bottom_sheet: { in_thread_buttons_limit: 1, divider_indices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999], list_title: '❄️ قـائـمـة أقـسـام ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂', button_title: '▻ عـرض الأقـسـام ⚡' },
          tap_target_configuration: { description: 'ابـدأ الآن مـع 𝑴𝑨𝑿 𝑩𝑶𝑻', canonical_url: DEV_URL, domain: 'https://ryzobot.vercel.app', button_index: 0 }
        })
      }
    }

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
    const fkontak = await makeFkontak(imageUrl)
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch (e) {
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-ق15]', e)
    await conn.sendMessage(m.chat, { text: `❌ خطأ: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['ق15']
handler.tags = ['main']
export default handler