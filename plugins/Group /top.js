let handler = async (m, { conn, args, groupMetadata }) => {
    let participants = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
    let jids = participants.map(p => p.id);

    if (jids.length < 2) {
        return conn.reply(m.chat, '⚠️ *المجموعة صغيرة جداً!*', m);
    }

    let shuffledJids = [...jids].sort(() => Math.random() - 0.5);
    let topUsers = shuffledJids.slice(0, Math.min(10, jids.length));

    let title = args.join(' ') || 'الاعضاء';
    let emojis = ["😂", "🤬", "🙂", "😎"];
    let em = emojis[Math.floor(Math.random() * emojis.length)];
    
    let messageText = `${em} *توب 10 ${title} ${em}*\n\n`;

    topUsers.forEach((user, index) => {
        let percentage;
        if (index === 0) {
            percentage = Math.floor(Math.random() * 15) + 90;
        } else if (index === 1) {
            percentage = Math.floor(Math.random() * 15) + 80;
        } else if (index === 2) {
            percentage = Math.floor(Math.random() * 15) + 70;
        } else if (index === 3) {
            percentage = Math.floor(Math.random() * 15) + 60;
        } else if (index === 4) {
            percentage = Math.floor(Math.random() * 15) + 50;
        } else {
            percentage = Math.floor(Math.random() * 40) + 30;
        }
        
        let medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
        messageText += `${medal} *${index + 1}.* @${user.split('@')[0]} - *${percentage}%*\n`;
    });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
${messageText.trim()}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: topUsers 
    }, { quoted: m });
};

handler.help = ['توب (نوع)'];
handler.tags = ['fun'];
handler.command = /^(توب|top)$/i;
handler.group = true;

export default handler;