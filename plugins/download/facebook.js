// ═══════════════════════════════════════════════════════════════
// 📘 Facebook Downloader Plugin - MAX BOT
// 📌 MAX LABS 👑
// 📢 https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435
// ═══════════════════════════════════════════════════════════════

import axios from "axios"

// دالة استخراج البيانات وتنظيفها
function parseString(string) {
    try {
        return JSON.parse(`{"text": "${string}"}`).text
    } catch (e) {
        return string
    }
}

function match(data, ...patterns) {
    for (const pattern of patterns) {
        const result = data.match(pattern)
        if (result) return result
    }
    return null
}

async function fesnuk(postUrl, cookie = "", userAgent = "") {
    if (!postUrl || !postUrl.trim()) throw new Error("يرجى تحديد رابط فيسبوك صالح.")
    if (!/(facebook.com|fb.watch)/.test(postUrl)) throw new Error("رابط فيسبوك غير صالح.")

    const headers = {
        "sec-fetch-user": "?1",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-site": "none",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "cache-control": "max-age=0",
        authority: "www.facebook.com",
        "upgrade-insecure-requests": "1",
        "accept-language": "en-GB,en;q=0.9",
        "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        "user-agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        cookie: cookie || "",
    }

    try {
        const { data } = await axios.get(postUrl, { headers })
        const extractData = data.replace(/"/g, '"').replace(/&/g, "&")

        const sdUrl = match(extractData, /"browser_native_sd_url":"(.*?)"/, /sd_src\s*:\s*"([^"]*)"/)?.[1]
        const hdUrl = match(extractData, /"browser_native_hd_url":"(.*?)"/, /hd_src\s*:\s*"([^"]*)"/)?.[1]
        const title = match(extractData, /<meta\sname="description"\scontent="(.*?)"/)?.[1] || ""

        if (sdUrl) {
            return {
                url: postUrl,
                title: parseString(title),
                quality: {
                    sd: parseString(sdUrl),
                    hd: parseString(hdUrl || ""),
                },
            }
        } else {
            throw new Error("تعذر جلب الوسائط في هذا الوقت. حاول مرة أخرى.")
        }
    } catch (error) {
        console.error("Error:", error)
        throw new Error("تعذر جلب الوسائط في هذا الوقت. حاول مرة أخرى.")
    }
}

let handler = async (m, { args, conn, usedPrefix, command }) => {
    
    // التحقق من وجود رابط
    if (!args[0]) {
        return m.reply(
            `📘 *تحميل فيسبوك | Facebook*\n\n` +
            `📌 *طريقة الاستخدام:*\n` +
            `• ${usedPrefix}${command} <رابط الفيديو>\n\n` +
            `💡 *مثال:*\n` +
            `• ${usedPrefix}${command} https://fb.watch/xyz`
        )
    }

    await m.react('🥂')
    const wait = await m.reply('⏳ *جاري استخراج وتحميل الفيديو من فيسبوك...*')

    try {
        let result = await fesnuk(args[0])

        // التحميل بأعلى جودة متاحة (HD وإلا SD)
        let videoUrl = result.quality.hd || result.quality.sd
        let qualityLabel = result.quality.hd ? 'HD' : 'SD'

        if (videoUrl) {
            try { await conn.sendMessage(m.chat, { delete: wait.key }) } catch {}
            
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: `🥂 *تم التحميل بنجاح بواسطة MAX BOT*\n\n` +
                         `📌 *العنوان:* ${result.title.substring(0, 100) || 'فيديو فيسبوك'}\n` +
                         `📊 *الجودة:* ${qualityLabel}\n` +
                         `📢 *قناتنا:* https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435`
            }, { quoted: m })

            await m.react('🥂')
        } else {
            try { await conn.sendMessage(m.chat, { delete: wait.key }) } catch {}
            await m.react('❌')
            m.reply('❌ تعذر جلب رابط الفيديو بدقة، حاول برابط آخر.')
        }
    } catch (e) {
        console.error('[FB Error]', e)
        try { await conn.sendMessage(m.chat, { delete: wait.key }) } catch {}
        await m.react('❌')
        m.reply('❌ حدث خطأ أثناء التحميل: ' + (e.message || 'تأكد من صحة الرابط'))
    }
}

handler.help = ['فيسبوك', 'فيس', 'fb']
handler.tags = ['download']
handler.command = /^(فيس|فيسبوك|facebook|fb|face)$/i

export default handler
