let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
    
    let chat = global.db.data.chats[m.chat];
    if (!chat?.nicknames || Object.keys(chat.nicknames).length === 0) {
        return conn.reply(m.chat, '📭 *لا يوجد ألقاب مسجلة في المجموعة!*', m);
    }
    
    let data = chat.nicknames;
    let jids = Object.keys(data);
    let list = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📋 *الألقاب المسجلة في المجموعة*

`;
    let index = 1;
    for (let [jid, nick] of Object.entries(data)) {
        list += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${index}. 👤 @${jid.split('@')[0]} ➜ 🏷️ *${nick}*\n`;
        index++;
    }
    
    list += `\n📊 *عدد الألقاب:* ${jids.length}\n\n​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
    
    await conn.sendMessage(m.chat, { 
        text: list, 
        mentions: jids 
    }, { quoted: m });
};

handler.help = ['الألقاب'];
handler.tags = ['group'];
handler.command = /^(الألقاب|الالقاب|nicknames)$/i;
handler.group = true;
handler.admin = true;

export default handler;