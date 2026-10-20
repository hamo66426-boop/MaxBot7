// plugins/اختراق.js - مقلب اختراق الجهاز 🔴
// ═══════════════════════════════════════════════════════════
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - All Rights Reserved
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const HACK_VIDEO = 'https://files.catbox.moe/hg1pli.mp4'
const FAIL_IMAGE = 'https://files.catbox.moe/q7e49r.jpg'

function makeMention(jid) {
    if (!jid) return { text: '', jid: null }
    const number = jid.split('@')[0]
    return { text: `@${number}`, jid }
}

// 🛡️ إرسال آمن — يتجاهل rate-overlimit ويكمل
async function safeSend(conn, chat, options, quoted) {
    try {
        return await conn.sendMessage(chat, options, quoted ? { quoted } : {})
    } catch (e) {
        console.log('[اختراق] send error:', e?.data || e?.message)
        return null
    }
}

// 🛡️ تعديل آمن
async function safeEdit(conn, chat, key, text, mentions = []) {
    try {
        return await conn.sendMessage(chat, {
            text,
            edit: key,
            ...(mentions.length ? { mentions } : {})
        })
    } catch (e) {
        console.log('[اختراق] edit error:', e?.data || e?.message)
        return null
    }
}

let handler = async (m, { conn }) => {
    let target = m.quoted?.sender || m.mentionedJid?.[0]
    if (!target) return m.reply(`${HEADER}
${LINE}
│
│ ❌ *طـريـقـة الاسـتـخـدام*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ رد عـلـى رسـالـة الـعـضـو
├ׁ̟̇˚₊· ͟͟͞͞➳❥ أو اكـتـب: .اختراق @مـنـشـن
│
${FOOT}`)

    let realTarget = target
    try {
        const clean = await conn.convertLidToRealJid(target, m.chat)
        if (clean) realTarget = clean
    } catch {}

    let realSender = m.sender
    try {
        const clean = await conn.convertLidToRealJid(m.sender, m.chat)
        if (clean) realSender = clean
    } catch {}

    let name = await conn.getName(realTarget)
    if (!name || name.includes('@')) name = 'العضو'

    const targetMention = makeMention(realTarget)
    const senderMention = makeMention(realSender)

    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let randomStr = (len) => [...Array(len)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("")

    // ═══════════════════════════════════════════════════════════
    // المرحلة 1: البداية
    // ═══════════════════════════════════════════════════════════
    let startMsg = `${HEADER}
${LINE}
│
│ 🔴 *جـاري بـدء الاخـتـراق...*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـهـدف: ${targetMention.text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـخـتـرق: ${senderMention.text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوقـت: ${new Date().toLocaleTimeString('ar-EG')}
│
│ 🩸 *يـرجـى الانـتـظـار...*
│
${FOOT}`

    const sent = await safeSend(conn, m.chat, {
        text: startMsg,
        mentions: [realTarget, realSender]
    }, m)

    if (!sent) return
    const key = sent.key

    // ═══════════════════════════════════════════════════════════
    // المرحلة 2: الاتصال (6 تحديثات)
    // ═══════════════════════════════════════════════════════════
    for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 400))
        const progressText = `${HEADER}
${LINE}
│
│ 🔴 *جـاري الاتـصـال بـالـجـهـاز...*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ [جـاري الـدخـول]: \`${randomStr(20)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ [فـحـص الـنـظـام]: \`${randomStr(25)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ [الايـبـي]: \`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ [الـتـشـفـيـر]: \`${randomStr(15)}\`
│
${FOOT}`

        await safeEdit(conn, m.chat, key, progressText)
    }

    // ═══════════════════════════════════════════════════════════
    // المرحلة 3: أشرطة التحميل (3 × 10)
    // ═══════════════════════════════════════════════════════════
    const bars = [
        { name: "📸 سـحـب جـمـيـع الـصـور مـن الـمـعـرض" },
        { name: "🔐 فـك تـشـفـيـر قـاعـدة بـيـانـات الـواتـسـاب" },
        { name: "📤 رفـع الـمـلـفـات لـلـسـيـرفـر" }
    ]

    for (const bar of bars) {
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(r => setTimeout(r, 350))
            const filled = "█".repeat(i / 10) + "▒".repeat(10 - i / 10)

            const barText = `${HEADER}
${LINE}
│
│ 🔴 *${bar.name}*
│
│ ❄️ ═══════════════ ❄️
│ ${filled} ${i}%
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: \`${randomStr(8)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـهـدف: ${targetMention.text}
│
${FOOT}`

            await safeEdit(conn, m.chat, key, barText, [realTarget])
        }
    }

    // ═══════════════════════════════════════════════════════════
    // المرحلة 4: النتيجة
    // ═══════════════════════════════════════════════════════════
    const fail = Math.random() < 0.2
    await new Promise(r => setTimeout(r, 800))

    if (fail) {
        const failMsg = `${HEADER}
${LINE}
│
│ ❌ *فـشـل الاخـتـراق*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـسـبـب: الـجـهـاز مـحـمـي بـحـمـايـة قـويـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ كـود الـخـطـأ: \`${randomStr(8)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـهـدف: ${targetMention.text}
│
│ 😅 *جـرب مـرة تـانـيـة يـا مـحـتـرف*
│
${FOOT}`

        await safeSend(conn, m.chat, {
            image: { url: FAIL_IMAGE },
            caption: failMsg,
            mentions: [realTarget]
        }, m)
    } else {
        const imgCount = Math.floor(Math.random() * 300 + 50)
        const successMsg = `${HEADER}
${LINE}
│
│ ✅ *اكـتـمـلـت الـعـمـلـيـة بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم سـحـب: ${imgCount} صـورة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ كـلـمـة الـسـر: \`${randomStr(12)}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـضـحـيـة: ${targetMention.text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـخـتـرق: ${senderMention.text}
│
│ 🩸 *يـتـم الآن نـشـر الـصـور عـلـى الإنـتـرنـت* 😈
│
│ 📡 *تـم بـنـجـاح يـا ${name}*
│
${FOOT}`

        await safeSend(conn, m.chat, {
            video: { url: HACK_VIDEO },
            gifPlayback: true,
            caption: successMsg,
            mentions: [realTarget, realSender]
        }, m)
    }
}

handler.command = /^(اخترق|اختراق)$/i
handler.help = ['اختراق @منشن']
handler.tags = ['admin',"group"]
handler.group = true

export default handler