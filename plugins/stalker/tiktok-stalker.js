// ═══════════════════════════════════════════════════════════════
// 🕵️ TikTok Stalker Plugin - MAX BOT
// 📌 MAX LABS 👑
// 📢 https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435
// ═══════════════════════════════════════════════════════════════

import axios from 'axios'

const API = 'https://www.monte-dev.online/api/stalker/tiktok-stalker'

// دالة استخراج البيانات بذكاء من أي مستوى في JSON
const pick = (obj, keys) => {
    const wanted = keys.map(k => k.toLowerCase())
    const seen = new Set()
    const walk = (o) => {
        if (!o || typeof o !== 'object' || seen.has(o)) return undefined
        seen.add(o)
        for (const [k, v] of Object.entries(o)) {
            if (wanted.includes(k.toLowerCase()) && v !== null && v !== undefined && typeof v !== 'object') return v
        }
        for (const v of Object.values(o)) {
            const f = walk(v)
            if (f !== undefined) return f
        }
        return undefined
    }
    return walk(obj)
}

const fmt = (n) => {
    if (n === undefined || n === null || n === '') return '-'
    const num = Number(n)
    return Number.isNaN(num) ? String(n) : num.toLocaleString('en-US')
}

const yesNo = (v) => (v === true || v === 'true' || v === 1 ? 'نعم ✅' : v === undefined ? '-' : 'لا ❌')

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = (args?.[0] || m.quoted?.text || '').trim().replace(/^@/, '')

    if (!user) {
        return m.reply(
            `🎵 *معلومات حساب تيك توك | TikTok Stalker*\n\n` +
            `📌 *طريقة الاستخدام:*\n` +
            `• ${usedPrefix}${command} <اسم المستخدم>\n\n` +
            `💡 *مثال:*\n` +
            `• ${usedPrefix}${command} tiktok`
        )
    }

    await m.react('🥂')

    try {
        const res = await axios.get(API, {
            params: { user },
            timeout: 60000,
            validateStatus: () => true
        })

        if (res.status >= 400) throw new Error(`API Error: ${res.status}`)

        const json = typeof res.data === 'string' ? JSON.parse(res.data) : res.data

        const nickname = pick(json, ['nickname', 'name', 'full_name'])
        const username = pick(json, ['uniqueId', 'username', 'unique_id', 'user']) || user
        const bio      = pick(json, ['signature', 'bio', 'description'])
        const followers = pick(json, ['followerCount', 'followers', 'follower'])
        const following = pick(json, ['followingCount', 'following'])
        const likes    = pick(json, ['heartCount', 'heart', 'likes', 'totalLikes'])
        const videos   = pick(json, ['videoCount', 'videos', 'video'])
        const friends  = pick(json, ['friendCount', 'friends'])
        const verified = pick(json, ['verified'])
        const isPrivate = pick(json, ['privateAccount', 'private', 'isPrivate'])
        const region   = pick(json, ['region', 'country'])
        const lang     = pick(json, ['language', 'lang'])
        const id       = pick(json, ['id', 'userId', 'uid'])
        const created  = pick(json, ['createTime', 'created', 'createdAt'])
        const avatar   = pick(json, ['avatarLarger', 'avatarMedium', 'avatar', 'avatarThumb', 'profilePic'])

        if (!nickname && !followers && !bio && !id) throw new Error('الحساب غير موجود أو البيانات فارغة')

        let createdText = '-'
        if (created) {
            const n = Number(created)
            const d = new Date(n < 1e12 ? n * 1000 : n)
            if (!isNaN(d)) createdText = d.toISOString().split('T')[0]
        }

        const caption =
`🥂 *معلومات حساب تيك توك*

👤 *الاسم:* ${nickname || '-'}
🔖 *اليوزر:* @${username}
🆔 *معرف الحساب:* ${id || '-'}
📝 *البايو:* ${bio || '-'}

👥 *المتابعين:* ${fmt(followers)}
➕ *يتابع:* ${fmt(following)}
❤️ *الإعجابات:* ${fmt(likes)}
🎬 *الفيديوهات:* ${fmt(videos)}
🤝 *الأصدقاء:* ${fmt(friends)}

✔️ *موثق:* ${yesNo(verified)}
🔒 *حساب خاص:* ${yesNo(isPrivate)}
🌍 *المنطقة:* ${region || '-'}
🗣 *اللغة:* ${lang || '-'}
📅 *تاريخ الإنشاء:* ${createdText}

🔗 https://www.tiktok.com/@${username}

> 🍷 MAX BOT`

        if (avatar && /^https?:\/\//i.test(avatar)) {
            await conn.sendMessage(m.chat, { image: { url: avatar }, caption }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
        }

        await m.react('🥂')
    } catch (e) {
        await m.react('❌')
        await m.reply(`❌ فشل جلب بيانات الحساب:\n${e.message}`)
    }
}

handler.help = ['تيك_ستالك']
handler.tags = ['stalker']
handler.command = /^(تيك_ستالك|ttstalk|tiktokstalk)$/i

export default handler
