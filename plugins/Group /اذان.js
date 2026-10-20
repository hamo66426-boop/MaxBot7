// plugins/الصلاة.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - مواقيت الصلاة 🕌
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

console.log('[الصلاة] ✅ plugin loaded')

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const FOOTER = '❄️ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ 👑'
const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT_DIV = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const IMAGES = [
    'https://github.com/tast53534-svg/-26-/raw/refs/heads/main/ffce093e86c59f0fcc665a98da230128.jpg',
    ]

const EGYPT_SECTIONS = [
    {
        title: '🏙️ الـقـاهـرة والـجـيـزة',
        rows: [
            { header: '', title: 'الـقـاهـرة',  description: 'محافظة القاهرة', id: '.الصلاة القاهرة' },
            { header: '', title: 'الـجـيـزة',   description: 'محافظة الجيزة', id: '.الصلاة الجيزة' },
            { header: '', title: '6 أكتوبر',    description: 'مدينة 6 أكتوبر', id: '.الصلاة 6 أكتوبر' },
            { header: '', title: 'الـعـلـمـيـن', description: 'مدينة العلمين', id: '.الصلاة العلمين' }
        ]
    },
    {
        title: '🌊 الـوجـه الـبـحـري',
        rows: [
            { header: '', title: 'الإسـكـنـدريـة', description: 'محافظة الإسكندرية', id: '.الصلاة الإسكندرية' },
            { header: '', title: 'الـبـحـيـرة',    description: 'محافظة البحيرة - دمنهور', id: '.الصلاة دمنهور' },
            { header: '', title: 'كـفـر الـشـيـخ', description: 'محافظة كفر الشيخ', id: '.الصلاة كفر الشيخ' },
            { header: '', title: 'دمـيـاط',       description: 'محافظة دمياط', id: '.الصلاة دمياط' },
            { header: '', title: 'مـطـروح',       description: 'محافظة مطروح - مرسى مطروح', id: '.الصلاة مرسى مطروح' }
        ]
    },
    {
        title: '🌾 الـدلـتـا',
        rows: [
            { header: '', title: 'الـدقـهـلـيـة',   description: 'محافظة الدقهلية - المنصورة', id: '.الصلاة المنصورة' },
            { header: '', title: 'الـغـربـيـة',    description: 'محافظة الغربية - طنطا', id: '.الصلاة طنطا' },
            { header: '', title: 'الـمـنـوفـيـة',  description: 'محافظة المنوفية - شبين الكوم', id: '.الصلاة شبين الكوم' },
            { header: '', title: 'الـقـلـيـوبـيـة', description: 'محافظة القليوبية - بنها', id: '.الصلاة بنها' },
            { header: '', title: 'الـشـرقـيـة',    description: 'محافظة الشرقية - الزقازيق', id: '.الصلاة الزقازيق' }
        ]
    },
    {
        title: '🚢 مـدن الـقـنـاة',
        rows: [
            { header: '', title: 'بـورسـعـيـد',    description: 'محافظة بورسعيد', id: '.الصلاة بورسعيد' },
            { header: '', title: 'الإسـمـاعـيـلـيـة', description: 'محافظة الإسماعيلية', id: '.الصلاة الإسماعيلية' },
            { header: '', title: 'الـسـويـس',      description: 'محافظة السويس', id: '.الصلاة السويس' }
        ]
    },
    {
        title: '🏜️ الـصـعـيـد',
        rows: [
            { header: '', title: 'الـفـيـوم',      description: 'محافظة الفيوم', id: '.الصلاة الفيوم' },
            { header: '', title: 'بـنـي سـويـف',   description: 'محافظة بني سويف', id: '.الصلاة بني سويف' },
            { header: '', title: 'الـمـنـيـا',     description: 'محافظة المنيا', id: '.الصلاة المنيا' },
            { header: '', title: 'أسـيـوط',        description: 'محافظة أسيوط', id: '.الصلاة أسيوط' },
            { header: '', title: 'سـوهـاج',        description: 'محافظة سوهاج', id: '.الصلاة سوهاج' },
            { header: '', title: 'قـنـا',          description: 'محافظة قنا', id: '.الصلاة قنا' },
            { header: '', title: 'الأقـصـر',       description: 'محافظة الأقصر', id: '.الصلاة الأقصر' },
            { header: '', title: 'أسـوان',         description: 'محافظة أسوان', id: '.الصلاة أسوان' }
        ]
    },
    {
        title: '🏝️ سـيـنـاء والـبـحـر الأحـمـر',
        rows: [
            { header: '', title: 'شـرم الـشـيـخ',  description: 'جنوب سيناء', id: '.الصلاة شرم الشيخ' },
            { header: '', title: 'الـعـريـش',      description: 'شمال سيناء', id: '.الصلاة العريش' },
            { header: '', title: 'الـغـردقـة',     description: 'البحر الأحمر', id: '.الصلاة الغردقة' },
            { header: '', title: 'الـوادي الـجـديـد', description: 'محافظة الوادي الجديد - الخارجة', id: '.الصلاة الخارجة' }
        ]
    }
]

async function makeFkontak(imageUrl) {
    try {
        const res = await fetch(imageUrl)
        const thumb2 = Buffer.from(await res.arrayBuffer())
        return {
            key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '2B' },
            message: { locationMessage: { name: FOOTER, jpegThumbnail: thumb2 } },
            participant: '0@s.whatsapp.net'
        }
    } catch { return undefined }
}

function format12HourTime(time24) {
    if (!time24) return '—'
    const [hours, minutes] = time24.split(':')
    let period = 'AM'
    let hours12 = parseInt(hours, 10)

    if (hours12 >= 12) {
        period = 'PM'
        if (hours12 > 12) hours12 -= 12
    }
    if (hours12 === 0) hours12 = 12

    return `${hours12}:${minutes} ${period}`
}

// جلب مواقيت الصلاة بـ fetch (بدون axios)
async function getPrayerTimes(city) {
    const url = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=EG`
    const res = await fetch(url)
    const json = await res.json()
    if (!json?.data?.timings) throw new Error('No timings found')
    return json.data.timings
}

async function sendPrayerMenu(conn, m, city = null) {
    const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)]

    let captionText = ''

    if (city) {
        try {
            const t = await getPrayerTimes(city)

            captionText = `${HEADER}
${LINE}
│
│ 🕌 *مـواقـيـت الـصـلاة الـيـوم*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـديـنـة: ${city}
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـفـجـر:  ${format12HourTime(t.Fajr)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـشـروق: ${format12HourTime(t.Sunrise)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـظـهـر:  ${format12HourTime(t.Dhuhr)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـصـر:  ${format12HourTime(t.Asr)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـغـرب: ${format12HourTime(t.Maghrib)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـشـاء: ${format12HourTime(t.Isha)}
│
│ 🕋 *تـقـبـل الله صـلاتـك*
│
${FOOT_DIV}`
        } catch (e) {
            console.error('[الصلاة]', e.message)
            return conn.sendMessage(m.chat, {
                text: `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🕌 لـم يـتـم الـعـثـور عـلـى مـواقـيـت الـصـلاة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ لـلـمـديـنـة: ${city}
│
${FOOT_DIV}`
            }, { quoted: m })
        }
    } else {
        captionText = `${HEADER}
${LINE}
│
│ 🕌 *مـواقـيـت الـصـلاة فـي مـصـر*
│
│ ❄️ ═══════════════ ❄️
│
│ 🔮 *اخـتـر مـحـافـظـتـك مـن الـقـائـمـة*
│
${FOOT_DIV}`
    }

    // تحميل الصورة
    let media = null
    try {
        const res = await fetch(randomImage)
        const buf = Buffer.from(await res.arrayBuffer())
        media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer })
    } catch (e) {
        console.error('[الصلاة] media fail:', e.message)
    }

    // ═══════════════════════════════════════════════════════════
    // بنفس نظام ق1 بالظبط
    // ═══════════════════════════════════════════════════════════
    const payload = {
        body: { text: captionText },
        footer: { text: FOOTER },
        header: {
            hasMediaAttachment: !!media,
            subtitle: city ? `مواقيت ${city}` : 'مواقيت الصلاة 🇪🇬',
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '🕌 اختر محافظتك',
                        sections: EGYPT_SECTIONS
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                limited_time_offer: {
                    text: `🇪🇬 مواقيت الصلاة`,
                    url: 'https://wa.me/201118680635',
                    copy_code: `المطور: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂`,
                    expiration_time: Date.now() + 86400000
                },
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 999],
                    list_title: '🇪🇬 محافظات مصر',
                    button_title: '▻ عـرض الـمـحـافـظـات 🕌'
                }
            })
        }
    }

    try {
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
        const fkontak = await makeFkontak(randomImage)
        const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak })
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
        console.log('[الصلاة] ✅ sent successfully')
    } catch (e) {
        console.error('[الصلاة] interactive failed:', e.message)

        // Fallback: نص عادي
        let fallback = captionText + '\n\n*🇪🇬 المحافظات المتاحة:*\n'
        for (const sec of EGYPT_SECTIONS) {
            fallback += `\n*${sec.title}*\n`
            for (const r of sec.rows) {
                fallback += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${r.title}\n`
            }
        }
        await conn.sendMessage(m.chat, { text: fallback }, { quoted: m })
    }
}

let handler = async (m, { conn, text, command }) => {
    try {
        console.log('[الصلاة] command received:', command, 'text:', text)
        const city = text?.trim()
        return await sendPrayerMenu(conn, m, city || null)
    } catch (e) {
        console.error('[الصلاة] handler error:', e)
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${e.message}` }, { quoted: m })
    }
}

handler.command = ['الصلاة', 'الصلاه', 'اذان', 'مواقيت']
handler.tags = ['quran']
handler.help = ['الصلاة [المدينة]']

export default handler