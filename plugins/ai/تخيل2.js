// plugins/تخيل2.js - إنشاء الصور (Pollinations.ai) 🎨
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    // 1. التحقق من وجود النص
    if (!text) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تخيل2 [وصف الصورة]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .تخيل2 قطة ترتدي نظارة شمسية على شاطئ البحر
│
│ 🩸 *مـلاحـظـة:* يـسـتـخـدم Pollinations.ai الـمـجـانـي
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

    // 2. رسالة جاري الإنشاء
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎨 *جـاري إنـشـاء الـصـورة...*
│ 🩸 *قـد يـسـتـغـرق 10-20 ثـانـيـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // 3. استدعاء API
        let prompt = encodeURIComponent(text);
        let apiUrl = `https://image.pollinations.ai/prompt/${prompt}?model=flux&width=1024&height=1024&nologo=true`;
        
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`فشل الاتصال: ${response.status}`);
        
        let imageBuffer = await response.buffer();
        
        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // 4. إرسال الصورة
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم إنـشـاء الـصـورة بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الأدوات: Pollinations.ai
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: msg 
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تخيل2]', err);
        // حذف رسالة التحميل في حالة الخطأ
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل إنـشـاء الـصـورة*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['تخيل1 (وصف)'];
handler.tags = ['ai'];
handler.command = /^(تخيل2)$/i;
handler.limit = true;

export default handler;