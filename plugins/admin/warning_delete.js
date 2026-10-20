// plugins/حذف-انذار.js - حذف إنذار ✅
let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    // 2. تحديد العضو المستهدف (منشن > رد > رقم)
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '');
        if (number.length >= 11 && number.length <= 13) {
            target = number + '@s.whatsapp.net';
        } else {
            return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح!*`, m);
        }
    }

    // 3. إذا لم يتم تحديد أي شخص
    if (!target) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_انذار @منشن
├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_انذار (بالرد على رسالة)
├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_انذار 2012xxxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);

    // 4. تجهيز نظام الإنذارات
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    if (!chat.warnings) chat.warnings = {};
    
    let userId = target.split('@')[0];
    let currentWarn = chat.warnings[userId] || 0;

    // 5. لو العضو ليس لديه إنذارات
    if (currentWarn === 0) {
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *لا يـوجـد إنـذارات*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${userId}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الإنـذارات: 0
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *الـعـضـو ده مـفـيـش عـلـيـه إنـذارات*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        
        return conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [target, m.sender]
        }, { quoted: m });
    }

    // 6. حذف إنذار واحد
    let newWarn = currentWarn - 1;
    
    if (newWarn === 0) {
        delete chat.warnings[userId];
    } else {
        chat.warnings[userId] = newWarn;
    }

    // 7. رسالة تأكيد الحذف
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم حـذف إنـذار واحـد*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${userId}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإنـذارات الـمـتـبـقـيـة: ${newWarn}/3
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ ${newWarn === 0 ? '👑 *تـم مـسـح كـل الإنـذارات!*' : '🩸 *لـسـه عـلـيـه إنـذارات، خـلـي بـالـك!*'}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [target, m.sender]
    }, { quoted: m });
};

handler.help = ['حذف_انذار @منشن', 'حذف_انذار (بالرد)'];
handler.tags = ['admin'];
handler.command = /^(حذف_انذار|حذف_الانذار|مسح_انذار)$/i;
handler.group = true;
handler.admin = true;

export default handler;