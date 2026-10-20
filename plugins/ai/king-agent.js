// plugins/ai/king-agent.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - ربط وكيل الذكاء الاصطناعي "كينج" بالبوت 🤖
// ═══════════════════════════════════════════════════════════
// بيوصل llm/runAgent.js (جوه ilb/aiAgent) بنظام البلجنز بتاع البوت.
// كلمة التفعيل: "كينج" / "كنج" / "king" (شوف ilb/aiAgent/llm/wakeWord.js)
// أمثلة: "كينج اقفل بار" / "كينج افتح بار" / "كينج اطرد فلان"
// ═══════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { runAgent } from '../../ilb/aiAgent/llm/runAgent.js'

// ─────────────────────────────────────────────────────────
// المشروع مش بيستخدم مكتبة dotenv، فبنحمّل ملف .env بأنفسنا
// (لازم يكون في جذر المشروع، جنب index.js) عشان GROQ_API_KEY
// يوصل لـ process.env قبل ما runAgent يحتاجه.
// ─────────────────────────────────────────────────────────
;(function loadEnvFile() {
    try {
        const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')
        const envPath = path.join(rootDir, '.env')
        if (!fs.existsSync(envPath)) {
            console.log('[KingAgent] ⚠️ مفيش ملف .env في جذر المشروع — ميزة الذكاء الاصطناعي هتكون متعطلة لحد ما تضيفه.')
            return
        }
        const content = fs.readFileSync(envPath, 'utf8')
        for (const rawLine of content.split('\n')) {
            const line = rawLine.trim()
            if (!line || line.startsWith('#')) continue
            const eq = line.indexOf('=')
            if (eq === -1) continue
            const key = line.slice(0, eq).trim()
            let value = line.slice(eq + 1).trim()
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            if (key && !(key in process.env)) process.env[key] = value
        }
        console.log('[KingAgent] ✅ تم تحميل ملف .env')
    } catch (e) {
        console.error('[KingAgent] ❌ فشل تحميل .env:', e?.message || e)
    }
})()

const handler = async () => {}

// ═══════════════════════════════════════════════════════════
// 🎯 handler.all — بيشتغل على كل رسالة، وبيكتشف كلمة التفعيل
// ملحوظة: هنا "this" هو الـ conn (شوف handler.js:
// plugin.all.call(this, m, {...}) — من غير conn في الـ object)
// ═══════════════════════════════════════════════════════════
handler.all = async function (m) {
    const conn = this
    try {
        if (!conn || !conn.user) return false
        if (m.fromMe) return false
        if (typeof m.text !== 'string' || !m.text.trim()) return false

        const isROwner = (global.owner || []).some(
            (n) => n === m.sender || n + '@lid' === m.sender || n + '@s.whatsapp.net' === m.sender
        )
        const isOwner = isROwner

        await runAgent(m, {
            conn,
            isAdmin: m.isAdmin || false,
            isBotAdmin: m.isBotAdmin || false,
            isOwner,
            isROwner,
            groupMetadata: null // executionMap.js بيجيبها بنفسه لو null (conn.groupMetadata)
        })
    } catch (e) {
        console.error('[KingAgent] ❌ خطأ:', e?.message || e)
    }
    return false
}

handler.help = []
handler.tags = []
handler.command = false
handler.disabled = false

export default handler
