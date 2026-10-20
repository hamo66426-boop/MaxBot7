let handler = async (m, { conn, command, groupMetadata }) => {
    let participants = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
    let jids = participants.map(p => p.id);

    if (jids.length < 2) {
        return conn.reply(m.chat, '⚠️ *المجموعة صغيرة جداً!*', m);
    }

    let randomIndex = Math.floor(Math.random() * jids.length);
    let randomUser = jids[randomIndex];
    let percentage = Math.floor(Math.random() * 100) + 1;

    let responseText = "";
    let emoji = "";

    switch (command) {
        case "بيحبني":
            emoji = "❤️";
            responseText = `❤️ *اكتر واحد بيحبك يا جميل*

👤 *الشخص:* @${randomUser.split('@')[0]}
💕 *نسبة حبه ليك:* ${percentage}%

${percentage > 70 ? '😍 *ده بيموت فيك!*' : percentage > 40 ? '🥰 *فيه حب في الهوا!*' : '😅 *الحب نصيب!*'}`;
            break;
            
        case "بيكرهني":
            emoji = "😡";
            responseText = `😡 *اكتر واحد بيكرهك*

👤 *الشخص:* @${randomUser.split('@')[0]}
🌚 *نسبة كرهه ليك:* ${percentage}%

${percentage > 70 ? '💀 *ده بيكرهك جداً!*' : percentage > 40 ? '😒 *فيه حاجة في قلبه!*' : '😅 *الكره مش كبير!*'}`;
            break;
            
        case "بيكراش":
            emoji = "💘";
            responseText = `💘 *اكتشفت مين معجب فيك*

👤 *الشخص:* @${randomUser.split('@')[0]}
😍 *نسبة اعجابه بيك:* ${percentage}%

${percentage > 70 ? '🔥 *ده متيم بيك!*' : percentage > 40 ? '😊 *عنده اعجاب حلو!*' : '🤔 *الاعجاب لسه صغير!*'}`;
            break;
            
        default:
            return;
    }

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
${responseText}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [randomUser] 
    }, { quoted: m });
};

handler.help = ['بيحبني', 'بيكرهني', 'بيكراش'];
handler.tags = ['group'];
handler.command = /^(بيحبني|بيكرهني|بيكراش)$/i;
handler.group = true;

export default handler;