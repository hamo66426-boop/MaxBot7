// plugins/قفل-فتح.js - قفل / فتح المجموعة 🔒
let handler = async (m, { conn, command, isAdmin, isOwner, groupMetadata }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    let users = groupMetadata?.participants?.map(u => u.id) || [];

    // تحويل LID لرقم حقيقي + جلب الاسم
    let senderJid = m.sender;
    try {
        const clean = await conn.convertLidToRealJid(m.sender, m.chat);
        if (clean) senderJid = clean;
    } catch {}

    let senderName = m.pushName || m.name || '';
    if (!senderName) {
        try {
            senderName = await conn.getName(senderJid);
        } catch {}
    }
    if (!senderName || senderName.includes('@')) senderName = 'العضو';

    try {
        if (command === "قفل") {
            await conn.groupSettingUpdate(m.chat, 'announcement');

            let msg = `*تم قفل البار 🥂`;

            await conn.sendMessage(m.chat, {
                text: msg,
                mentions: users
            }, { quoted: m });

        } else if (command === "فتح") {
            await conn.groupSettingUpdate(m.chat, 'not_announcement');

            let msg = `*تم فتح البار 🍻🥂`;

            await conn.sendMessage(m.chat, {
                text: msg,
                mentions: users
            }, { quoted: m });
        }

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل تـنـفـيـذ الأمـر*
│ 🩸 *تـأكـد أن الـبـوت مـشـرف!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
}

handler.help = ['قفل', 'فتح'];
handler.tags = ['admin'];
handler.command = /^(قفل|فتح)$/i;
handler.group = true;
handler.admin = true;

export default handler;