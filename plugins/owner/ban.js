let handler = async (m, { conn, text, command, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    // تحديد العضو المستهدف (منشن > رد > رقم)
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '');
        if (number.length >= 11 && number.length <= 13) {
            target = number + '@s.whatsapp.net';
        } else {
            return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح!*`, m);
        }
    }

    if (!target) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} @منشن*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} (بالرد على رسالة)*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} 2012xxxx*\n*│*`, m);

    let user = global.db.data.users[target];
    let isUnban = /^(فك_حظر|الغاء_الحظر|فك_بان|انبان)$/i.test(command);

    if (isUnban) {
        user.banned = false;
        user.bannedReason = '';
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم فك الحظر بنجاح*

👤 *العضو:* @${target.split('@')[0]}
🔓 *الحالة:* غير محظور

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [target, m.sender] 
        }, { quoted: m });

    } else {
        user.banned = true;
        user.bannedReason = 'مخالفة القوانين';

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🚫 *تم الحظر بنجاح*

👤 *العضو:* @${target.split('@')[0]}
🔒 *الحالة:* محظور

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [target, m.sender] 
        }, { quoted: m });
    }
};

handler.help = ['حظر', 'فك_حظر'];
handler.tags = ['owner'];
handler.command = /^(حظر|بان|فك_حظر|الغاء_الحظر|فك_بان|انبان)$/i;
handler.owner = true;

export default handler;