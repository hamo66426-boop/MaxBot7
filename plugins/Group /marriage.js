let handler = async (m, { conn, groupMetadata }) => {
    let participants = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
    let jids = participants.map(p => p.id);

    if (jids.length < 2) {
        return conn.reply(m.chat, '⚠️ *المجموعة صغيرة جداً!*', m);
    }

    let index1 = Math.floor(Math.random() * jids.length);
    let index2;

    do {
        index2 = Math.floor(Math.random() * jids.length);
    } while (index2 === index1 && jids.length > 1);

    let user1 = jids[index1];
    let user2 = jids[index2];

    let love1 = Math.floor(Math.random() * 100) + 1;
    let love2 = Math.floor(Math.random() * 100) + 1;

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
💒 *مـحـكـمـة الـزواج* 💒

🤵🏻 *العريس:* @${user1.split('@')[0]}
❤️ *نسبة حبه للعروسة:* ${love1}%

👰🏻‍♀️ *العروسة:* @${user2.split('@')[0]}
💕 *نسبة حبها للعريس:* ${love2}%

${love1 > 70 && love2 > 70 ? '🥳 *مبروك الزواج! حب متبادل!*' : 
  love1 > 50 || love2 > 50 ? '😊 *فيه أمل في الجواز!' : 
  '😅 *الزواج نصيب!*'}

🎉 *الف مبروك للعروسين!*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [user1, user2] 
    }, { quoted: m });
};

handler.help = ['زواج'];
handler.tags = ['fun'];
handler.command = /^(زواج|جواز)$/i;
handler.group = true;

export default handler;