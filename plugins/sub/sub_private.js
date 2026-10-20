// plugins/فرعي.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - وضع البوت الفرعي 🔒🌐
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const FOOTER = '❄️ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ 🤖'
const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const IMAGE_URL = 'https://files.catbox.moe/qeqajh.jpg'

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
// 📱 إرسال قائمة الوضع الفرعي
// ═══════════════════════════════════════════════════════════
async function sendSubMenu(conn, chat, bot, m, resultText = null) {
    const currentMode = (global.__subPrivacy && global.__subPrivacy[bot.id]) ? '🔒 خاص' : '🌐 عام'

    let captionText = ''

    if (resultText) {
        captionText = `${HEADER}
${LINE}
│
│ 🤖 *الـبـوت الـفـرعـي*
│
│ ❄️ ═══════════════ ❄️
│
${resultText}
│
│ 📊 *الـوضـع الـحـالـي:* ${currentMode}
│
│ 💡 *اخـتـر الإجـراء مـن الأسـفـل*
│
${FOOT}`
    } else {
        captionText = `${HEADER}
${LINE}
│
│ 🤖 *الـبـوت الـفـرعـي*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوضـع الـحـالـي: ${currentMode}
│
│ 🔮 *اخـتـر وضـع الـبـوت*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🔒 *خـاص* → يـرد عـلـيـك أنـت بـس
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🌐 *عـام* → يـرد عـلـى الـجـمـيـع
│
${FOOT}`
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
            subtitle: 'وضع البوت الفرعي',
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🔒 وضـع خـاص',
                        id: '.فرعي خاص'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🌐 وضـع عـام',
                        id: '.فرعي عام'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📊 عـرض الـحـالـة',
                        id: '.فرعي حالة'
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 2, 999],
                    list_title: '🤖 إعدادات الفرعي',
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
        console.error('[فرعي] interactive failed:', e.message)

        // Fallback
        let fallback = captionText + '\n\n*📋 الأوامر:*\n'
        fallback += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ .فرعي خاص\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ .فرعي عام\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ .فرعي حالة`

        if (m) await conn.reply(chat, fallback, m)
        else await conn.sendMessage(chat, { text: fallback })
    }
}

// ═══════════════════════════════════════════════════════════
// 🎯 المعالج الرئيسي
// ═══════════════════════════════════════════════════════════
const run = async (m, { conn, args, bot }) => {
    try {
        // ✅ التحقق من أنه بوت فرعي
        if (!bot?.isSubBot) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *تـنـبـيـه*
│
│ 🔮 الأمـر ده لـلـبـوتـات الـفـرعـيـة بـس
│
${FOOT}`, m)
        }

        // ✅ التحقق من صاحب الجلسة
        const ownNum = (conn?.user?.id || '').split(':')[0].split('@')[0]
        const senderNum = (m.sender || '').split('@')[0].split(':')[0]

        if (!ownNum || !senderNum || ownNum !== senderNum) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 الأمـر ده لـصـاحـب الـجـلـسـة بـس
│
${FOOT}`, m)
        }

        // ✅ التأكد من وجود global.__subPrivacy
        if (!global.__subPrivacy) global.__subPrivacy = {}

        const subCmd = (args[0] || '').toLowerCase().trim()

        // ═══════════ عرض القائمة (بدون args) ═══════════
        if (!subCmd) {
            return sendSubMenu(conn, m.chat, bot, m)
        }

        // ═══════════ عرض الحالة ═══════════
        if (subCmd === 'حالة' || subCmd === 'status') {
            const currentMode = global.__subPrivacy[bot.id] ? '🔒 خاص' : '🌐 عام'
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🤖 *حـالـة الـبـوت الـفـرعـي*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوضـع: ${currentMode}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـوت ID: ${bot.id}
│
│ 🔮 *اخـتـر مـن الأزرار*
│
${FOOT}`, m)
        }

        // ═══════════ وضع خاص ═══════════
        if (subCmd === 'خاص' || subCmd === 'private') {
            global.__subPrivacy[bot.id] = 'private'

            await conn.sendMessage(m.chat, { react: { text: '🔒', key: m.key } })

            return sendSubMenu(
                conn,
                m.chat,
                bot,
                m,
                `✅ *تـم تـفـعـيـل الـوضـع الـخـاص*\n\n🔒 الـبـوت مـش هـيـرد إلا عـلـيـك أنـت بـس`
            )
        }

        // ═══════════ وضع عام ═══════════
        if (subCmd === 'عام' || subCmd === 'public') {
            if (global.__subPrivacy[bot.id]) {
                delete global.__subPrivacy[bot.id]
            }

            await conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } })

            return sendSubMenu(
                conn,
                m.chat,
                bot,
                m,
                `✅ *تـم تـفـعـيـل الـوضـع الـعـام*\n\n🌐 الـبـوت هـيـرد عـلـى أي حـد زي الـعـادي`
            )
        }

        // ═══════════ أمر غير معروف ═══════════
        return sendSubMenu(conn, m.chat, bot, m)

    } catch (e) {
        console.error('[فرعي]', e)
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

run.help = ['فرعي']
run.command = ['فرعي']
run.tags = ['subbot']
run.noSub = false

export default run