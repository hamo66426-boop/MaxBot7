// plugins/انستا.js - تحميل من انستجرام 📥
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 1. التحقق من وجود الرابط
    if (!args[0]) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [رابط انستجرام]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} https://www.instagram.com/reel/xxxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    // 2. التحقق من صحة الرابط
    if (!args[0].includes('instagram.com')) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *يـرجـى إدخـال رابـط Instagram صـحـيـح!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    // 3. رسالة جاري التحميل
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 📥 *جـاري تـحـمـيـل الـفـيـديـو مـن انـسـتـجـرام...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // 4. API الأول
        let apiUrl = `https://tanjirodev.online/api/down-snap?url=${encodeURIComponent(args[0])}`;
        let res = await fetch(apiUrl);
        let json = await res.json();

        // 5. لو فشل، نجرب API تاني
        if (json.status !== "success" || !json.results || json.results.length === 0) {
            let apiUrl2 = `https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(args[0])}`;
            let res2 = await fetch(apiUrl2);
            let json2 = await res2.json();
            
            if (json2.status !== 200 || !json2.data) {
                throw new Error('تعذر العثور على روابط تحميل لهذا الرابط.');
            }
            
            json = {
                status: "success",
                results: [{ url: json2.data.url || json2.data.video || json2.data.media }],
                title: json2.data.author || 'Instagram'
            };
        }

        let downloadUrl = json.results[0].url;
        let title = json.title || 'Instagram';

        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // 6. إرسال الفيديو
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم الـتـحـمـيـل مـن Instagram بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـسـاب: ${title}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${args[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-انستا]', err);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـدث خـطـأ أثـنـاء الـتـحـمـيـل:*
│ 🩸 ${err.message || err}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['انستا (رابط)'];
handler.tags = ['downloads'];
handler.command = /^(انستا|instagram|ig|انستجرام)$/i;

export default handler;