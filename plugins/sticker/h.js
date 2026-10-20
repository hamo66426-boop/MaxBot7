import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args }) => {
    if (!m.quoted) return conn.reply(m.chat, '*[❗] يرجى الرد على ملصق لتغيير حقوقه!*', m);
    
    let [pack, author] = args.join(" ").split(" | ");
    
    if (!args.length) {
        return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ حقوق [اسم الباك] | [اسم المؤلف]*\n*│*\n\n*📌 مثال:*\n.حقوق 𝑴𝑨𝑿 𝑩𝑶𝑻 👑 | 2010`, m);
    }
    
    if (!pack) pack = "𝑴𝑨𝑿 𝑩𝑶𝑻 👑";
    if (author === undefined) author = null;
    
    let q = m.quoted;
    
    try {
        let media = await q.download();
        let mime = (q.msg || q).mimetype || '';
        
        // إنشاء ملصق جديد بالحقوق الجديدة
        let sticker = new Sticker(media, {
            pack: pack,
            author: author || '',
            type: 'full',
            quality: 50
        });
        
        let buffer = await sticker.toBuffer();

        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تغيير حقوق الملصق بنجاح*

📦 *الباك:* ${pack}
✍️ *المؤلف:* ${author || 'غير محدد'}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (err) {
        console.error('[حقوق] error:', err.message);
        conn.reply(m.chat, '❌ *حدث خطأ في تغيير الحقوق!*', m);
    }
};

handler.help = ['حقوق (باك) | (مؤلف)'];
handler.tags = ['sticker'];
handler.command = /^(حقوق|copyrigth)$/i;

export default handler;