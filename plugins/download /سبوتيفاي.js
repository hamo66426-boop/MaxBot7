// plugins/سبوتيفاي.js - تحميل من Spotify 🎵
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    // 1. التحقق من وجود النص
    if (!text) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ سبوتيفاي [رابط الأغنية]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .سبوتيفاي https://open.spotify.com/track/xxxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    // 2. التحقق من صحة الرابط
    let match = text.match(/https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (!match) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *رابـط غـيـر صـحـيـح*
│ 🩸 *يـرجـى الـتـأكـد مـن رابـط Spotify!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    let trackUrl = match[0];
    let trackId = match[1];

    // 3. رسالة جاري التحميل
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎵 *جـاري تـحـمـيـل الأغـنـيـة مـن Spotify...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // 4. API الأول
        let apiUrl = `https://api.spotifydown.com/download/${trackId}`;
        let response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) throw new Error('فشل الاتصال بـ API');
        
        let data = await response.json();
        
        // 5. لو فشل، نجرب API تاني
        if (!data.success || !data.link) {
            let apiUrl2 = `https://api.agatz.xyz/api/spotify?url=${encodeURIComponent(trackUrl)}`;
            let res2 = await fetch(apiUrl2);
            let data2 = await res2.json();
            
            if (data2.status !== 200 || !data2.data?.download) {
                throw new Error('لم يتم العثور على رابط تحميل صالح');
            }
            data = { success: true, link: data2.data.download, metadata: data2.data };
        }
        
        let downloadLink = data.link;
        
        // 6. جلب ملف الأغنية
        let audioResponse = await fetch(downloadLink);
        if (!audioResponse.ok) throw new Error('فشل تحميل ملف الأغنية');
        
        let audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        
        if (audioBuffer.length < 500000) {
            throw new Error('الملف صغير جداً - قد يكون خاطئاً');
        }

        // حذف رسالة التحميل
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

        // 7. معلومات الأغنية
        let title = data.metadata?.title || 'Unknown';
        let artist = data.metadata?.artist || 'Unknown';

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـحـمـيـل الأغـنـيـة بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـنـوان: ${title}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـفـنـان: ${artist}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${trackUrl}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        // 8. إرسال الصوت
        await conn.sendMessage(m.chat, { 
            audio: audioBuffer, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: m });

        // 9. إرسال الكابشن كرسالة منفصلة
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-سبوتيفاي]', err);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *عـذراً، فـشـل تـحـمـيـل الأغـنـيـة*
│ 🩸 *قـد يـكـون الـرابـط مـعـطـوب أو الـخـادم مـشـغـول*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['سبوتيفاي (رابط)'];
handler.tags = ['downloads'];
handler.command = /^(spotify|سبوتيفاي)$/i;

export default handler;