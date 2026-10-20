// plugins/منشن.js - منشن تفاعلي 📢
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'
import fetch from 'node-fetch'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'
const FOOTER = '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂'
const IMAGE_URL = 'https://files.catbox.moe/p6jm0g.jpg'

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

let handler = async (m, { conn, args, isAdmin, isOwner, groupMetadata }) => {
  try {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    let chatId = m.chat
    let metadata = groupMetadata || await conn.groupMetadata(chatId)
    let participants = metadata.participants

    await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } })

    const convertAll = async (jids) => {
      const out = []
      for (const jid of jids) {
        try {
          const clean = await conn.convertLidToRealJid(jid, chatId)
          out.push(clean || jid)
        } catch {
          out.push(jid)
        }
      }
      return out
    }

    let allJids = participants.map(p => p.id)
    let adminJids = participants.filter(p => p.admin).map(p => p.id)
    let memberJids = participants.filter(p => !p.admin).map(p => p.id)

    allJids = await convertAll(allJids)
    adminJids = await convertAll(adminJids)
    memberJids = await convertAll(memberJids)

    // ========== تنفيذ المنشن حسب النوع ==========
    if (args[0]) {
      let subCmd = args[0]?.toLowerCase()
      let targetMentions = []
      let tagTitle = ""

      if (subCmd === 'admin') {
        targetMentions = adminJids
        tagTitle = "👑 *مـنـشـن الـمـشـرفـيـن*"
      } else if (subCmd === 'member') {
        targetMentions = memberJids
        tagTitle = "👥 *مـنـشـن الأعـضـاء*"
      } else if (subCmd === 'all') {
        targetMentions = allJids
        tagTitle = "📢 *مـنـشـن لـلـجـمـيـع*"
      } else if (subCmd === 'online') {
        try {
          let presence = conn.chats[chatId]?.presences || {}
          targetMentions = participants
            .map(p => p.id)
            .filter(id => presence[id]?.lastKnownPresence === 'available')
          targetMentions = await convertAll(targetMentions)
        } catch {
          targetMentions = []
        }
        if (targetMentions.length === 0) {
          targetMentions = allJids.sort(() => Math.random() - 0.5).slice(0, Math.min(10, allJids.length))
        }
        tagTitle = "🟢 *مـنـشـن الـمـتـصـلـيـن الآن*"
      } else {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        return conn.reply(m.chat, `❌ نـوع غـيـر صـحـيـح\n\nadmin / member / all / online`, m)
      }

      if (targetMentions.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
        return conn.reply(m.chat, `⚠️ لـم يـتـم الـعـثـور عـلـى أعـضـاء`, m)
      }

      const list = targetMentions
        .map((jid, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. @${jid.split('@')[0]}`)
        .join('\n')

      let teks = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝐘𝐨𝐑𝐇𝐚· ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ${tagTitle}
│
│ ❄️ ═══════════════ ❄️
${list}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإجمالي: ${targetMentions.length}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

      await conn.sendMessage(m.chat, { text: teks, mentions: targetMentions }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    // ========== القائمة الرئيسية بأزرار interactive ==========
    const speed = '0.0001'
    const user = await conn.getName(m.sender)
    const number = m.sender.split('@')[0]
    const fecha = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const hora = new Date().toLocaleTimeString('ar-SA')

    const menuText = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝐘𝐨𝐑𝐇𝐚· ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 📢 *نـظـام الـمـنـشـن*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الاسم: ${user}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الرقم: ${number}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ البينج: ${speed}ms
├ׁ̟̇˚₊· ͟͟͞͞➳❥ التاريخ: ${fecha}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الوقت: ${hora}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الجروب: ${metadata.subject}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ المشرفين: ${adminJids.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الأعضاء: ${memberJids.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإجمالي: ${allJids.length}
│
│ 🔮 *اخـتـر نـوع الـمـنـشـن*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

    let media = null
    try {
      const res = await fetch(IMAGE_URL)
      const buf = Buffer.from(await res.arrayBuffer())
      media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer })
    } catch {}

    const payload = {
      body: { text: menuText },
      footer: { text: FOOTER },
      header: { hasMediaAttachment: !!media, subtitle: 'نـظـام الـمـنـشـن', ...(media ? { imageMessage: media.imageMessage } : {}) },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '👑 المشرفين', id: '.منشن admin' })
          },
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '👥 الأعضاء', id: '.منشن member' })
          },
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '📢 الجميع', id: '.منشن all' })
          },
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '🟢 المتصلين', id: '.منشن online' })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({ display_text: '📢 قـنـاة الـبـوت', url: CHANNEL })
          }
        ],
        messageParamsJson: JSON.stringify({
          bottom_sheet: { in_thread_buttons_limit: 1, divider_indices: [1, 2, 3, 4, 5, 999], list_title: '❄️ قـائـمـة الـمـنـشـن', button_title: '▻ عـرض الاخـتـيـارات ⚡' }
        })
      }
    }

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
    const fkontak = await makeFkontak(IMAGE_URL)
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('[منشن]', e)
    await conn.sendMessage(m.chat, { text: `❌ خطأ: ${e.message}` }, { quoted: m })
  }
}

handler.help = ['منشن']
handler.tags = ['admin']
handler.command = /^(منشن|منشنز|mention|totag)$/i
handler.group = true
handler.admin = true

export default handler