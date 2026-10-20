// plugins/تخيل5.js - إنشاء الصور (Flux Pro 2) 🎨
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من وجود النص
    if (!text) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [وصف الصورة]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} مدينة مستقبلية بنظام النيون
│
│ 🩸 *الـتـقـنـيـة:* Flux Pro 2
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m)

    // 2. رسالة جاري الإنشاء
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎨 *جـاري تـجـهـيـز مـخـتـبـر 2B...*
│ 🩸 *قـد تـسـتـغـرق الـعـمـلـيـة 30-60 ثـانـيـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // 3. بدء مهمة التوليد
        let initUrl = `https://omegatech-api.dixonomega.tech/api/ai/flux-pro2?prompt=${encodeURIComponent(text)}`;
        let { data: initRes } = await axios.get(initUrl, { timeout: 30000 });

        if (!initRes.success || !initRes.task_id) {
            throw new Error('تعذر بدء عملية التصميم، حاول مرة أخرى.');
        }

        let taskId = initRes.task_id;
        let resultUrl = null;
        let attempts = 0;
        const MAX_ATTEMPTS = 25;

        // 4. تتبع الحالة حتى اكتمال الصورة
        while (!resultUrl && attempts < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, 5000));
            
            let checkUrl = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${taskId}`;
            
            // ✅ إصلاح: التحقق من response قبل استخدامه
            let check;
            try {
                let { data } = await axios.get(checkUrl, { timeout: 15000 });
                check = data;
            } catch (apiErr) {
                // لو الـ check فشل، نكمل المحاولة
                attempts++;
                continue;
            }

            if (check && check.status === 'completed' && check.image_url) {
                resultUrl = check.image_url;
                break;
            }
            
            if (check && check.status === 'failed') {
                throw new Error('فشل السيرفر في توليد الصورة.');
            }
            
            attempts++;
        }

        if (!resultUrl) throw new Error('انتهى وقت الانتظار، السيرفر مضغوط حاليًا.');

        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // 5. إرسال الصورة النهائية
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم رسـم خـيـالـك بـنـجـاح!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـطـلـب: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـتـقـنـيـة: Flux Pro 2
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـحـاولات: ${attempts + 1}
│
│ 👑 *اسـتـمـتـع بـالـنـتـيـجـة مـع 2B*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }, 
            caption: msg 
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تخيل5]', err);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل الأمـر:*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['تخيل2 (وصف)'];
handler.tags = ['ai'];
handler.command = /^(تخيل5)$/i;

export default handler;