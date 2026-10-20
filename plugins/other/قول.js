import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // تحديد النص: من النص جنب الأمر > من الرد على رسالة
    let say = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : null);
    
    if (!say) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [النص]*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} (بالرد على رسالة)*\n*│*\n\n*📌 مثال:*\n${usedPrefix + command} مرحبا بالجميع`, m);

    // رسالة جاري التحضير
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري تحويل النص إلى صوت...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(say)}&tl=ar&client=tw-ob`;
        
        let res = await fetch(url);
        let audioBuffer = Buffer.from(await res.arrayBuffer());

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `KING-BOT-TTS.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: "𝑴𝑨𝑿 𝑩𝑶𝑻 👑 | تحويل النص إلى صوت",
                    body: `النص: ${say.slice(0, 50)}${say.length > 50 ? '...' : ''}`,
                    thumbnailUrl: "https://files.catbox.moe/qeqajh.jpg",
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error('[قول] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *حدث خطأ في تحويل النص إلى صوت!*', m);
    }
};

handler.help = ['قول (نص)', 'نطق (نص)'];
handler.tags = ['misc'];
handler.command = /^(قول|نطق|tts|speak)$/i;

export default handler;