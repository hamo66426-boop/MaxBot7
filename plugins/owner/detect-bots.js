// plugins/كشف_البوتات.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - كشف البوتات 🔍
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

const handler = async (m, { conn, isOwner, isROwner }) => {
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

        // ✅ التحقق من الصلاحيات (مطور)
        if (!isOwner && !isROwner) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 الأمـر ده لـلـمـطـوريـن بـس
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

        const loadingMsg = await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🔍 *جـاري فـحـص الـجـروب...*
│
${FOOT}`, m)

        // ═══════════════════════════════════════════════════
        // 1️⃣ جلب بيانات الجروب
        // ═══════════════════════════════════════════════════
        const groupMeta = await conn.groupMetadata(m.chat)
        const participants = groupMeta.participants

        // ═══════════════════════════════════════════════════
        // 2️⃣ بناء قائمة المحميين
        // ═══════════════════════════════════════════════════

        // 🛡️ بوتك الأساسي
        const botFullJid = conn.user.jid
        const botNumber = extractNumber(botFullJid)

        // 🛡️ المطورين
        const ownerNumbers = (global.owner || []).map(n => extractNumber(n))

        // 🛡️ البوتات الفرعية
        const subBots = global.conns || []
        const subBotNumbers = subBots
            .map(c => extractNumber(c?.user?.jid))
            .filter(Boolean)

        // 🛡️ تحويل كل بوت فرعي لصيغه المختلفة
        const subBotFullNumbers = new Set()
        for (const sub of subBots) {
            const subJid = sub?.user?.jid || ''
            subBotFullNumbers.add(extractNumber(subJid))
        }

        console.log('[كشف_البوتات] 🤖 botNumber:', botNumber)
        console.log('[كشف_البوتات] 👑 ownerNumbers:', ownerNumbers)
        console.log('[كشف_البوتات] 🔗 subBotNumbers:', Array.from(subBotFullNumbers))

        // ═══════════════════════════════════════════════════
        // 3️⃣ دالة الحماية
        // ═══════════════════════════════════════════════════
        const isProtected = (jid) => {
            if (!jid) return true

            const num = extractNumber(jid)

            // بوتك
            if (num === botNumber) return true

            // المطورين
            if (ownerNumbers.includes(num)) return true

            // البوتات الفرعية
            if (subBotFullNumbers.has(num)) return true

            return false
        }

        // ═══════════════════════════════════════════════════
        // 4️⃣ كشف البوتات الغريبة
        // ═══════════════════════════════════════════════════
        const suspectedBots = []

        for (const p of participants) {
            if (isProtected(p.id)) continue

            const rawId = String(p.id || '')
            const num = extractNumber(rawId)

            // 🎯 فحص 1: الـ JID فيه `:XX` (device) → بوت
            const hasDevice = rawId.includes(':') && rawId.includes('@s.whatsapp.net')

            // 🎯 فحص 2: البصمة من p.phoneNumber مختلف عن p.id → مرجح بوت
            let phoneMismatch = false
            if (p.phoneNumber && p.id) {
                const idNum = extractNumber(p.id)
                const phoneNum = extractNumber(p.phoneNumber)
                if (idNum && phoneNum && idNum !== phoneNum && !rawId.includes('@lid')) {
                    phoneMismatch = true
                }
            }

            if (hasDevice || phoneMismatch) {
                suspectedBots.push({
                    id: p.id,
                    number: num,
                    admin: p.admin === 'admin' || p.admin === 'superadmin',
                    reason: hasDevice ? 'جهاز متعدد' : 'رقم مختلف'
                })
            }
        }

        // ═══════════════════════════════════════════════════
        // 5️⃣ حذف رسالة الانتظار
        // ═══════════════════════════════════════════════════
        try {
            await conn.sendMessage(m.chat, { delete: loadingMsg.key })
        } catch {}

        // ═══════════════════════════════════════════════════
        // 6️⃣ لو مفيش بوتات غريبة
        // ═══════════════════════════════════════════════════
        if (suspectedBots.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *مـفـيـش بـوتـات غـريـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الأعـضـاء: ${participants.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـوتـاتـك الـمـحـمـيـة: ${subBotNumbers.length + 1}
│
│ 🩸 *الـجـروب نـضـيـف*
│
${FOOT}`, m)
        }

        // ═══════════════════════════════════════════════════
        // 7️⃣ عرض النتائج
        // ═══════════════════════════════════════════════════
        const list = suspectedBots
            .map((b, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. @${b.number}${b.admin ? ' 👑' : ''}`)
            .join('\n')

        await conn.sendMessage(m.chat, { react: { text: '🚨', key: m.key } })

        await conn.sendMessage(m.chat, {
            text: `${HEADER}
${LINE}
│
│ 🤖 *نـتـيـجـة الـفـحـص*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الأعـضـاء: ${participants.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـوتـاتـك: ${subBotNumbers.length + 1}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـوتـات غـريـبـة: ${suspectedBots.length}
│
${list}
│
│ 🔮 *اكـتـب .طرد_البوتات لـطـردهم*
│
${FOOT}`,
            mentions: suspectedBots.map(b => b.id)
        }, { quoted: m })

        // ═══════════════════════════════════════════════════
        // 8️⃣ حفظ النتائج للاستخدام في طرد_البوتات
        // ═══════════════════════════════════════════════════
        if (!global.detectedBots) global.detectedBots = {}
        global.detectedBots[m.chat] = suspectedBots.map(b => b.id)

    } catch (e) {
        console.error('[كشف_البوتات] ❌', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـفـحـص*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
    }
}

handler.help = ['كشف_البوتات']
handler.tags = ['owner']
handler.command = ['كشف_البوتات']
handler.group = true
handler.owner = true

export default handler