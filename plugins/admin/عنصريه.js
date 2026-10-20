// plugins/عنصريه.js - طرد حسب كود الدولة 🌍
let handler = async (m, { conn, args, isAdmin, isOwner, groupMetadata }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
    if (!m.isGroup) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *هـذا الأمـر لـلـمـجـمـوعـات فـقـط!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);

    let countryCode = args.join('').replace(/[^0-9]/g, ''); 
    if (!countryCode) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عنصريه [كود الدولة]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .عنصريه 48
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);

    let groupMembers = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
    let usersToKick = [];
    let botId = conn.user.jid;

    // ✅ إصلاح: تسمية المتغير بطريقة واضحة عشان ميتعارضش مع isOwner
    for (let u of groupMembers) {
        let jid = u.jid || u.id || '';
        let number = jid.split('@')[0];

        if (number.startsWith(countryCode)) {
            let isSuperAdmin = u.admin === 'superadmin';
            if (jid !== botId && jid !== m.sender && !isSuperAdmin) {
                usersToKick.push(jid);
            }
        }
    }

    if (usersToKick.length === 0) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *مـلـقـتـش أرقـام تـبـدأ بـكـود (+${countryCode})*
│ 🩸 *فـي الـمـجـمـوعـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *جـاري طـرد ${usersToKick.length} رقـم...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    let successCount = 0;
    let failedCount = 0;

    for (let user of usersToKick) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        } catch (e) {
            failedCount++;
        }
    }

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم الـطـرد بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ كـود الـدولـة: +${countryCode}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم طـرد: ${successCount}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ فـشـل: ${failedCount}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [m.sender] 
    }, { quoted: m });
};

handler.help = ['عنصريه (كود الدولة)'];
handler.tags = ['admin'];
handler.command = /^(عنصريه|عنصرية)$/i;
handler.group = true;
handler.admin = true;

export default handler;