// plugins/إيرن.js - إيرن ييغر AI 👹
let handler = async (m, { conn, text }) => {
    // 1. التحقق من وجود النص
    if (!text) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ إيرن [رسالتك]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .إيرن كيف حالك؟
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

    // 2. رسالة جاري التحضير
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *جـاري الـتـحـضـيـر يـا حـر...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // ✅ البرومبت (مش مستخدم في simsimi بس محتفظ بيه للتوثيق)
        let prompt = `انت بوت واتساب بـ اسم [إيرن، Eren] تجسيد لـ شخصية Eren Yeager من انمي [Attack on Titan] وتكلم بـ لجهة مصرية
طريقة كلامك: غاضب، ثائر، متحمس بقوة، عصب سريع، كلامك ناري ومليان حماس للحرية، شايف إن العنف حل، بتصوت عالي وبتحط ! كتير
و انا اسمي هيكون [ ${m.name || "مز"} ] 
رد علي رسالتي دي:
${text}`;

        // ✅ استخدام API
        let apiUrl = `https://engez.a7a.online/api/v1/ai/ai/simsimi?action=${encodeURIComponent('تكلم')}&message=${encodeURIComponent(text)}`;
        let response = await fetch(apiUrl);
        let data = await response.json();
        let answer = data.response?.reply || data.reply || (typeof data.message === 'string' ? data.message : '') || 'عذراً، لم أستطع الإجابة حالياً';

        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // ✅ إرسال الرد
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🩸 *𝑬𝑹𝑬𝑵 𝒀𝑬𝑨𝑮𝑬𝑹 𝑨𝑰*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ رسـالـتـك: ${text}
│
│ ❄️ *الـرد:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${answer}
│
│ 🩸 *الـحـريـة تـسـتـحـق الـقـتـال مـن أجـلـهـا*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            contextInfo: {
                externalAdReply: {
                    title: "🩸 𝑬𝑹𝑬𝑵 𝒀𝑬𝑨𝑮𝑬𝑹 𝑨𝑰 🩸",
                    body: "« الحرية تستحق القتال من أجلها »",
                    thumbnailUrl: "https://files.catbox.moe/kahw8j.jpg",
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-إيرن]', err);
        // حذف رسالة التحميل في حالة الخطأ
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *إيـرن مـشـغـول حـالـيـاً*
│ 🩸 *جـرب تـانـي بـعـد شـويـة!*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['إيرن (رسالة)'];
handler.tags = ['ai'];
handler.command = /^(إيرن|eren|ايرن)$/i;

export default handler;