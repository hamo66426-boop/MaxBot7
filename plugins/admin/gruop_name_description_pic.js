// plugins/جروب.js - جروب_اسم / جروب_وصف / جروب_صوره 👥
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import sharp from 'sharp'

let handler = async (m, { conn, text, command, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup)
    return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *هـذا الأمـر لـلـمـجـمـوعـات فـقـط!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)
  if (!isAdmin && !isOwner)
    return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

  const actions = {
    'جروب_اسم': async () => {
      if (!text)
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ✏️ *اكـتـب الاسـم الـجـديـد:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .جروب_اسم [الاسم]
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)
      await conn.groupUpdateSubject(m.chat, text)

      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـغـيـيـر اسـم الـمـجـمـوعـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الاسـم الـجـديـد: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
      await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m })
    },

    'جروب_وصف': async () => {
      if (!text)
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 📝 *اكـتـب الـوصـف الـجـديـد:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .جروب_وصف [الوصف]
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)
      await conn.groupUpdateDescription(m.chat, text)

      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـغـيـيـر وصـف الـمـجـمـوعـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف الـجـديـد: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
      await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m })
    },

    // ═══════════════════════════════════════════════════════
    // ✅ أمر تغيير صورة الجروب
    // ═══════════════════════════════════════════════════════
    'جروب_صوره': async () => {
      if (!isBotAdmin)
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *يـجـب أن يـكـون الـبـوت مـشـرفـاً*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

      // ═══ التحقق من وجود صورة
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''

      if (!mime || !mime.includes('image'))
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 📸 *الاسـتـخـدام:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .جروب_صوره (بالرد على صورة)
│
│ 🩸 *ابعت صورة واعمل رد عليها بالأمر*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

      // ═══ رسالة جاري التغيير
      await conn.sendMessage(m.chat, {
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ⏳ *جـاري تـغـيـيـر صـورة الـجـروب...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
      }, { quoted: m })

      try {
        // ═══ تحميل الصورة
        let media = await q.download?.()

        if (!media) {
          let stream = await downloadContentFromMessage(q.msg || q, 'image')
          let buffer = Buffer.from([])
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
          }
          media = buffer
        }

        if (!media || media.length < 100) {
          throw new Error('فشل تحميل الصورة')
        }

        // ═══ تحجيم الصورة لـ 720x720
        const resized = await sharp(media)
          .resize(720, 720, { fit: 'cover' })
          .toFormat('jpeg')
          .toBuffer()

        // ═══ إرسال الصورة للجروب
        await conn.query({
          tag: 'iq',
          attrs: {
            target: m.chat,
            to: '@s.whatsapp.net',
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: resized
            }
          ]
        })

        // ═══ رسالة النجاح
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـغـيـيـر صـورة الـجـروب*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم تـعـيـيـن الـصـورة الـجـديـدة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

        await conn.sendMessage(m.chat, {
          image: resized,
          caption: msg,
          mentions: [m.sender]
        }, { quoted: m })

      } catch (err) {
        console.error('[جروب-صورة] error:', err.message)
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل تـغـيـيـر صـورة الـجـروب*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)
      }
    }
  }

  const action = actions[command]
  if (!action) return

  try {
    await action()
  } catch (err) {
    console.error('[جروب] error:', err.message)
    conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *خـطـأ:*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)
  }
}

handler.help = ['جروب_اسم', 'جروب_وصف', 'جروب_صوره']
handler.tags = ['admin']
handler.command = /^(جروب_اسم|جروب_وصف|جروب_صوره)$/i
handler.group = true
handler.admin = true

export default handler