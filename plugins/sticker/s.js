import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn }) => {
    if (!m.quoted) return conn.reply(m.chat, '*[❗] يرجى الرد على صورة أو فيديو لتحويله إلى ملصق!*', m);
    
    let q = m.quoted;
    let mime = (q.msg || q).mimetype || '';
    
    if (!/image|video/.test(mime)) {
        return conn.reply(m.chat, '❌ *يرجى الرد على صورة أو فيديو فقط!*', m);
    }

    try {
        let media = await q.download();
        
        // إنشاء الملصق باستخدام wa-sticker-formatter
        let sticker = new Sticker(media, {
            pack: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
            author: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
            type: 'full',
            quality: 50
        });
        
        let buffer = await sticker.toBuffer();
        
        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

    } catch (err) {
        console.error('[ملصق] error:', err.message);
        conn.reply(m.chat, '❌ *فشل تحويل الصورة إلى ملصق!*', m);
    }
};

handler.help = ['ملصق (بالرد على صورة/فيديو)'];
handler.tags = ['sticker'];
handler.command = /^(ملصق|s|sticker)$/i;

export default handler;