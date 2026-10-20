// plugins/سكرين.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - لقطة شاشة المواقع 📸
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import axios from 'axios'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const handler = async (m, { conn, text, command }) => {
    try {
        // ✅ التحقق من وجود الرابط
        if (!text || !text.trim()) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 حـط رابـط الـمـوقـع بـعـد الأمـر:
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} https://google.com
│
${FOOT}`, m)
        }

        let رابط = text.trim()
        if (!رابط.startsWith('http')) رابط = 'https://' + رابط

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const loadingMsg = await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⏳ *جـاري الـتـقـاط الـصـورة...*
│
│ 🔗 الـرابـط: ${رابط}
│
${FOOT}`, m)

        // ✅ جلب لقطة الشاشة
        const res = await axios.get(
            `https://image.thum.io/get/png/fullpage/viewportWidth/1280/${encodeURIComponent(رابط)}`,
            {
                responseType: 'arraybuffer',
                timeout: 45000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }
        )

        // حذف رسالة الانتظار
        try {
            await conn.sendMessage(m.chat, { delete: loadingMsg.key })
        } catch {}

        // ✅ إرسال الصورة
        await conn.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `${HEADER}
${LINE}
│
│ 📸 *لـقـطـة شـاشـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${رابط}
│
│ 🩸 *تـم بـنـجـاح*
│
${FOOT}`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[سكرين]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـتـقـاط الـصـورة*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
    }
}

handler.help = ['سكرين [رابط]']
handler.command = ['سكرين', 'ssweb', 'screenshot', 'لقطة_موقع']
handler.tags = ['tools']
handler.group = false

export default handler