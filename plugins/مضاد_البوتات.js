// plugins/مضاد-البوتات.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - مضاد البوتات 🛡️
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import fs from 'fs'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const MEDIA_URLS = {
    video: 'https://file.garden/aauvg01sjleV_ic1/VID-20260511-WA0128.mp4',
    audio: 'https://file.garden/aauvg01sjleV_ic1/VID-20260511-WA0128.mp3'
}

const detectedBots = {}
const antibotPath = './data/antibot.json'

// التأكد من وجود مجلد data
if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true })
if (!fs.existsSync(antibotPath)) fs.writeFileSync(antibotPath, JSON.stringify({}, null, 2))

let handler = async (m, { conn, args, usedPrefix, command, isOwner, isAdmin, isROwner }) => {
    // التحقق من الجروب
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

    // الصلاحيات
    if (!isOwner && !isROwner && !isAdmin) {
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 هـذا الأمـر لـلـمـشـرفـيـن فـقـط
│
${FOOT}`, m)
    }

    let chatId = m.chat
    let antibott = {}
    try {
        antibott = JSON.parse(fs.readFileSync(antibotPath))
    } catch {
        antibott = {}
    }
    let antibot = antibott[chatId] === true

    const arg = (args[0] || '').toLowerCase()

    // ═══════════ تفعيل ═══════════
    if (arg === 'اون' || arg === 'on' || arg === 'تشغيل' || arg === 'تفعيل') {
        if (antibot) {
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *مـضـاد الـبـوتـات مـفـعـل بـالـفـعـل*
│
│ 🟢 *الـحـالـة:* مـفـعـل
│
${FOOT}`, m)
        }
        antibott[chatId] = true
        fs.writeFileSync(antibotPath, JSON.stringify(antibott, null, 2))
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *تـم الـتـفـعـيـل*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🛡️ مـضـاد الـبـوتـات
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🟢 مـفـعـل
│
│ 🩸 *أي بـوت يـدخـل الـجـروب هـيـتـطـرد*
│
${FOOT}`, m)
    }

    // ═══════════ تعطيل ═══════════
    else if (arg === 'اوف' || arg === 'off' || arg === 'ايقاف' || arg === 'تعطيل') {
        if (!antibot) {
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *مـضـاد الـبـوتـات مـعـطـل بـالـفـعـل*
│
│ 🔴 *الـحـالـة:* مـعـطـل
│
${FOOT}`, m)
        }
        delete antibott[chatId]
        fs.writeFileSync(antibotPath, JSON.stringify(antibott, null, 2))
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *تـم الـتـعـطـيـل*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🛡️ مـضـاد الـبـوتـات
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🔴 مـعـطـل
│
${FOOT}`, m)
    }

    // ═══════════ عرض الحالة ═══════════
    else {
        const status = antibot ? '🟢 مـفـعـل' : '🔴 مـعـطـل'
        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🛡️ *مـضـاد الـبـوتـات*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: ${status}
│
│ 🔮 *الاسـتـخـدام:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} اون
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} اوف
│
${FOOT}`, m)
    }
}

// ═══════════════════════════════════════════════════════════
// 🛡️ الفحص التلقائي (قبل كل رسالة)
// ═══════════════════════════════════════════════════════════
handler.before = async function (m, { conn }) {
    try {
        if (!m.isGroup) return false

        let chatId = m.chat
        let antibott = {}
        try {
            antibott = JSON.parse(fs.readFileSync(antibotPath))
        } catch {
            return false
        }

        if (antibott[chatId] !== true) return false
        if (m.key?.fromMe) return false

        let msgId = m.key?.id || m.id || ''
        if (!msgId) return false

        let isBot = false
        let botType = ''

        if (msgId.startsWith('3EB0') && msgId.length < 25) { isBot = true; botType = 'Baileys' }
        else if (msgId.startsWith('BAE5') && msgId.length === 16) { isBot = true; botType = 'Baileys v2' }
        else if (msgId.startsWith('B24E') && msgId.length === 20) { isBot = true; botType = 'Baileys v3' }
        else if (msgId.startsWith('8SCO') && msgId.length === 20) { isBot = true; botType = 'Baileys v4' }
        else if (msgId.startsWith('NJX-')) { isBot = true; botType = 'NJX Bot' }

        if (!isBot) return false

        // استخراج الرقم الحقيقي
        let senderId = m.sender
        try {
            if (typeof conn.convertLidToRealJid === 'function') {
                const clean = await conn.convertLidToRealJid(senderId, chatId)
                if (clean) senderId = clean
            }
        } catch {}

        let senderNum = senderId.split('@')[0]

        // تجاهل البوت نفسه
        const botNumber = conn.user.jid.split(':')[0].split('@')[0]
        if (senderNum === botNumber || senderId === conn.user.jid) return false

        // تجاهل المطورين
        const ownerNumbers = (global.owner || []).map(n => String(n).replace(/[^0-9]/g, ''))
        if (ownerNumbers.includes(senderNum)) return false

        // منع التكرار
        if (detectedBots[chatId]?.includes(senderId)) return false
        if (!detectedBots[chatId]) detectedBots[chatId] = []
        detectedBots[chatId].push(senderId)

        // ═══════════ إرسال الميديا ═══════════
        try {
            await conn.sendMessage(chatId, {
                video: { url: MEDIA_URLS.video },
                gifPlayback: true,
                caption: `${HEADER}
${LINE}
│
│ 🚨 *تـم اكـتـشـاف بـوت!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـوع: ${botType}
│
│ 🩸 *جـاري الـطـرد...*
│
${FOOT}`,
                mentions: [senderId]
            })

            await conn.sendMessage(chatId, {
                audio: { url: MEDIA_URLS.audio },
                mimetype: 'audio/mpeg',
                ptt: false
            })
        } catch (mediaErr) {
            console.error('[مضاد-البوتات] media error:', mediaErr.message)
            await conn.sendMessage(chatId, {
                text: `${HEADER}
${LINE}
│
│ 🚨 *تـم اكـتـشـاف بـوت!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـوع: ${botType}
│
${FOOT}`,
                mentions: [senderId]
            })
        }

        // ═══════════ الطرد ═══════════
        try {
            await conn.groupParticipantsUpdate(chatId, [senderId], 'remove')
            await conn.sendMessage(chatId, {
                text: `${HEADER}
${LINE}
│
│ ✅ *تـم طـرد الـبـوت بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـوع: ${botType}
│
${FOOT}`,
                mentions: [senderId]
            })
        } catch (err) {
            await conn.sendMessage(chatId, {
                text: `${HEADER}
${LINE}
│
│ ⚠️ *فـشـل الـطـرد*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـسـبـب: الـبـوت مـش مـشـرف
│
${FOOT}`,
                mentions: [senderId]
            })
        }

        // إزالة من القائمة بعد 10 ثواني
        setTimeout(() => {
            if (detectedBots[chatId]) {
                const index = detectedBots[chatId].indexOf(senderId)
                if (index > -1) detectedBots[chatId].splice(index, 1)
            }
        }, 10000)

        return false

    } catch (e) {
        console.error('[مضاد-البوتات] ❌', e.message)
        return false
    }
}

handler.command = /^(مضاد_البوتات|antibot|نوبوت|مضاد)$/i
handler.tags = ['admin']
handler.help = ['مضاد البوتات']
handler.group = true
handler.botAdmin = true

export default handler