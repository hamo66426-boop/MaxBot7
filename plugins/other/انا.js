let handler = async (m, { conn }) => {
    let name = m.pushName || m.name || "مستخدم مجهول";
    let user = m.sender;
    let number = user.split('@')[0];
    let pp = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://files.catbox.moe/p6jm0g.jpg');

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
👤 *مـعـلـومـات الـمـسـتـخـدم*

📝 *الاسم:* ${name}
📱 *الرقم:* ${number}
🔗 *الرابط:* https://wa.me/${number}

💡 *استخدم .بروفايل للمزيد*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: msg 
    }, { quoted: m });
};

handler.help = ['انا', 'بروفايل'];
handler.tags = ['misc'];
handler.command = /^(انا|بروفايل|me|my)$/i;

export default handler;