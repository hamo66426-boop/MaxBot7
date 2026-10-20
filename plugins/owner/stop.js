let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🛑 *جاري إيقاف البوت...*

♡゙ *Stop the bot...*

⏳ *سيتم الإيقاف خلال 3 ثواني*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                title: "𝑴𝑨𝑿 𝑩𝑶𝑻 👑",
                body: "جاري إيقاف البوت...",
                thumbnailUrl: "https://files.catbox.moe/kahw8j.jpg",
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    // إيقاف البوت
    setTimeout(() => {
        process.exit();
    }, 3000);
};

handler.help = ['ايقاف', 'stop'];
handler.tags = ['owner'];
handler.command = /^(ايقاف|stop|قف|shutdown)$/i;
handler.owner = true;

export default handler;