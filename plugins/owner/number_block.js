// plugins/بلوك.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - بلوك / فك بلوك 🚫
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

// 🔢 استخراج الرقم من أي نص
function numOf(text) {
    if (!text) return ''
    return String(text).replace(/[^0-9]/g, '')
}

const ff = async (m, { conn, args, command, isOwner, isROwner }) => {
    try {
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

        const raw = args[0]

        if (!raw) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *خـطـأ*
│
│ 🔮 اكـتـب الـرقـم كـده:
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} 201xxxxxxxxx
│
${FOOT}`, m)
        }

        const num = numOf(raw.replace(/[+\s-]/g, ''))

        if (!num || !/^\d{8,15}$/.test(num)) {
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❌ *الـرقـم غـيـر صـحـيـح*
│
│ 🔮 ابـعـتـه مـن غـيـر رمـوز:
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} 201xxxxxxxxx
│
${FOOT}`, m)
        }

        const jid = `${num}@s.whatsapp.net`

        // ✅ التأكد من وجود db
        if (!global.db.data) global.db.data = {}
        if (!global.db.data.users) global.db.data.users = {}
        if (!global.db.data.users[jid]) {
            global.db.data.users[jid] = {
                name: '',
                premium: false,
                premiumTime: 0,
                banned: false,
                BannedReason: ''
            }
        }

        const user = global.db.data.users[jid]
        const isUnblock = command === 'فك_بلوك'

        // ═══════════════════════════════════════
        // 🔓 فك البلوك
        // ═══════════════════════════════════════
        if (isUnblock) {
            if (!user.banned) {
                await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
                return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *تـنـبـيـه*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${num}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: غـيـر مـحـظـور أصـلاً
│
${FOOT}`, m)
            }

            user.banned = false
            user.BannedReason = ''

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *تـم فـك الـبـلوك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${num}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🔓 مـفـتـوح
│
│ 🩸 *دلـوقـتـي يـقـدر يـسـتـخـدم الـبـوت*
│
${FOOT}`, m)
        }

        // ═══════════════════════════════════════
        // 🚫 بلوك
        // ═══════════════════════════════════════
        if (user.banned) {
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ⚠️ *تـنـبـيـه*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${num}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: مـحـظـور أصـلاً
│
${FOOT}`, m)
        }

        user.banned = true
        user.BannedReason = `تم الحظر بواسطة ${m.sender.split('@')[0]}`

        await conn.sendMessage(m.chat, { react: { text: '🚫', key: m.key } })

        return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ 🚫 *تـم الـبـلوك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرقـم: ${num}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🔒 مـحـظـور
│
│ 🩸 *مـش هـيـقـدر يـسـتـخـدم الـبـوت*
│
${FOOT}`, m)

    } catch (e) {
        console.error('[بلوك]', e)
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

ff.help = ['بلوك 201xxxxxxxxx', 'فك_بلوك 201xxxxxxxxx']
ff.command = ['بلوك', 'فك_بلوك']
ff.tags = ['owner']
ff.owner = true

export default ff