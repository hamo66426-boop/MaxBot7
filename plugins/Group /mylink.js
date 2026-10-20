let handler = async (m, { conn }) => {
    let number = m.sender.split("@")[0];
    let link = `https://wa.me/${number}`;
    
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🔗 *رابط حسابك*

👤 *الرقم:* ${number}
🔗 *الرابط:* ${link}

💡 *شارك الرابط مع أصدقائك*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.help = ['رابطي'];
handler.tags = ['main'];
handler.command = /^(رابطي|linki|myLink)$/i;

export default handler;