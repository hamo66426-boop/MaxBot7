// plugins/حماية.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - نظام الحماية 🛡️
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const FOOTER = '❄️ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ 🛡️'
const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const IMAGE_URL = 'https://files.catbox.moe/qeqajh.jpg'

// ═══════════════════════════════════════════════════════════
// 📊 المستويات
// ═══════════════════════════════════════════════════════════
const LEVELS = {
    1: {
        name: 'حماية عادية 🟢',
        short: '🟢 عادية',
        desc: 'حماية أساسية - مناسبة للجروبات الودية',
        antiLink: false,
        antiSpam: true,
        antiBot: true,
        antiTag: false,
        antiFake: false,
        warnBeforeKick: true,
        maxWarnings: 3
    },
    2: {
        name: 'حماية متوسطة 🟡',
        short: '🟡 متوسطة',
        desc: 'حماية متوازنة - للجروبات النشطة',
        antiLink: true,
        antiSpam: true,
        antiBot: true,
        antiTag: true,
        antiFake: true,
        warnBeforeKick: true,
        maxWarnings: 2
    },
    3: {
        name: 'حماية صارمة 🔴',
        short: '🔴 صارمة',
        desc: 'حماية مشددة - طرد فوري بدون إنذار',
        antiLink: true,
        antiSpam: true,
        antiBot: true,
        antiTag: true,
        antiFake: true,
        warnBeforeKick: false,
        maxWarnings: 1
    }
}

const getG = (chatId) => {
    if (!global._gs) global._gs = {}
    if (!global._gs[chatId]) global._gs[chatId] = {}
    return global._gs[chatId]
}

// ═══════════════════════════════════════════════════════════
// 🎨 Fkontak
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// 📋 نص تفاصيل المستوى
// ═══════════════════════════════════════════════════════════
function levelDetails(cfg, level) {
    let t = ''
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🔗 مضاد الروابط: ${cfg.antiLink ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 📢 مضاد الإزعاج: ${cfg.antiSpam ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🤖 مضاد البوتات: ${cfg.antiBot ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🏷️ مضاد المنشن: ${cfg.antiTag ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 📵 مضاد الوهمي: ${cfg.antiFake ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⚠️ حد الإنذارات: ${cfg.maxWarnings}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🩸 إنذار قبل الطرد: ${cfg.warnBeforeKick ? '✅' : '❌'}\n`
    t += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⚡ وضع صارم: ${level === 3 ? '✅ طرد فوري' : '❌'}`
    return t
}

// ═══════════════════════════════════════════════════════════
// 📱 إرسال قائمة الاختيار الرئيسية
// ═══════════════════════════════════════════════════════════
async function sendMainMenu(conn, chat, g) {
    const current = g.securityLevel || 0
    const currentText = current ? LEVELS[current].short : '🔴 مقفول'

    let captionText = `${HEADER}
${LINE}
│
│ 🛡️ *نـظـام الـحـمـايـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـتـوى الـحـالـي: ${currentText}
│
│ 🔮 *اخـتـر مـسـتـوى مـن الـقـائـمـة*
│
│ 💡 *الـمـسـتـويـات الـمـتـاحـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🟢 حماية عادية
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🟡 حماية متوسطة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🔴 حماية صارمة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⚪ إغلاق الحماية
│
${FOOT}`

    const sections = [{
        title: '🛡️ اخـتـر الـمـسـتـوى',
        rows: [
            { header: '🟢 الـمـسـتـوى الأول', title: '🟢 حماية عادية', description: 'مناسبة للجروبات الودية - إنذار 3 مرات', id: '.حماية اختر_1' },
            { header: '🟡 الـمـسـتـوى الـثـانـي', title: '🟡 حماية متوسطة', description: 'للجروبات النشطة - إنذار مرتين', id: '.حماية اختر_2' },
            { header: '🔴 الـمـسـتـوى الـثـالـث', title: '🔴 حماية صارمة', description: 'طرد فوري بدون إنذار', id: '.حماية اختر_3' },
            { header: '⚪ إيـقـاف', title: '⚪ إغلاق الحماية', description: 'تعطيل كل أنظمة الحماية', id: '.حماية 0' }
        ]
    }]

    let media = null
    try {
        const res = await fetch(IMAGE_URL)
        const buf = Buffer.from(await res.arrayBuffer())
        media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer })
    } catch {}

    const payload = {
        body: { text: captionText },
        footer: { text: FOOTER },
        header: {
            hasMediaAttachment: !!media,
            subtitle: 'نظام الحماية',
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '🛡️ اخـتـر الـمـسـتـوى',
                        sections: sections
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 999],
                    list_title: '🛡️ مستويات الحماية',
                    button_title: '▻ عـرض الـمـسـتـويـات ⚡'
                }
            })
        }
    }

    try {
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
        const fkontak = await makeFkontak(IMAGE_URL)
        const msg = generateWAMessageFromContent(chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak })
        await conn.relayMessage(chat, msg.message, { messageId: msg.key.id })
    } catch (e) {
        console.error('[حماية] interactive failed:', e.message)
        let fallback = captionText + '\n\n*🛡️ الأوامر:*\n'
        fallback += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ .حماية 1\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ .حماية 2\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ .حماية 3\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ .حماية 0`
        await conn.sendMessage(chat, { text: fallback })
    }
}

// ═══════════════════════════════════════════════════════════
// 📱 إرسال تفاصيل مستوى معين + أزرار تفعيل/إيقاف
// ═══════════════════════════════════════════════════════════
async function sendLevelDetails(conn, chat, g, level, m) {
    const cfg = LEVELS[level]
    const isActive = g.securityLevel === level

    let captionText = `${HEADER}
${LINE}
│
│ 🛡️ *${cfg.name}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف: ${cfg.desc}
│
│ 📊 *الـتـفـاصـيـل:*
${levelDetails(cfg, level)}
│
│ 🔮 *الـحـالـة:* ${isActive ? '🟢 مـفـعـل حـالـيـاً' : '🔴 غـيـر مـفـعـل'}
│
│ 💡 *اخـتـر إجـراء مـن الأسـفـل*
│
${FOOT}`

    let media = null
    try {
        const res = await fetch(IMAGE_URL)
        const buf = Buffer.from(await res.arrayBuffer())
        media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer })
    } catch {}

    const payload = {
        body: { text: captionText },
        footer: { text: FOOTER },
        header: {
            hasMediaAttachment: !!media,
            subtitle: cfg.name,
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '✅ تـفـعـيـل',
                        id: `.حماية ${level}`
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '❌ إيـقـاف',
                        id: `.حماية 0`
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🔙 رجـوع للـقـائـمـة',
                        id: `.حماية`
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 2, 999],
                    list_title: '🛡️ إجراءات',
                    button_title: '▻ الإجـراءات ⚡'
                }
            })
        }
    }

    try {
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload)
        const fkontak = await makeFkontak(IMAGE_URL)
        const msg = generateWAMessageFromContent(chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak })
        await conn.relayMessage(chat, msg.message, { messageId: msg.key.id })
    } catch (e) {
        console.error('[حماية] level details failed:', e.message)
        if (m) await conn.reply(chat, captionText, m)
    }
}

// ═══════════════════════════════════════════════════════════
// 🎯 المعالج
// ═══════════════════════════════════════════════════════════
const handler = async (m, { conn, command, text, isAdmin, isOwner, isROwner }) => {
    try {
        if (!m.isGroup) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 الأمـر ده شـغـال فـي الـجـروبـات بـس
│
${FOOT}`, m)
        }

        const g = getG(m.chat)
        const rawText = (text || '').trim()

        // ═══════════════════════════════════════════════════
        // 📋 عرض القائمة الرئيسية (بدون args)
        // ═══════════════════════════════════════════════════
        if (!rawText) {
            return sendMainMenu(conn, m.chat, g)
        }

        // ═══════════════════════════════════════════════════
        // 📋 اختر 1/2/3 (عرض التفاصيل)
        // ═══════════════════════════════════════════════════
        const chooseMatch = rawText.match(/^اختر_([123])$/)
        if (chooseMatch) {
            const lvl = parseInt(chooseMatch[1])
            return sendLevelDetails(conn, m.chat, g, lvl, m)
        }

        // ═══════════════════════════════════════════════════
        // 🔒 التحقق من الصلاحيات (للتفعيل/الإيقاف)
        // ═══════════════════════════════════════════════════
        if (!isAdmin && !isOwner && !isROwner) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 الأمـر ده لـلـمـشـرفـيـن فـقـط
│
${FOOT}`, m)
        }

        const level = parseInt(rawText)

        if (Number.isNaN(level) || level < 0 || level > 3) {
            return sendMainMenu(conn, m.chat, g)
        }

        // ═══════════════════════════════════════════════════
        // ⚪ إغلاق الحماية
        // ═══════════════════════════════════════════════════
        if (level === 0) {
            g.securityLevel = null
            g.antiLink = false
            g.antiSpam = false
            g.antiBot = false
            g.antiTag = false
            g.antiFake = false
            g.maxWarnings = null
            g.strictMode = null

            await conn.sendMessage(m.chat, { react: { text: '⚪', key: m.key } })

            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚪ *تـم إغـلاق الـحـمـايـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🔴 مـقـفـول
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـأمـر: @${m.sender.split('@')[0]}
│
│ 🩸 *الـجـروب مـش مـحـمـي دلـوقـتـي*
│
${FOOT}`, m)
        }

        // ═══════════════════════════════════════════════════
        // 🟢🟡🔴 تفعيل المستوى
        // ═══════════════════════════════════════════════════
        const cfg = LEVELS[level]

        g.securityLevel = level
        g.antiLink = cfg.antiLink || null
        g.antiSpam = cfg.antiSpam || null
        g.antiBot = cfg.antiBot || null
        g.antiTag = cfg.antiTag || null
        g.antiFake = cfg.antiFake || null
        g.maxWarnings = cfg.maxWarnings
        g.strictMode = level === 3 || null
        g.warnBeforeKick = cfg.warnBeforeKick

        await conn.sendMessage(m.chat, { react: { text: '🛡️', key: m.key } })

        await conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🛡️ *تـم تـفـعـيـل الـحـمـايـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـتـوى: ${cfg.name}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف: ${cfg.desc}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـأمـر: @${m.sender.split('@')[0]}
│
│ 📊 *الـتـفـاصـيـل:*
${levelDetails(cfg, level)}
│
│ 🩸 *الـجـروب مـحـمـي دلـوقـتـي*
│
${FOOT}`, m)

        // عرض التفاصيل بأزرار بعد التفعيل
        setTimeout(() => {
            sendLevelDetails(conn, m.chat, g, level, null)
        }, 1500)

    } catch (e) {
        console.error('[حماية]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *فـشـل الـتـنـفـيـذ*
│
│ 🔮 ${e.message?.slice(0, 100)}
│
${FOOT}`, m)
    }
}

handler.help = ['حماية']
handler.command = ['حماية', 'حمايهه', 'مستوى_الحماية']
handler.tags = ['admin']
handler.group = true

export default handler