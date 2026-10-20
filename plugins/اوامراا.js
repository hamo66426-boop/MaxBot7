import { performance } from 'perf_hooks'
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL_JID = '120363424844460135@newsletter'
const CHANNEL_NAME = ' 𝑩𝑶𝑻 𝑴𝑨𝑿 📢'
const MAIN_IMAGE_URL = 'https://i.ibb.co/jZkHXkNw/edabe78b71fe6d899c4bfd84c31e6083.jpg'
const FOOTER = '🥂 𝑩𝑶𝑻 𝑴𝑨𝑿 - 𝑶𝑵𝑳𝒀 👑'

const buildContext = (jid) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_JID,
    newsletterName: CHANNEL_NAME,
    serverMessageId: 0
  },
  externalAdReply: {
    title: '🍷 𝐁𝐎𝐓 𝐌𝐀𝐗 🍷',
    body: '☠️ MAX BOT MENU 💀',
    thumbnailUrl: MAIN_IMAGE_URL,
    sourceUrl: 'https://github.com/tast53534-svg/-26-',
    mediaType: 1,
    renderLargerThumbnail: true
  }
})

let handler = async (m, { conn, usedPrefix: _p, isROwner }) => {
  try {
    const startedAt = performance.now()
    let speed = '...'

    const user = await conn.getName(m.sender)
    speed = (performance.now() - startedAt).toFixed(2)
    const fecha = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const senderIds = [
      m.sender,
      m.key?.participantAlt,
      m.key?.remoteJidAlt,
      m.key?.participant,
      m.key?.remoteJid
    ].filter(Boolean).map(id => String(id).split('@')[0].split(':')[0].replace(/\D/g, ''))

    const isWife = senderIds.some(id => ['201027036920', '198621416915136'].includes(id))
    let role = isWife ? 'مرات الرئيس 👑' : isROwner ? 'رئيس 👑' : 'مواطن'

    await conn.sendMessage(m.chat, { react: { text: '🥂', key: m.key } })

    let menuText = `> ╭━━━ 🍷 𝐁𝐎𝐓 𝐌𝐀𝐗 🍷 ━━━╮
> ┃
> > ❄️ *مـعـلـومـات الـوَحـدَة* 🍻
> ┃
> > 👤 *الاسم:* ${user}
> > 👑 *الرتبة:* ${role}
> > ⚡ *السرعة:* ${speed} ms
> > 📅 *التاريخ:* ${fecha}
> ┃
> ╰━━━━━━━━━━━━━━━━━━━━━━╯`

    const sections = [{
      title: "☠️ الأقـسـام الـرئـيـسـيـة 💀",
      rows: [
        { title: "👨🏻‍✈️ قـسـم الأدمن",           description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق1"  },
        { title: "🎨 قـسـم الاستـيكـر",             description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق2"  },
        { title: "🎮 قـسـم الألعاب",              description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق3"  },
        { title: "📥 قـسـم التحميلات",             description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق4"  },
        { title: "🔧 قـسـم الأدوات",             description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق5"  },
        { title: "🤖 قـسـم الذكاء",              description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق7"  },
        { title: "🖼️ قـسـم الصور",              description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق9"  },
        { title: "🎉 قـسـم التسلية",             description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق10" },
        { title: "📿 قـسـم الإسلاميات",          description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق16" },
        { title: "🔍 قـسـم البحث",               description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق15" },
        { title: "🤖 قـسـم بوتات فرعية",          description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق14" },
        { title: "👥 قـسـم الجروبات",            description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق13" },
        { title: "👑 قـسـم المــالك",              description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق12" },
        { title: "📂 قـسـم آخر",                description: "🍷 𝑴𝒂𝒙 𝑼𝒏𝒊𝒕", id: ".ق17" }
      ]
    }]

    try {
      await new ButtonV2(conn)
        .setBody(menuText)
        .setFooter(FOOTER)
        .addRawButton({
          buttonText: { displayText: ' 🥂 الاقسام  ' },
          buttonId: 'menu',
          type: 1,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: "اخـتـر الـقـسـم",
              sections: sections
            })
          }
        })
        .addButton('👑 المطور', '.المطور')
        .send(m.chat)
    } catch (e) {
      console.error('[menu] ButtonV2 failed:', e.message)
      await conn.sendMessage(m.chat, {
        text: menuText,
        contextInfo: buildContext(m.sender)
      }, { quoted: m })
    }
  } catch (e) {
    console.error('[MAX BOT Menu] Error:', e);
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['الاوامر', 'menu', 'اوامر', 'القائمة', 'منيو']

export default handler
