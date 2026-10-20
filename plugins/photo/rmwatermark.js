// plugins/شيل_علامة.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - إزالة العلامة المائية 🖼️
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

async function إزالة_علامة(مسار_ملف) {
    const form = new FormData()
    form.append('image_file', fs.createReadStream(مسار_ملف), path.basename(مسار_ملف))

    const إنشاء = await axios.post(
        'https://api.ezremove.ai/api/ez-remove/watermark-remove/create-job',
        form,
        {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0',
                'origin': 'https://ezremove.ai',
                'product-serial': 'sr-' + Date.now()
            },
            timeout: 30000
        }
    )

    const job_id = إنشاء.data?.result?.job_id
    if (!job_id) throw new Error('إنشاء المهمة مضربش')

    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 2500))

        const فحص = await axios.get(
            `https://api.ezremove.ai/api/ez-remove/watermark-remove/get-job/${job_id}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'origin': 'https://ezremove.ai',
                    'product-serial': 'sr-' + Date.now()
                },
                timeout: 15000
            }
        ).catch(() => null)

        if (فحص?.data?.code === 100000 && فحص?.data?.result?.output?.[0]) {
            return فحص.data.result.output[0]
        }
    }
    throw new Error('الوقت خلص، جرب تاني')
}

const handler = async (m, { conn }) => {
    try {
        // التحقق من وجود صورة
        if (!m.quoted?.mimetype || !m.quoted.mimetype.startsWith('image/')) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🖼️ رد عـلـى صـورة عـشـان أشـيـل الـعـلامـة الـمـائـيـة مـنـهـا
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const loadingMsg = await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⏳ *جـاري إزالـة الـعـلامـة الـمـائـيـة...*
│
│ 🩸 *اسـتـنـى شـويـة*
│
${FOOT}`, m)

        const مجلد = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true })
        const مسار = path.join(مجلد, `wm_${Date.now()}.jpg`)

        try {
            const buffer = await m.quoted.download()
            fs.writeFileSync(مسار, buffer)

            const رابط_النتيجة = await إزالة_علامة(مسار)
            const ناتج = await axios.get(رابط_النتيجة, { responseType: 'arraybuffer', timeout: 30000 })

            // حذف رسالة الانتظار
            try {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key })
            } catch {}

            await conn.sendMessage(m.chat, {
                image: Buffer.from(ناتج.data),
                caption: `${HEADER}
${LINE}
│
│ ✅ *تـم إزالـة الـعـلامـة الـمـائـيـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: نـجـاح
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـوع: صـورة
│
│ 🩸 *تـم بـنـجـاح*
│
${FOOT}`
            }, { quoted: m })

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (e) {
            console.error('[شيل_علامة]', e)
            try {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key })
            } catch {}

            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـلـت الإزالـة*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
        } finally {
            try { fs.unlinkSync(مسار) } catch {}
        }

    } catch (e) {
        console.error('[شيل_علامة] outer error:', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['شيل_علامة']
handler.command = ['شيل_علامة', 'rmwatermark', 'إزالة_علامة']
handler.tags = ['images']
handler.group = false

export default handler