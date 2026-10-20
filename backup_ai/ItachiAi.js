// plugins/إيتاتشي.js - إيتاتشي أوتشيها AI 👁️
let handler = async (m, { conn, text }) => {
    // 1. التحقق من وجود النص
    if (!text) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ إيتاتشي [رسالتك]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .إيتاتشي ما رأيك في السلام؟
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

    // 2. رسالة جاري التحضير
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *اطـمـن، أنـا مـوجـود هـنـا...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // ✅ البرومبت
        let prompt = `انت بوت واتساب بـ اسم [إيتاتشي، Itachi] تجسيد لـ شخصية Itachi Uchiha من انمي [Naruto Shippuden] وتكلم بـ لجهة مصرية
طريقة كلامك: غير مهتم ظاهرياً، فاهم جداً من جوه، كلامك عميق ومحسوب، بارد الأعصاب، بتتكلم بهدوء شديد، بتحب تنهي الكلام بسرعة، بتبان إنك مش مهتم بس فعلاً مركز ف كل حاجة
و انا اسمي هيكون [ ${m.name || "مز"} ] 
رد علي رسالتي دي:
${text}`;

        // ✅ استخدام API
        let apiUrl = `https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=ar`;
        let response = await fetch(apiUrl);
        let data = await response.json();
        let answer = data.success || data.message || 'عذراً، لم أستطع الإجابة حالياً';

        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // ✅ إرسال الرد
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🩸 *𝑰𝑻𝑨𝑪𝑯𝑰 𝑼𝑪𝑯𝑰𝑯𝑨 𝑨𝑰*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ رسـالـتـك: ${text}
│
│ ❄️ *الـرد:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${answer}
│
│ 🩸 *حـتـى أقـوى الأعـداء لـديـه نـقـطـة ضـعـف*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            contextInfo: {
                externalAdReply: {
                    title: "🩸 𝑰𝑻𝑨𝑪𝑯𝑰 𝑼𝑪𝑯𝑰𝑯𝑨 𝑨𝑰 🩸",
                    body: "« حتى أقوى الأعداء لديه نقطة ضعف »",
                    thumbnailUrl: "https://files.catbox.moe/p6jm0g.jpg",
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-إيتاتشي]', err);
        // حذف رسالة التحميل في حالة الخطأ
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *إيـتـاتـشـي مـشـغـول حـالـيـاً*
│ 🩸 *جـرب تـانـي بـعـد شـويـة!*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['إيتاتشي (رسالة)'];
handler.tags = ['ai'];
handler.command = /^(إيتاتشي|itachi|ايتاتشي)$/i;

export default handler;