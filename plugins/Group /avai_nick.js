let handler = async (m, { text, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
    
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ متوفر [اللقب]*\n*│*\n\n*📌 مثال:*\n.متوفر الملك`, m);
    
    let chat = global.db.data.chats[m.chat];
    if (!chat?.nicknames) return conn.reply(m.chat, `🫯 *اللقب "${text.trim()}" متوفر*`, m);
    
    let exists = Object.values(chat.nicknames).includes(text.trim());
    
    let msg = exists 
        ? `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🍂 *اللقب "${text.trim()}" محجوز*\n\n😢 *جرب لقب تاني*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
        : `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🫯 *اللقب "${text.trim()}" متوفر*\n\n🎉 *تقدر تستخدمه!*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
    
    conn.reply(m.chat, msg, m);
};

handler.help = ['متوفر (لقب)'];
handler.tags = ['group'];
handler.command = /^(متوفر)$/i;
handler.group = true;
handler.admin = true;

export default handler;