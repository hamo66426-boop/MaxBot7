// plugins/سحب.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - سحب الأدمن 🛡️
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

let handler = async (m, { conn, isOwner, isROwner }) => {
    // ✅ التحقق من الصلاحيات
    if (!isOwner && !isROwner) {
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 هـذا الأمـر مـخـصـص لـلـمـطـور فـقـط
│
${FOOT}`, m)
    }

    if (!m.isGroup) {
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 هـذا الأمـر يـعـمـل فـقـط فـي الـجـروبـات
│
${FOOT}`, m)
    }

    try {
        const groupMetadata = await conn.groupMetadata(m.chat)

        // ═══════════════════════════════════════════════════
        // 1️⃣ استخراج أرقام البوت (كل الصيغ الممكنة)
        // ═══════════════════════════════════════════════════
        const botFullJid = conn.user.jid                                // 201128290021:5@s.whatsapp.net
        const botNumber = extractNumber(botFullJid)                     // 201128290021
        const botLid = conn.user.lid || ''                              // يتيمه يكون 180943...@lid
        const botLidNumber = extractNumber(botLid)

        console.log('[سحب] 🤖 botFullJid:', botFullJid)
        console.log('[سحب] 🤖 botNumber:', botNumber)
        console.log('[سحب] 🤖 botLid:', botLid)

        // ═══════════════════════════════════════════════════
        // 2️⃣ استخراج أرقام المطورين
        // ═══════════════════════════════════════════════════
        const ownerNumbers = (global.owner || []).map(n => extractNumber(n))
        console.log('[سحب] 👑 ownerNumbers:', ownerNumbers)

        // ═══════════════════════════════════════════════════
        // 3️⃣ استخراج المشرفين مع رقمهم الحقيقي
        // ═══════════════════════════════════════════════════
        const adminParticipants = groupMetadata.participants.filter(
            p => p.admin === 'admin' || p.admin === 'superadmin'
        )

        console.log('[سحب] 👥 total admins:', adminParticipants.length)

        // ═══════════════════════════════════════════════════
        // 4️⃣ فلترة — كل الاحتمالات
        // ═══════════════════════════════════════════════════
        const adminsToDemote = []

        for (const p of adminParticipants) {
            // كل الأرقام اللي ممكن نعرفها عن المشرف ده
            const candidates = new Set()
            candidates.add(extractNumber(p.id))
            if (p.phoneNumber) candidates.add(extractNumber(p.phoneNumber))
            if (p.jid) candidates.add(extractNumber(p.jid))

            // حاول نضيف الرقم من convertLidToRealJid
            try {
                const clean = await conn.convertLidToRealJid(p.id, m.chat)
                if (clean) candidates.add(extractNumber(clean))
            } catch {}

            // حاول من p.phoneNumber مباشرة
            if (p.phoneNumber) {
                try {
                    const clean = await conn.convertLidToRealJid(p.phoneNumber, m.chat)
                    if (clean) candidates.add(extractNumber(clean))
                } catch {}
            }

            candidates.delete('')

            console.log('[سحب] 🔎 admin candidates:', Array.from(candidates), '| admin:', p.admin)

            // 🛡️ استثناء البوت
            const isBotParticipant = Array.from(candidates).some(num =>
                num === botNumber ||
                num === botLidNumber
            )
            if (isBotParticipant) {
                console.log('[سحب] 🛡️ SKIP BOT:', Array.from(candidates))
                continue
            }

            // 🛡️ استثناء المطورين
            const isOwnerParticipant = Array.from(candidates).some(num =>
                ownerNumbers.includes(num)
            )
            if (isOwnerParticipant) {
                console.log('[سحب] 🛡️ SKIP OWNER:', Array.from(candidates))
                continue
            }

            adminsToDemote.push(p.id)
        }

        console.log('[سحب] ✅ to demote:', adminsToDemote)

        // ═══════════════════════════════════════════════════
        // 5️⃣ لو مفيش حد ننزله
        // ═══════════════════════════════════════════════════
        if (adminsToDemote.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *لا يـوجـد أدمن لـتـنـزيـلـه*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـشـرفـيـن: ${adminParticipants.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـعـد الاسـتـثـنـاء: 0
│
│ 🛡️ *الـبـوت والـمـطـور مـحـمـيـيـن*
│
${FOOT}`, m)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        // ═══════════════════════════════════════════════════
        // 6️⃣ تنزيل الأدمنز
        // ═══════════════════════════════════════════════════
        await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote')

        // ═══════════════════════════════════════════════════
        // 7️⃣ رسالة النجاح
        // ═══════════════════════════════════════════════════
        const adminList = adminsToDemote
            .map((jid, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. @${extractNumber(jid)}`)
            .join('\n')

        await conn.sendMessage(m.chat, {
            text: `${HEADER}
${LINE}
│
│ ✅ *تـم سـحـب الـصـلاحـيـات*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الـمـشـرفـيـن: ${adminsToDemote.length}
│
${adminList}
│
│ 🩸 *ارجـعـوا لأصـلـكـم*
│
${FOOT}`,
            mentions: adminsToDemote
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[سحب] ❌', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل تـنـفـيـذ الأمـر*
│
│ 🩸 *تـأكـد أن الـبـوت مـشـرف!*
│
│ 🔮 ${e.message}
│
${FOOT}`, m)
    }
}

handler.command = ['سحب']
handler.tags = ['admin']
handler.help = ['سحب']
handler.group = true
handler.owner = true

export default handler