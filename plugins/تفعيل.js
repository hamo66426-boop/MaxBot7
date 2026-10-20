// plugins/تفعيل.js
// ═══════════════════════════════════════════════════════════
// 👑 لوحة التحكم — ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
// ═══════════════════════════════════════════════════════════

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const IMAGE_URL = 'https://files.catbox.moe/kahw8j.jpg'
const FOOTER = '❄️ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ 👑'
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'
const DEV_URL = 'https://wa.me/201118680635'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT_DIV = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

// ═══════════════════════════════════════════════════════════
// 📋 قوائم الأقسام
// ═══════════════════════════════════════════════════════════
const getDeveloperSections = (isROwner, isOwner, isGroup) => {
    let rows = []
    if (isROwner) {
        rows.push({ header: "", title: `👑 البوت للمطور فقط`, description: "تفعيل وضع المطور فقط", id: ".تفعيل حصر_للمطور" })
        rows.push({ header: "", title: `👑 فتح البوت للجميع`, description: "تفعيل الوضع العام", id: ".تفعيل متاح_للجميع" })
    }
    if (isOwner || isROwner) {
        rows.push({ header: "", title: `🔒 قفل رسائل الخاص`, description: "قفل الخاص لهذا البوت", id: ".تفعيل قفل_الخاص" })
        rows.push({ header: "", title: `🔓 فتح رسائل الخاص`, description: "فتح الخاص للعامة", id: ".تفعيل فتح_الخاص" })
        rows.push({ header: "", title: `🔒 قفل البوتات الفرعية`, description: "إيقاف تنصيب البوتات الفرعية", id: ".تفعيل قفل_الفرعي" })
        rows.push({ header: "", title: `🔓 فتح البوتات الفرعية`, description: "السماح بتنصيب البوتات الفرعية", id: ".تفعيل فتح_الفرعي" })
    }
    if (isGroup) {
        rows.push({ header: "", title: `👥 انتقال ➔ قسم الجروب`, description: "الذهاب لقسم المشرفين", id: ".تفعيل قسم_الجروب" })
    }
    rows.push({ header: "", title: `🏠 القائمة الرئيسية`, description: "العودة للقائمة الرئيسية", id: ".تفعيل" })

    return [{
        title: "👑 قـسـم الـمـطـوريـن 👑",
        rows: rows
    }]
}

const getGroupSections = (isROwner, isOwner) => {
    let rows = [
        { header: "", title: "👋 تفعيل الترحيب", description: "تشغيل رسالة الترحيب", id: ".تفعيل تفعيل_الترحيب" },
        { header: "", title: "🔇 إيقاف الترحيب", description: "تعطيل رسالة الترحيب", id: ".تفعيل تعطيل_الترحيب" },
        { header: "", title: "✏️ تعديل نص الترحيب", description: "تغيير نص الترحيب الحالي", id: ".تفعيل تعديل_الترحيب" },
        { header: "", title: "🗑️ حذف الترحيب المخصص", description: "العودة للترحيب الافتراضي", id: ".تفعيل حذف_الترحيب" },
        { header: "", title: "👑 وضع المشرفين فقط", description: "الأوامر بالمشرفين", id: ".تفعيل تفعيل_وضع_الادمن" },
        { header: "", title: "🌐 الوضع العام للجروب", description: "إتاحة الأوامر للجميع", id: ".تفعيل تعطيل_وضع_الادمن" },
        { header: "", title: "🔗 تفعيل مضاد الروابط", description: "إنذار أول - طرد من تاني مرة", id: ".تفعيل تفعيل_مضاد_الروابط" },
        { header: "", title: "🔓 إيقاف مضاد الروابط", description: "السماح بالروابط", id: ".تفعيل تعطيل_مضاد_الروابط" },
        { header: "", title: "🛡️ تفعيل مضاد الشتائم", description: "مسح الشتائم - طرد الإباحية", id: ".تفعيل تفعيل_مضاد_الشتائم" },
        { header: "", title: "✅ إيقاف مضاد الشتائم", description: "السماح بالشتائم", id: ".تفعيل تعطيل_مضاد_الشتائم" },
        { header: "", title: "📡 تفعيل الرادار الذكي", description: "تشغيل مانع السبام", id: ".تفعيل تفعيل_الرادار" },
        { header: "", title: "📴 إيقاف الرادار الذكي", description: "تعطيل مانع السبام", id: ".تفعيل تعطيل_الرادار" }
    ]
    if (isROwner || isOwner) {
        rows.push({ header: "", title: `👑 انتقال ➔ قسم المطورين`, description: "الذهاب لقسم المطورين", id: ".تفعيل قسم_المطور" })
    }
    rows.push({ header: "", title: `🏠 القائمة الرئيسية`, description: "العودة للقائمة الرئيسية", id: ".تفعيل" })

    return [{
        title: "👑 قـسـم الـمـشـرفـيـن 👑",
        rows: rows
    }]
}

// ═══════════════════════════════════════════════════════════
// 🎨 تحضير Fkontak
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
// 🎛️ إرسال لوحة التحكم
// ═══════════════════════════════════════════════════════════
async function sendInteractiveMenu(conn, chat, title, sections, resultText = null) {
    let captionText
    if (resultText) {
        captionText = `${HEADER}
${LINE}
│
│ 👑 *إشـعـار الـتـحـديـث*
│
│ ❄️ ═══════════════ ❄️
│
${resultText}
│
│ 🔽 *اخـتـر إعـداداً آخـر مـن الـقـائـمـة*
│
${FOOT_DIV}`
    } else {
        captionText = `${HEADER}
${LINE}
│
│ 👑 *لـوحـة الـتـحـكـم*
│
│ ❄️ ═══════════════ ❄️
│
│ ${title}
│
│ 🔽 *اخـتـر مـن الـقـائـمـة*
│
${FOOT_DIV}`
    }

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
            subtitle: title,
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '👑 اختر من القائمة',
                        sections: sections
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 قـنـاة الـبـوت',
                        url: CHANNEL_URL
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👑 رقـم الـمـطـور',
                        url: DEV_URL
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 2, 3, 999],
                    list_title: '👑 لوحة التحكم',
                    button_title: '▻ عـرض الإعـدادات ⚡'
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
        console.error('[تفعيل] interactive failed:', e.message)

        let fallback = captionText + '\n\n*📋 الخيارات:*\n'
        for (const sec of sections) {
            for (const row of sec.rows) {
                fallback += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${row.title}\n   └ ${row.description}\n`
            }
        }
        await conn.sendMessage(chat, { text: fallback }, { quoted: null })
    }
}

// ═══════════════════════════════════════════════════════════
// 🎯 المعالج الرئيسي
// ═══════════════════════════════════════════════════════════
let handler = async (m, { conn, args, text, isAdmin, isOwner, isROwner }) => {
    const isGroup = m.isGroup
    const isGroupAdmin = isAdmin

    const chat = isGroup ? global.db.data.chats[m.chat] : {}

    if (!global.db.data.settings) global.db.data.settings = {}
    if (!global.db.data.settings[conn.user.jid]) {
        global.db.data.settings[conn.user.jid] = {
            self: false,
            privateLocked: false,
            jadibotmd: true
        }
    }
    const botSettings = global.db.data.settings[conn.user.jid]

    let subCmd = (args[0] || '').toLowerCase().trim()
    if (subCmd.startsWith('.')) subCmd = subCmd.substring(1)

    // ═══════════════════════════════════════
    // القائمة الرئيسية
    // ═══════════════════════════════════════
    if (!subCmd) {
        let mainRows = []
        if (isROwner || isOwner) {
            mainRows.push({ header: "", title: `👑 قسم المطورين`, description: "إعدادات المطور وصاحب البوت", id: ".تفعيل قسم_المطور" })
        }
        if (isGroup && (isGroupAdmin || isOwner || isROwner)) {
            mainRows.push({ header: "", title: `👥 قسم المشرفين`, description: "إعدادات المجموعة والمشرفين", id: ".تفعيل قسم_الجروب" })
        }

        if (mainRows.length === 0) return m.reply(`👑 عذراً، ليس لديك أي صلاحيات لفتح هذه القائمة.`)

        return sendInteractiveMenu(conn, m.chat, "اختر القسم الذي تريد الدخول إليه", [{
            title: "👑 الـقـائـمـة الـرئـيـسـيـة 👑",
            rows: mainRows
        }])
    }

    let result = ''
    let category = ''

    switch (subCmd) {
        case 'قسم_المطور':
            if (!isROwner && !isOwner) return m.reply(`👑 هذا القسم للمطور أو صاحب البوت فقط.`)
            return sendInteractiveMenu(conn, m.chat, "أهلاً بك في قسم المطورين:", getDeveloperSections(isROwner, isOwner, isGroup))

        case 'قسم_الجروب':
            if (!isGroupAdmin && !isOwner && !isROwner) return m.reply(`👑 هذا القسم للمشرفين فقط.`)
            return sendInteractiveMenu(conn, m.chat, "إعدادات المشرفين والمجموعة:", getGroupSections(isROwner, isOwner))

        // ═══════════ قسم المطور ═══════════
        case 'قفل_الفرعي':
            if (!isROwner) return
            botSettings.jadibotmd = false
            result = `✅ تم قفل تنصيب البوتات الفرعية بنجاح`
            category = 'dev'
            break
        case 'فتح_الفرعي':
            if (!isROwner) return
            botSettings.jadibotmd = true
            result = `✅ تم فتح تنصيب البوتات الفرعية بنجاح`
            category = 'dev'
            break
        case 'حصر_للمطور':
            if (!isROwner) return
            botSettings.self = true
            result = `🔒 تم تفعيل وضع المطور فقط (مغلق للعامة)`
            category = 'dev'
            break
        case 'متاح_للجميع':
            if (!isROwner) return
            botSettings.self = false
            result = `🔓 تم تفعيل الوضع العام (متاح للجميع)`
            category = 'dev'
            break
        case 'قفل_الخاص':
            if (!isROwner && !isOwner) return
            botSettings.privateLocked = true
            result = `🔒 تم قفل الخاص بنجاح لهذا البوت`
            category = 'dev'
            break
        case 'فتح_الخاص':
            if (!isROwner && !isOwner) return
            botSettings.privateLocked = false
            result = `🔓 تم فتح الخاص للعامة لهذا البوت`
            category = 'dev'
            break

        // ═══════════ قسم الجروب ═══════════
        case 'تفعيل_الترحيب':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.welcome = true
            result = `👋 تم تشغيل الترحيب`
            category = 'group'
            break
        case 'تعطيل_الترحيب':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.welcome = false
            result = `🔇 تم إيقاف الترحيب`
            category = 'group'
            break
        case 'تعديل_الترحيب': {
            if (!isGroupAdmin && !isOwner && !isROwner) return
            const current = chat.customWelcome ? `👑 الحالي: ${chat.customWelcome}` : `👑 الحالي: الترحيب الافتراضي`
            result = `${current}\n\n✏️ لتعديل الترحيب اكتب:\n.تفعيل ترحيب [نص الترحيب]`
            category = 'group'
            break
        }
        case 'حذف_الترحيب': {
            if (!isGroupAdmin && !isOwner && !isROwner) return
            if (!chat.customWelcome) {
                result = `⚠️ الترحيب مسبقاً هو الافتراضي!`
            } else {
                delete chat.customWelcome
                result = `🗑️ تم حذف الترحيب المخصص والعودة للافتراضي`
            }
            category = 'group'
            break
        }
        case 'ترحيب': {
            if (!isGroupAdmin && !isOwner && !isROwner) return
            const welcomeText = args.slice(1).join(' ').trim()
            if (!welcomeText) {
                result = `✏️ اكتب الأمر ومعه نص الترحيب الجديد\nمثال: .تفعيل ترحيب نورت الجروب يا غالي!`
            } else {
                chat.customWelcome = welcomeText
                chat.welcome = true
                result = `✅ تم حفظ رسالة الترحيب المخصصة وتفعيل الترحيب بنجاح!`
            }
            category = 'group'
            break
        }
        case 'تفعيل_وضع_الادمن':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.modoadmin = true
            result = `👑 تم تفعيل وضع المشرفين فقط`
            category = 'group'
            break
        case 'تعطيل_وضع_الادمن':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.modoadmin = false
            result = `🌐 تم إيقاف وضع المشرفين (متاح للكل)`
            category = 'group'
            break

        case 'تفعيل_مضاد_الروابط':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiLink = true
            result = `🔗 تم تفعيل مضاد الروابط\n⚠️ إنذار أول - طرد من تاني مرة`
            category = 'group'
            break
        case 'تعطيل_مضاد_الروابط':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiLink = false
            result = `🔓 تم إيقاف مضاد الروابط`
            category = 'group'
            break

        case 'تفعيل_مضاد_الشتائم':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiBadWords = true
            result = `🛡️ تم تفعيل مضاد الشتائم والإباحية\n🗑️ الشتائم: مسح فقط\n🔞 الإباحية: إنذار أول - طرد من تاني مرة`
            category = 'group'
            break
        case 'تعطيل_مضاد_الشتائم':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiBadWords = false
            result = `✅ تم إيقاف مضاد الشتائم والإباحية`
            category = 'group'
            break

        case 'تفعيل_الرادار':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiSpam = true
            result = `📡 تم تشغيل رادار المراقبة الذكي ومانع السبام`
            category = 'group'
            break
        case 'تعطيل_الرادار':
            if (!isGroupAdmin && !isOwner && !isROwner) return
            chat.antiSpam = false
            result = `📴 تم إيقاف رادار المراقبة والسبام`
            category = 'group'
            break

        default:
            return m.reply(`👑 خيار غير معروف من القائمة`)
    }

    if (result && category) {
        if (category === 'dev') {
            await sendInteractiveMenu(conn, m.chat, "أهلاً بك في قسم المطورين:", getDeveloperSections(isROwner, isOwner, isGroup), result)
        } else if (category === 'group') {
            await sendInteractiveMenu(conn, m.chat, "إعدادات المشرفين والمجموعة:", getGroupSections(isROwner, isOwner), result)
        }
    }
}

handler.before = async function (m, { conn, isOwner, isROwner }) {
    if (!m) return
    const botSettings = global.db.data.settings?.[conn.user.jid]
    if (!m.isGroup && botSettings?.privateLocked && !isOwner && !isROwner) {
        return true
    }
}

handler.help = ['تفعيل']
handler.tags = ['group']
handler.command = ['تفعيل']
handler.group = false

export default handler