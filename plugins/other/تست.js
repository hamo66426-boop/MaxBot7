// plugins/الردود.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - ردود البوت التلقائية 🤖
// ═══════════════════════════════════════════════════════════

import { performance } from 'perf_hooks'

let handler = m => m

const REPLIES = [{ title: 'موجود ي حب 🥂', line: '', emoji: '🥂' }]
function getSpeed() {
    const start = performance.now()
    let x = 0
    for (let i = 0; i < 1000; i++) x += Math.sqrt(i)
    const end = performance.now()
    return (end - start).toFixed(4)
}

handler.before = async function (m, { conn }) {
    try {
        if (!m.text) return false

        const txt = m.text.trim().toLowerCase()

        if (txt === 'تست' || txt === 'test') {
            try {
                await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } })
            } catch {}

            const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)]
            const speed = getSpeed()

            const replyMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ${reply.emoji} *${reply.title}*
│
│ 🫡 *${reply.line}*
│
│ ⚡ *الـسـرعـة: ${speed}ms*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

            await m.reply('*موجود ي حب 🥂*')
            return true
        }

        return false
    } catch (e) {
        console.error('[الردود]', e)
        return false
    }
}

handler.tags = ['misc']
handler.help = ['ردود البوت']
handler.command = false
handler.disabled = false

export default handler