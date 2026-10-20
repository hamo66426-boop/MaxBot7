let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطور الأساسي فقط!*', m);

    // تحديد العضو المستهدف
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (m.text) {
        let number = m.text.replace(/[^0-9]/g, '');
        if (number.length >= 11 && number.length <= 13) {
            target = number + '@s.whatsapp.net';
        } else {
            return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح!*`, m);
        }
    }

    if (!target) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ضيف_مطور @منشن*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ضيف_مطور (بالرد)*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ضيف_مطور 2012xxxx*\n*│*`, m);

    let number = target.split('@')[0];
    
    // إضافة المطور للقائمة
    if (!global.owner) global.owner = [];
    
    if (global.owner.includes(number)) {
        return conn.reply(m.chat, `⚠️ *@${number} مطور بالفعل!*`, m, { mentions: [target] });
    }
    
    global.owner.push(number);

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📂 *تم إضافة مطور جديد*

👤 *المطور الجديد:* @${number}
👑 *بواسطة:* @${m.sender.split('@')[0]}

✅ *تمت الإضافة بنجاح*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [target, m.sender]
    }, { quoted: m });
};

handler.help = ['ضيف_مطور', 'اضافه_مطور'];
handler.tags = ['owner'];
handler.command = /^(ضيف_مطور|اضافه_مطور)$/i;
handler.rowner = true;

export default handler;