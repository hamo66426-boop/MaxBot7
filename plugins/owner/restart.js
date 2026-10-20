let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🔄 *جاري إعادة تشغيل البوت...*

♡゙ *Bot is restarting...*

⏳ *سيتم إعادة التشغيل خلال 3 ثواني*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                title: "𝑴𝑨𝑿 𝑩𝑶𝑻 👑",
                body: "جاري إعادة تشغيل البوت...",
                thumbnailUrl: "https://files.catbox.moe/qeqajh.jpg",
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    // إعادة تشغيل البوت
    setTimeout(() => {
        process.exit();
    }, 3000);
};

handler.help = ['رستارت', 'restart'];
handler.tags = ['owner'];
handler.command = /^(رستارت|restart|اعاده_تشغيل)$/i;
handler.owner = true;

export default handler;