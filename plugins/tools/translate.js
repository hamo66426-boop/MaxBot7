// plugins/ترجمة.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - الترجمة 🌐
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import fetch from 'node-fetch'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

// ═══════════════════════════════════════════════════════════
// 🌐 دالة الترجمة
// ═══════════════════════════════════════════════════════════
async function ترجمة(نص, لغة = 'ar') {
    const url = new URL('https://translate.googleapis.com/translate_a/single')
    url.searchParams.append('client', 'gtx')
    url.searchParams.append('sl', 'auto')
    url.searchParams.append('tl', لغة)
    url.searchParams.append('dt', 't')
    url.searchParams.append('q', نص)

    const res = await fetch(url.href, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await res.json()
    if (!json?.[0]) throw new Error('الاتصال بخدمة الترجمة مضربش')
    return json[0].map(item => item[0]).join('')
}

// ═══════════════════════════════════════════════════════════
// 🎯 المعالج
// ═══════════════════════════════════════════════════════════
const handler = async (m, { conn, text, args, command }) => {
    try {
        // ✅ لو مفيش نص ومافي رد
        if (!text && !m.quoted?.text) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🌐 *أمـر الـتـرجـمـة*
│
│ ❄️ ═══════════════ ❄️
│
│ 🔮 *طـريـقـة الاسـتـخـدام:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} أهلاً بيك ← للإنجليزي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} ar Hello ← للعربي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} en أهلاً ← للإنجليزي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ رد عـلـى رسـالـة + .${command}
│
│ 🌍 *أكـواد الـلـغـات:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ar = عربي | en = إنجليزي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ fr = فرنسي | es = إسباني
├ׁ̟̇˚₊· ͟͟͞͞➳❥ de = ألماني | tr = تركي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ it = إيطالي | ru = روسي
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let لغة_مقصودة = 'en'
        let نص_للترجمة = ''

        // ✅ رد على رسالة
        if (m.quoted?.text && !text) {
            نص_للترجمة = m.quoted.text
            لغة_مقصودة = 'ar'
        }
        // ✅ رد + لغة محددة
        else if (m.quoted?.text && args[0] && args[0].length <= 5) {
            نص_للترجمة = m.quoted.text
            لغة_مقصودة = args[0].toLowerCase()
        }
        // ✅ نص + كود لغة في الأول
        else if (args.length >= 2 && args[0].length <= 5 && /^[a-z]{2,5}$/i.test(args[0])) {
            لغة_مقصودة = args[0].toLowerCase()
            نص_للترجمة = args.slice(1).join(' ')
        }
        // ✅ كشف تلقائي
        else {
            نص_للترجمة = text
            لغة_مقصودة = /[\u0600-\u06FF]/.test(نص_للترجمة) ? 'en' : 'ar'
        }

        if (!نص_للترجمة || !نص_للترجمة.trim()) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 مـفـيـش نـص لـلـتـرجـمـة
│
${FOOT}`, m)
        }

        const ناتج = await ترجمة(نص_للترجمة, لغة_مقصودة)

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        await conn.sendMessage(m.chat, {
            text: `${HEADER}
${LINE}
│
│ 🌐 *الـتـرجـمـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـلـغـة: ${لغة_مقصودة}
│
│ 📝 *الـنـص الأصـلـي:*
│ ${نص_للترجمة.slice(0, 200)}${نص_للترجمة.length > 200 ? '...' : ''}
│
│ 🩸 *الـتـرجـمـة:*
│ ${ناتج}
│
${FOOT}`
        }, { quoted: m })

    } catch (e) {
        console.error('[ترجمة]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـلـت الـتـرجـمـة*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
    }
}

handler.help = ['ترجمة [نص/كود اللغة]']
handler.command = ['ترجمة', 'translate', 'tr']
handler.tags = ['tools']
handler.group = false

export default handler