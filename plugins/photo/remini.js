// plugins/تحسين.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - تحسين جودة الصور 🖼️✨
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

async function تحسين_صورة(buffer) {
    const مجلد = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true })
    const مسار = path.join(مجلد, `remini_${Date.now()}.jpg`)
    fs.writeFileSync(مسار, buffer)

    try {
        const form = new FormData()
        form.append('myfile', fs.createReadStream(مسار))
        form.append('scaleRadio', '2')

        const رفع = await axios.post('https://get1.imglarger.com/api/UpscalerNew/UploadNew', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'origin': 'https://imgupscaler.com',
                'referer': 'https://imgupscaler.com/'
            },
            timeout: 30000
        })

        const code = رفع.data?.data?.newFilename
        if (!code) throw new Error('رفع الصورة مضربش')

        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 3000))

            const فحص = await axios.post('https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew', {
                code, scaleRadio: 2
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                    'origin': 'https://imgupscaler.com'
                },
                timeout: 15000
            })

            const status = فحص.data?.data?.status
            if (status === 'success' || status === '3') {
                const رابط = فحص.data?.data?.downloadFilename
                if (رابط) {
                    const img = await axios.get(`https://get1.imglarger.com/${رابط}`, {
                        responseType: 'arraybuffer',
                        timeout: 30000
                    })
                    return Buffer.from(img.data)
                }
            }
        }
        throw new Error('الوقت خلص')
    } finally {
        try { fs.unlinkSync(مسار) } catch {}
    }
}

const handler = async (m, { conn }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        if (!mime.startsWith('image')) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🖼️ رد عـلـى صـورة عـشـان أحـسّـن جـودهـا
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const loadingMsg = await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⏳ *جـاري تـحـسـيـن الـصـورة...*
│
│ 🩸 *اسـتـنـى شـويـة*
│
${FOOT}`, m)

        try {
            const buffer = await q.download()
            const ناتج = await تحسين_صورة(buffer)

            try {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key })
            } catch {}

            await conn.sendMessage(m.chat, {
                image: ناتج,
                caption: `${HEADER}
${LINE}
│
│ ✅ *تـم تـحـسـيـن الـصـورة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: نـجـاح
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـجـودة: HD
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـتـكـبـيـر: 2x
│
│ 🩸 *تـم بـنـجـاح*
│
${FOOT}`
            }, { quoted: m })

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (e) {
            console.error('[تحسين]', e)
            try {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key })
            } catch {}

            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـتـحـسـيـن*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
        }

    } catch (e) {
        console.error('[تحسين] outer error:', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['تحسين']
handler.command = ['تحسين', 'remini', 'hdimage', 'تحسين_صورة']
handler.tags = ['images']
handler.group = false

export default handler