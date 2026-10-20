// plugins/بروفايل.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - بروفايل 📸
// ═══════════════════════════════════════════════════════════

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const DEFAULT_PIC = 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg'

// ═══════════════════════════════════════════════════════════
// 🎯 جمع كل المنشنات الممكنة
// ═══════════════════════════════════════════════════════════
function getAllMentions(m) {
    const all = []

    // 1️⃣ m.mentionedJid
    if (Array.isArray(m.mentionedJid)) {
        m.mentionedJid.forEach(j => j && all.push(j))
    }

    // 2️⃣ msg.contextInfo
    const ctx = m.msg?.contextInfo || m.message?.extendedTextMessage?.contextInfo || {}
    if (Array.isArray(ctx.mentionedJid)) {
        ctx.mentionedJid.forEach(j => j && all.push(j))
    }

    // 3️⃣ message.imageMessage.contextInfo
    const imgCtx = m.message?.imageMessage?.contextInfo || {}
    if (Array.isArray(imgCtx.mentionedJid)) {
        imgCtx.mentionedJid.forEach(j => j && all.push(j))
    }

    // 4️⃣ message.videoMessage.contextInfo
    const vidCtx = m.message?.videoMessage?.contextInfo || {}
    if (Array.isArray(vidCtx.mentionedJid)) {
        vidCtx.mentionedJid.forEach(j => j && all.push(j))
    }

    // 5️⃣ quoted contextInfo
    const qCtx = m.quoted?.contextInfo || m.quoted?.msg?.contextInfo || {}
    if (Array.isArray(qCtx.mentionedJid)) {
        qCtx.mentionedJid.forEach(j => j && all.push(j))
    }

    return [...new Set(all)]
}

// ═══════════════════════════════════════════════════════════
// 🔢 تحويل LID لرقم حقيقي
// ═══════════════════════════════════════════════════════════
async function toRealJid(conn, jid, chatId) {
    if (!jid) return null
    if (jid.includes('@s.whatsapp.net') && !jid.includes(':')) return jid

    // محاولة convertLidToRealJid
    try {
        const clean = await conn.convertLidToRealJid(jid, chatId)
        if (clean && clean.includes('@s.whatsapp.net')) return clean
    } catch {}

    // محاولة من group metadata
    try {
        const meta = await conn.groupMetadata(chatId)
        const num = jid.split('@')[0].split(':')[0]
        const p = meta.participants.find(x =>
            x.id === jid || x.lid === jid ||
            x.id?.split('@')[0] === num ||
            x.phoneNumber?.split('@')[0] === num
        )
        if (p?.phoneNumber) return p.phoneNumber
        if (p?.id?.includes('@s.whatsapp.net')) return p.id
    } catch {}

    return jid
}

// ═══════════════════════════════════════════════════════════
// 🎯 جلب الاسم
// ═══════════════════════════════════════════════════════════
async function resolveName(m, jid, conn, chatId) {
    try {
        if (jid === m.sender && m.pushName) return m.pushName
        if (m.quoted?.sender === jid && m.quoted?.pushName) return m.quoted.pushName
        if (typeof conn.getName === 'function') {
            const n = await conn.getName(jid).catch(() => null)
            if (n && !n.includes('@') && !/^\d+$/.test(n)) return n
        }
        if (conn.contacts?.[jid]?.notify) return conn.contacts[jid].notify
        if (conn.contacts?.[jid]?.name) return conn.contacts[jid].name

        const meta = await conn.groupMetadata(chatId).catch(() => null)
        if (meta) {
            const num = jid.split('@')[0].split(':')[0]
            const p = meta.participants.find(x =>
                x.id === jid || x.lid === jid ||
                x.id?.split('@')[0] === num ||
                x.phoneNumber?.split('@')[0] === num
            )
            if (p?.notify) return p.notify
            if (p?.name) return p.name
        }
    } catch {}
    return jid?.split('@')[0] || 'مجهول'
}

// ═══════════════════════════════════════════════════════════
// 🖼️ جلب الصورة
// ═══════════════════════════════════════════════════════════
async function getPic(conn, jid) {
    try {
        const url = await conn.profilePictureUrl(jid, 'image')
        if (url && typeof url === 'string') return url
    } catch {}
    return DEFAULT_PIC
}

// ═══════════════════════════════════════════════════════════
// 🎯 المعالج
// ═══════════════════════════════════════════════════════════
const handler = async (m, { conn, command, text, args }) => {
    try {
        let targetJid = null
        let source = ''

        // جمع المنشنات من كل المصادر
        const mentions = getAllMentions(m)
        console.log('[بروفايل] mentions found:', mentions)
        console.log('[بروفايل] text:', text)
        console.log('[بروفايل] args:', args)

        // 1️⃣ منشن
        if (mentions.length > 0) {
            targetJid = mentions[0]
            source = 'منشن'
        }
        // 2️⃣ رد
        else if (m.quoted?.sender) {
            targetJid = m.quoted.sender
            source = 'رد'
        }
        // 3️⃣ رقم في النص
        else {
            const rawText = (text || (args || []).join(' ') || '').trim()
            const num = rawText.replace(/@\S+/g, '').replace(/[^0-9]/g, '')
            if (num.length >= 8 && num.length <= 15) {
                targetJid = num + '@s.whatsapp.net'
                source = 'رقم'
            }
        }

        // 4️⃣ صاحب الأمر
        if (!targetJid) {
            targetJid = m.sender
            source = 'نفسي'
        }

        console.log('[بروفايل] target:', targetJid, '| source:', source)

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        // تحويل LID
        const realJid = await toRealJid(conn, targetJid, m.chat)
        console.log('[بروفايل] realJid:', realJid)

        // جلب البيانات
        const pic = await getPic(conn, realJid)
        const name = await resolveName(m, realJid, conn, m.chat)
        const number = realJid.split('@')[0].split(':')[0]

        await conn.sendMessage(m.chat, { react: { text: '📸', key: m.key } })

        await conn.sendMessage(m.chat, {
            image: { url: pic },
            caption: `${HEADER}
${LINE}
│
│ 👤 *مـعـلـومـات الـعـضـو*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الاسـم: ${name}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${number}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: https://wa.me/${number}
│
${FOOT}`,
            mentions: [realJid]
        }, { quoted: m })

    } catch (e) {
        console.error('[بروفايل]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}\n${LINE}\n│\n│ ❌ *فـشـلـت الـعـمـلـيـة*\n│\n│ 🔮 ${e.message?.slice(0, 100)}\n│\n${FOOT}`, m)
    }
}

handler.help = ['بروفايل']
handler.command = ['بروفايل', 'profile', 'بروفايلي', 'profileme', 'صورتي', 'mypic', 'mypicture']
handler.tags = ['tools']
handler.group = false

export default handler