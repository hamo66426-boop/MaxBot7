import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [كلمة البحث]*\n*│*\n\n*📌 مثال:*\n${usedPrefix + command} اغنية حزينة`, m);

    // رسالة جاري البحث
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري البحث في YouTube عن "${text}"...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        // استخدام API للبحث في يوتيوب
        let apiUrl = `https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`;
        let res = await fetch(apiUrl);
        let json = await res.json();
        let videos = json.data || [];

        if (!videos.length) {
            await conn.sendMessage(m.chat, { delete: loadingMsg.key });
            return conn.reply(m.chat, `❌ *لم يتم العثور على نتائج لـ "${text}"*`, m);
        }

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        // عرض أول 5 نتائج
        for (let i = 0; i < Math.min(videos.length, 5); i++) {
            let video = videos[i];
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎬 *نتائج البحث في YouTube*

📝 *العنوان:* ${video.title || 'بدون عنوان'}
👤 *القناة:* ${video.author || video.channel || 'غير معروف'}
⏱️ *المدة:* ${video.timestamp || video.duration || 'غير معروف'}
👁️ *المشاهدات:* ${video.views?.toLocaleString() || 'غير معروف'}
📅 *النشر:* ${video.ago || video.uploaded || 'غير معروف'}
🔗 *الرابط:* ${video.url || video.link}

📊 *${i + 1}/${Math.min(videos.length, 5)}*

💡 *للتحميل استخدم الأمر المناسب*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            await conn.sendMessage(m.chat, { 
                image: { url: video.thumbnail || 'https://files.catbox.moe/p6jm0g.jpg' },
                caption: msg 
            }, { quoted: m });

            if (i < Math.min(videos.length, 5) - 1) {
                await new Promise(r => setTimeout(r, 1500));
            }
        }

    } catch (err) {
        console.error('[يوتيوب] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *حدث خطأ في البحث!*', m);
    }
};

handler.help = ['يوتيوب (كلمة بحث)'];
handler.tags = ['search'];
handler.command = /^(يوتيوب|youtube|yt)$/i;

export default handler;