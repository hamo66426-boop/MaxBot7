let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
    
    // تحديد العضو المستهدف
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else {
        return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ لقب @منشن [اللقب]*\n*│*\n\n*📌 مثال:*\n.لقب @user الملك`, m);
    }
    
    // استخراج اللقب من النص (بعد المنشن)
    let parts = text.split(' ');
    parts.shift(); // حذف المنشن
    let nickname = parts.join(' ').trim();
    
    if (!nickname) return conn.reply(m.chat, '✏️ *اكتب اللقب بعد المنشن!*\n📌 *مثال:* .لقب @user الملك', m);
    
    // تجهيز قاعدة البيانات
    let chat = global.db.data.chats[m.chat];
    if (!chat.nicknames) chat.nicknames = {};
    
    // التحقق من أن اللقب مش محجوز لحد تاني
    let existingNick = Object.entries(chat.nicknames).find(([jid, nick]) => 
        nick === nickname && jid !== target
    );
    
    if (existingNick) return conn.reply(m.chat, `🪾 *اللقب "${nickname}" محجوز بالفعل!*`, m);
    
    // حفظ اللقب
    chat.nicknames[target] = nickname;
    
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تسجيل اللقب بنجاح*

👤 *العضو:* @${target.split('@')[0]}
🏷️ *اللقب:* ${nickname}
👑 *بواسطة:* @${m.sender.split('@')[0]}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
    
    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [target, m.sender] 
    }, { quoted: m });
};

handler.help = ['لقب @منشن (اللقب)'];
handler.tags = ['group'];
handler.command = /^(لقب)$/i;
handler.group = true;
handler.admin = true;

export default handler;