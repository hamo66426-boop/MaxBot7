// plugins/الانضمام_للقناة.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - الانضمام التلقائي للقناة 📢
// ═══════════════════════════════════════════════════════════
// ⚡ Developer: ꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂
// 🩸 يمنع سرقة الكود أو تعديله
// ═══════════════════════════════════════════════════════════

// 📢 القنوات اللي البوت هينضم لها (ضيف كتير لو حابب)
const CHANNELS = [
    '120363424844460135@newsletter'
]

// 🎯 علامة: هل البوت انضم بالفعل؟
if (typeof global.__channelAutoJoined === 'undefined') {
    global.__channelAutoJoined = false
}

// ═══════════════════════════════════════════════════════════
// 🔄 دالة الانضمام للقنوات
// ═══════════════════════════════════════════════════════════
async function joinChannels(conn) {
    let success = 0
    let failed = 0

    for (const jid of CHANNELS) {
        if (!jid || typeof jid !== 'string') continue

        try {
            if (typeof conn.newsletterFollow === 'function') {
                await conn.newsletterFollow(jid)
                console.log(`[AutoJoin] ✅ تم الانضمام: ${jid}`)
                success++
            } else {
                console.log(`[AutoJoin] ⚠️ newsletterFollow غير مدعوم`)
                failed++
            }
        } catch (e) {
            const msg = e?.message || ''
            if (msg.includes('already') || msg.includes('exists')) {
                console.log(`[AutoJoin] 🟢 عضو بالفعل: ${jid}`)
                success++
            } else {
                console.log(`[AutoJoin] ❌ فشل ${jid}: ${e.message}`)
                failed++
            }
        }

        // تأخير بين كل قناة عشان نتجنب rate-overlimit
        await new Promise(r => setTimeout(r, 1500))
    }

    console.log(`[AutoJoin] 📊 النتيجة: ✅ ${success} | ❌ ${failed}`)
    return success > 0
}

// ═══════════════════════════════════════════════════════════
// 🎯 handler.all — بيشتغل على كل رسالة (بدون أمر)
// ═══════════════════════════════════════════════════════════
const handler = async () => {}

handler.all = async function (m, { conn }) {
    // ✅ لو انضم بالفعل → متعملش حاجة
    if (global.__channelAutoJoined) return false

    // ✅ نتأكد إن conn جاهز
    if (!conn || !conn.user) return false

    // 🔒 نقفل العلامة فوراً عشان نمنع تكرار المحاولات
    global.__channelAutoJoined = true

    console.log('[AutoJoin] 🔄 جاري الانضمام للقنوات...')

    try {
        const ok = await joinChannels(conn)
        if (ok) {
            console.log('[AutoJoin] ✅ تم الانضمام بنجاح')
        } else {
            console.log('[AutoJoin] ⚠️ فشل الانضمام')
        }
    } catch (e) {
        console.error('[AutoJoin] ❌ خطأ:', e.message)
    }

    return false
}

// 🏷️ المعلومات
handler.help = []
handler.tags = []
handler.command = false
handler.disabled = false

export default handler