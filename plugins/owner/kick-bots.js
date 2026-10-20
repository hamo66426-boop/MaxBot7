// plugins/طرد_البوتات.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - طرد البوتات الغريبة 🧹
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

// 🔢 استخراج الرقم من أي صيغة JID
function extractNumber(jid) {
    if (!jid) return ''
    return String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

const handler = async (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin }) => {
    try {
        // ✅ التحقق من الجروب
        if (!m.isGroup) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 الأمـر ده بـيـشـتـغـل فـي الـجـروبـات بـس
│
${FOOT}`, m)
        }

        // ✅ التحقق من الصلاحيات
        if (!isAdmin && !isOwner && !isROwner) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 الأمـر ده لـلـمـشـرفـيـن بـس
│
${FOOT}`, m)
        }

        // ✅ التحقق من أن البوت مشرف
        if (!isBotAdmin) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 لازم الـبـوت يـكـون أدمن أولاً
│
${FOOT}`, m)
        }

        // ✅ جلب البوتات المكتشفة
        const bots = global.detectedBots?.[m.chat]
        if (!bots?.length) {
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *مـفـيـش بـوتـات مـحـفـوظـة*
│
│ 🔮 اكـتـب *.كشف_البوتات* الأول
│
${FOOT}`, m)
        }

        // ═══════════════════════════════════════════════════
        // 🛡️ فلترة: استبعاد بوتك + البوتات الفرعية + المطورين
        // ═══════════════════════════════════════════════════
        const botFullJid = conn.user.jid
        const botNumber = extractNumber(botFullJid)

        const ownerNumbers = (global.owner || []).map(n => extractNumber(n))

        // جلب أرقام البوتات الفرعية
        const subBots = global.conns || []
        const subBotNumbers = subBots
            .map(c => extractNumber(c?.user?.jid))
            .filter(Boolean)

        // فلترة البوتات
        const toKick = []
        for (const jid of bots) {
            const num = extractNumber(jid)

            // 🛡️ استثناء بوتك
            if (num === botNumber) continue

            // 🛡️ استثناء البوتات الفرعية
            if (subBotNumbers.includes(num)) continue

            // 🛡️ استثناء المطورين
            if (ownerNumbers.includes(num)) continue

            toKick.push(jid)
        }

        if (toKick.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '🛡️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🛡️ *مـفـيـش بـوتـات غـريـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـكـتـشـف: ${bots.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـبـوتـات الـمـحـمـيـة: ${bots.length}
│
│ 🩸 *كـل الـبـوتـات دي بـتـاعـتـك*
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

        await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚡ *جـاري الـطـرد...*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـبـوتـات الـغـريـبـة: ${toKick.length}
│
${FOOT}`, m)

        // ═══════════════════════════════════════════════════
        // 🧹 الطرد
        // ═══════════════════════════════════════════════════
        let kicked = 0
        const kickedNumbers = []

        for (const jid of toKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [jid], 'remove')
                kicked++
                kickedNumbers.push(extractNumber(jid))
                await new Promise(r => setTimeout(r, 600))
            } catch (e) {
                console.error('[طرد_البوتات]', extractNumber(jid), e.message)
            }
        }

        delete global.detectedBots[m.chat]

        // ═══════════════════════════════════════════════════
        // 📊 تقرير النتيجة
        // ═══════════════════════════════════════════════════
        const list = kickedNumbers
            .map((num, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. ${num}`)
            .join('\n')

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        await conn.sendMessage(m.chat, {
            text: `${HEADER}
${LINE}
│
│ ✅ *تـم الـطـرد بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ اتـطـرد: ${kicked} بـوت
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـحـمـيـيـن: ${bots.length - toKick.length}
│
${list}
│
│ 🧹 *الـجـروب نـضـيـف دلـوقـتـي*
│
${FOOT}`
        }, { quoted: m })

    } catch (e) {
        console.error('[طرد_البوتات] ❌', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـتـنـفـيـذ*
│
│ 🔮 ${e.message}
│
${FOOT}`, m)
    }
}

handler.help = ['طرد_البوتات']
handler.tags = ['owner']
handler.command = ['طرد_البوتات']
handler.group = true
handler.botAdmin = true
handler.owner = true

export default handler