import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [كلمة البحث أو رابط]*\n*│*\n\n*📌 مثال:*\n${usedPrefix + command} رقص\n${usedPrefix + command} https://vm.tiktok.com/xxxx`, m);

    let isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text);

    // رسالة جاري التحميل
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري البحث في TikTok...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        if (isUrl) {
            // تحميل من رابط
            let res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`);
            let json = await res.json();
            let data = json?.data;
            
            if (!data?.play && !data?.music) {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key });
                return conn.reply(m.chat, '❌ *الرابط غير صالح!*', m);
            }

            let { title, author, play } = data;

            await conn.sendMessage(m.chat, { delete: loadingMsg.key });

            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎬 *تـحـمـيـل تـيـك تـوك*

📝 *العنوان:* ${title || 'غير متوفر'}
👤 *المؤلف:* ${author?.nickname || 'غير متوفر'}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            await conn.sendMessage(m.chat, {
                video: { url: play },
                caption: msg
            }, { quoted: m });

        } else {
            // البحث عن فيديوهات
            let res = await fetch(`https://www.tikwm.com/api/feed/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `keywords=${encodeURIComponent(text)}&count=5&cursor=0&HD=1`
            });
            let json = await res.json();
            let results = json?.data?.videos?.filter(v => v.play) || [];

            if (!results.length) {
                await conn.sendMessage(m.chat, { delete: loadingMsg.key });
                return conn.reply(m.chat, `🔍 *لم يتم العثور على نتائج لـ "${text}"*`, m);
            }

            await conn.sendMessage(m.chat, { delete: loadingMsg.key });

            // إرسال النتائج
            for (let i = 0; i < Math.min(results.length, 5); i++) {
                let video = results[i];
                let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎬 *نتائج البحث في TikTok*

📝 *العنوان:* ${video.title || 'بدون عنوان'}
🔍 *البحث:* ${text}
📊 *${i + 1}/${Math.min(results.length, 5)}*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                await conn.sendMessage(m.chat, {
                    video: { url: video.play },
                    caption: msg
                }, { quoted: m });

                if (i < Math.min(results.length, 5) - 1) {
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
        }

    } catch (err) {
        console.error('[ايديت] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `❌ *حدث خطأ:* ${err.message}`, m);
    }
};

handler.help = ['ايديت (بحث/رابط)'];
handler.tags = ['search'];
handler.command = /^(ايديت)$/i;

export default handler;