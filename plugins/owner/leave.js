let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
👋 *إلى اللقاء*

😢 *آسف جداً مضطر أخرج دلوقتي*
👑 *مطوري طلبني..*

💕 *هتوحشوني وأشوفكم على خير!*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });

    // خروج البوت من المجموعة
    await conn.groupLeave(m.chat);
};

handler.help = ['اخرج'];
handler.tags = ['owner'];
handler.command = /^(اخرج|غادر|leave)$/i;
handler.group = true;
handler.owner = true;

export default handler;