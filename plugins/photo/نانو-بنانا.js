import axios from 'axios';
import FormData from 'form-data';

global.bananaSession = global.bananaSession || {};

async function uploadMedia(m) {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!/image|sticker/.test(mime)) return null;

        let media = await q.download();
        let form = new FormData();
        form.append('file', media, { filename: 'image.jpg' });
        form.append('type', 'permanent');

        let res = await axios.post(
            'https://tmp.malvryx.dev/upload',
            form,
            { headers: form.getHeaders() }
        );

        return res.data?.cdnUrl || res.data?.directUrl || null;
    } catch (e) {
        return null;
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let userId = m.sender;
    let isNanoPro = /نانو-بنانا|نانوبنانا/i.test(command);
    let prompt = text || '';

    // --- النظام الأول: وضع تجميع الصور ---
    if (isNanoPro) {
        if (!global.bananaSession[userId]) global.bananaSession[userId] = { images: [] };

        if (text?.toLowerCase().startsWith('تم')) {
            let session = global.bananaSession[userId];
            let finalPrompt = text.replace(/تم/i, '').trim();

            if (session.images.length < 2) return conn.reply(m.chat, '⚠️ *نانـو بنـانا برو*\n\nيرجى إضافة صورتين أو ملصقين على الأقل.', m);
            if (!finalPrompt) return conn.reply(m.chat, `⚠️ *الاستخدام:* ${usedPrefix + command} تم <وصف التعديل>`, m);

            // رسالة جاري المعالجة
            let loadingMsg = await conn.sendMessage(m.chat, { 
                text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري معالجة الصور...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
            }, { quoted: m });

            try {
                let apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/nanobana-pro-v3?prompt=${encodeURIComponent(finalPrompt)}`;
                session.images.forEach((url, i) => { 
                    apiUrl += `&image${i + 1}=${encodeURIComponent(url)}`; 
                });

                let { data: initRes } = await axios.get(apiUrl);
                if (!initRes.success) throw new Error('فشل بدء المهمة.');

                let resultUrl = null;
                let attempts = 0;
                while (!resultUrl && attempts < 25) {
                    await new Promise(r => setTimeout(r, 5000));
                    let { data: check } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${initRes.task_id}`);
                    if (check.status === 'completed' && check.image_url) {
                        resultUrl = check.image_url;
                        break;
                    }
                    attempts++;
                }

                if (!resultUrl) throw new Error('انتهى وقت الانتظار.');

                await conn.sendMessage(m.chat, { delete: loadingMsg.key });

                let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🍌 *نـانو بنـانا بـرو*

📝 *الـطلب:* ${finalPrompt}

✨ *تم التعديل بنجاح*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                await conn.sendMessage(m.chat, { 
                    image: { url: resultUrl }, 
                    caption: msg 
                }, { quoted: m });

                delete global.bananaSession[userId];
            } catch (e) {
                try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
                conn.reply(m.chat, `❌ *خطأ:* ${e.message}`, m);
                delete global.bananaSession[userId];
            }
            return;
        }

        let link = await uploadMedia(m);
        if (!link) return conn.reply(m.chat, `📸 *وضـع التجميع*\n\nقم بالرد على *صورة/ملصق* بـ *${usedPrefix + command}*\nأرسل *${usedPrefix + command} تم <الوصف>* عند الانتهاء.`, m);
        
        if (global.bananaSession[userId].images.length >= 4) return conn.reply(m.chat, '❌ *وصلت للحد الأقصى* (4 صور)', m);
        
        global.bananaSession[userId].images.push(link);
        return conn.reply(m.chat, `✅ *تم إضافة العنصر ${global.bananaSession[userId].images.length}/4*`, m);
    }

    // --- النظام الثاني: وضع التعديل المفرد ---
    if (command === 'نانو') {
        let imageUrl = await uploadMedia(m);
        
        if (imageUrl) {
            if (!prompt) return conn.reply(m.chat, `⚠️ *مطلوب تعليمات*\n\nمثال: قم بالرد على الصورة بـ \`${usedPrefix}نانو حولها لكرتون\``, m);
            
            let loadingMsg = await conn.sendMessage(m.chat, { 
                text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🎨 *جاري تعديل الصورة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
            }, { quoted: m });

            try {
                let { data: init } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`);
                let resultUrl = null;
                for (let i = 0; i < 20; i++) {
                    await new Promise(r => setTimeout(r, 5000));
                    let { data: check } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${init.task_id}`);
                    if (check.status === 'completed') { resultUrl = check.image_url; break; }
                }
                
                await conn.sendMessage(m.chat, { delete: loadingMsg.key });

                if (resultUrl) {
                    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✨ *تم التعديل بنجاح*

📝 *التعليمات:* ${prompt}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                    await conn.sendMessage(m.chat, { 
                        image: { url: resultUrl }, 
                        caption: msg 
                    }, { quoted: m });
                }
            } catch (e) {
                try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
                conn.reply(m.chat, '❌ *فشل التعديل.*', m);
            }
        } else {
            if (!prompt) return conn.reply(m.chat, `⚠️ *الاستخدام:* ${usedPrefix}نانو <وصف الصورة>`, m);
            
            let loadingMsg = await conn.sendMessage(m.chat, { 
                text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري إنشاء الصورة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
            }, { quoted: m });

            try {
                let { data } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=${encodeURIComponent(prompt)}`);
                
                await conn.sendMessage(m.chat, { delete: loadingMsg.key });

                if (data.image) {
                    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🍌 *نانـو بـرو*

📝 *الوصف:* ${prompt}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

                    await conn.sendMessage(m.chat, { 
                        image: { url: data.image }, 
                        caption: msg 
                    }, { quoted: m });
                }
            } catch (e) {
                try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
                conn.reply(m.chat, '❌ *فشل التوليد.*', m);
            }
        }
    }
};

handler.help = ['نانو', 'نانو-بنانا'];
handler.tags = ['images'];
handler.command = /^(نانو|نانو-بنانا|نانوبنانا)$/i;

export default handler;