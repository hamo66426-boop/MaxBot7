// plugins/فيس.js - بحث وتحميل من فيسبوك 📘
import fetch from 'node-fetch';

const API_BASE = 'https://engez.a7a.online/api/v1';

// ═══════════ البحث في فيسبوك ═══════════
async function searchFacebook(query) {
    try {
        let params = new URLSearchParams({ q: query });
        let res = await fetch(`${API_BASE}/search/facebook?${params.toString()}`);
        let data = await res.json();
        if (!data?.success) throw new Error(data?.error || 'فشل البحث');
        return data.results || [];
    } catch (err) {
        throw new Error(err.message || 'فشل الاتصال');
    }
}

// ═══════════ تحميل من فيسبوك ═══════════
async function downloadFacebook(url) {
    try {
        let params = new URLSearchParams({ url });
        let res = await fetch(`${API_BASE}/download/facebook?${params.toString()}`);
        let data = await res.json();
        if (!data?.success) throw new Error(data?.error || 'فشل التحميل');
        return data.response;
    } catch (err) {
        throw new Error(err.message || 'فشل الاتصال');
    }
}

// ═══════════ تنسيق الأرقام ═══════════
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من وجود النص
    if (!text) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [رابط]
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [كلمة بحث]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} https://www.facebook.com/reel/xxx
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} anime edit
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    // 2. رسالة جاري البحث
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🔍 *جـاري الـبـحـث فـي فـيـسـبـوك...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let isUrl = text.includes('facebook.com') || text.includes('fb.com') || text.includes('fb.watch');

        // ═══════════ تحميل مباشر من رابط ═══════════
        if (isUrl) {
            let data = await downloadFacebook(text);
            if (!data) throw new Error('لم يتم العثور على فيديو');

            let videoUrl = data.hd || data.sd;
            if (videoUrl) {
                // حذف رسالة التحميل
                try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

                let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم الـتـحـمـيـل مـن فـيـسـبـوك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـنـوان: ${data.title?.substring(0, 80) || 'فيديو فيسبوك'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـجـودة: ${data.hd ? 'HD' : 'SD'}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                await conn.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption: msg
                }, { quoted: m });
            } else {
                throw new Error('لا يوجد رابط فيديو');
            }
        } 
        // ═══════════ بحث وإرسال أفضل النتائج ═══════════
        else {
            let results = await searchFacebook(text);
            if (results.length === 0) throw new Error('لا توجد نتائج');

            let topResults = results.slice(0, 5);

            // حذف رسالة التحميل
            try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

            // إرسال كل نتيجة
            for (let i = 0; i < topResults.length; i++) {
                let video = topResults[i];
                try {
                    let downloadData = await downloadFacebook(video.reelUrl);
                    let videoUrl = downloadData?.hd || downloadData?.sd;

                    if (videoUrl) {
                        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *نـتـيـجـة مـن فـيـسـبـوك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـتـخـدم: ${video.creator || 'مجهول'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـشـاهـدات: ${formatNumber(video.views)}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${video.reelUrl}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـتـيـجـة: ${i + 1} / ${topResults.length}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                        await conn.sendMessage(m.chat, {
                            video: { url: videoUrl },
                            caption: msg
                        }, { quoted: m });

                        if (i < topResults.length - 1) {
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        }

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-فيس]', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *خـطـأ:*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['فيس (رابط/بحث)'];
handler.tags = ['downloads'];
handler.command = /^(فيس|facebook|fb)$/i;
handler.limit = true;

export default handler;