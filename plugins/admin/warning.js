// plugins/انذار.js - إنذار / تحذير ⚠️
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
├ׁ̟̇˚₊· ͟͟͞͞➳❥ انذار @منشن
├ׁ̟̇˚₊· ͟͟͞͞➳❥ انذار (بالرد على رسالة)
├ׁ̟̇˚₊· ͟͟͞͞➳❥ انذار 2012xxxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);

    // 4. تجهيز نظام الإنذارات
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    if (!chat.warnings) chat.warnings = {};
    
    let userId = target.split('@')[0];
    chat.warnings[userId] = (chat.warnings[userId] || 0) + 1;
    let warnCount = chat.warnings[userId];

    // 5. إرسال رسالة الإنذار
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم إعـطـاء إنـذار*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${userId}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الإنـذارات: ${warnCount}/3
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ ${warnCount >= 3 ? '🩸 *وصـلـت لـلـحـد الأقـصـى مـن الإنـذارات!*' : '❄️ *خـلـي بـالـك مـن الـقـوانـيـن!*'}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [target, m.sender]
    }, { quoted: m });
};

// 6. الطرد التلقائي بعد 3 إنذارات
handler.before = async function (m, { conn, isAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return;
    
    // ✅ إصلاح: نتجاهل المشرفين والمطورين
    if (isAdmin || isOwner || isROwner) return;
    
    // ✅ إصلاح: نتأكد من وجود البيانات قبل استخدامها
    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat?.warnings) return;
    
    let userId = m.sender.split('@')[0];
    if (!chat.warnings[userId]) return;
    
    if (chat.warnings[userId] >= 3) {
        try {
            // طرد العضو
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            
            // حذف إنذاراته
            delete chat.warnings[userId];
        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-انذار] خطأ في الطرد:', e.message);
        }
        
        return true; // يمنع تنفيذ باقي الأوامر
    }
    
    return false;
};

handler.help = ['انذار @منشن', 'انذار (بالرد)'];
handler.tags = ['admin'];
handler.command = /^(انذار|تحذير|warn)$/i;
handler.group = true;
handler.admin = true;

export default handler;