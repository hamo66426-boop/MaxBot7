// plugins/ملصق_متحرك.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - ملصق متحرك 🎬

console.log('[ملصق_متحرك] ✅ البلجن بدأ يتحمل')

import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const handler = async (m, { conn }) => {
    console.log('[ملصق_متحرك] 📥 استقبل الأمر من', m.sender)
    
    let inputPath = null
    let outputPath = null

    try {
        // ✅ التحقق من الرد على ميديا
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        console.log('[ملصق_متحرك] mime:', mime)

        if (!mime) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🎬 رد عـلـى فـيـديـو أو GIF عـشـان أحـولـه لـمـلـصـق
│
${FOOT}`, m)
        }

        if (!mime.includes('video') && !mime.includes('gif')) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *الـمـلـف ده مـش فـيـديـو*
│
│ 🎬 لازم تـرد عـلـى فـيـديـو أو GIF
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        // ✅ تحميل الفيديو
        console.log('[ملصق_متحرك] ⬇️ جاري التحميل...')
        const buffer = await q.download()
        console.log('[ملصق_متحرك] ✅ تم التحميل:', buffer.length, 'bytes')

        // ✅ مسارات مؤقتة
        const tmpDir = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        inputPath = path.join(tmpDir, `in_${Date.now()}.mp4`)
        outputPath = path.join(tmpDir, `out_${Date.now()}.webp`)

        fs.writeFileSync(inputPath, buffer)

        // ✅ تحويل بـ ffmpeg
        console.log('[ملصق_متحرك] 🎬 تشغيل ffmpeg...')
        const cmd = `ffmpeg -i "${inputPath}" -t 6 -vf "fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 60 -loop 0 -preset default -an -vsync 0 "${outputPath}" -y 2>&1`

        const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 100 * 1024 * 1024 })
        console.log('[ملصق_متحرك] ✅ ffmpeg خلص')

        if (!fs.existsSync(outputPath)) {
            throw new Error('الملف الناتج مش موجود')
        }

        const stickerBuffer = fs.readFileSync(outputPath)
        console.log('[ملصق_متحرك] ✅ حجم الملصق:', stickerBuffer.length, 'bytes')

        // ✅ إرسال الملصق
        await conn.sendMessage(m.chat, {
            sticker: stickerBuffer
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[ملصق_متحرك] ❌ خطأ:', e.message)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـتـحـويـل*
│
│ 🔮 ${e.message?.slice(0, 150)}
│
${FOOT}`, m)
    } finally {
        try { if (inputPath) fs.unlinkSync(inputPath) } catch {}
        try { if (outputPath) fs.unlinkSync(outputPath) } catch {}
    }
}

handler.help = ['ملصق_متحرك']
handler.command = ['ملصق_متحرك', 'gifsticker', 'gif_sticker', 'ملصق-متحرك']
handler.tags = ['sticker']
handler.group = false

export default handler