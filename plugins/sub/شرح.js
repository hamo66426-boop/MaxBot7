let handler = async (m, { conn }) => {
    let videoUrl = 'https://files.catbox.moe/oo4ptw.mp4';

    let caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎥 *شـرح تـنـصـيـب الـبـوت الـفـرعـي*

📝 *دليل فيديو يوضح طريقة التنصيب بالتفصيل*

💡 *لبدء التنصيب اكتب:* .تنصيب

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        video: { url: videoUrl },
        caption: caption
    }, { quoted: m });
};

handler.help = ['شرح'];
handler.tags = ['subbot'];
handler.command = /^(شرح)$/i;

export default handler;