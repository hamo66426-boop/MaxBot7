let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
    
    let chat = global.db.data.chats[m.chat];
    if (!chat?.nicknames || Object.keys(chat.nicknames).length === 0) {
        return conn.reply(m.chat, '❌ *لا يوجد ألقاب محفوظة!*', m);
    }
    
    let data = chat.nicknames;
    let jid, nick;
    
    // تحديد الهدف: منشن > رد > نص
    if (m.mentionedJid && m.mentionedJid[0]) {
        jid = m.mentionedJid[0];
        nick = data[jid];
        if (!nick) return conn.reply(m.chat, '❌ *هذا العضو ليس لديه لقب!*', m);
    } else if (m.quoted && m.quoted.sender) {
        jid = m.quoted.sender;
        nick = data[jid];
        if (!nick) return conn.reply(m.chat, '❌ *هذا العضو ليس لديه لقب!*', m);
    } else if (text) {
        // البحث عن اللقب بالنص
        let entry = Object.entries(data).find(([_, n]) => n === text.trim());
        if (entry) {
            [jid, nick] = entry;
        } else {
            return conn.reply(m.chat, `❌ *لم يتم العثور على لقب "${text.trim()}"!*`, m);
        }
    } else {
        return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_لقب @منشن*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_لقب (بالرد)*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_لقب [اللقب]*\n*│*`, m);
    }
    
    // حذف اللقب
    delete data[jid];
    
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🗑️ *تم حذف اللقب بنجاح*

${mentioned ? `👤 *العضو:* @${jid.split('@')[0]}` : `🏷️ *اللقب:* ${nick}`}

👑 *بواسطة:* @${m.sender.split('@')[0]}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
    
    let mentions = [m.sender];
    if (m.mentionedJid?.[0] || m.quoted?.sender) mentions.push(jid);
    
    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: mentions 
    }, { quoted: m });
};

handler.help = ['حذف_لقب @منشن', 'حذف_لقب (اللقب)'];
handler.tags = ['group'];
handler.command = /^(حذف_لقب|مسح_لقب)$/i;
handler.group = true;
handler.admin = true;

export default handler;