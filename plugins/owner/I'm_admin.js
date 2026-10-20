let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

    try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
👑 *تـم الـرفـع أدمن*

👤 *المطور:* @${m.sender.split('@')[0]}
⭐ *أحلى مسا على مطوري الغالي*

✅ *الصلاحيات كلها معاك والجروب تحت أمرك*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[ارفعني] error:', err.message);
        conn.reply(m.chat, '❌ *البوت مش أدمن في المجموعة!*', m);
    }
};

handler.help = ['ارفعني'];
handler.tags = ['owner'];
handler.command = /^(ارفعني)$/i;
handler.group = true;
handler.owner = true;

export default handler;