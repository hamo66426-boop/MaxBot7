let handler = async (m, { conn }) => {
    // إرسال الفيديو كرسالة عادية
    await conn.sendMessage(m.chat, {
        video: { url: "https://files.catbox.moe/ejsaxe.mp4" },
        caption: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
👑 *الـمـلـوك*

🎬 *فيديو خاص للملوك*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`,
        gifPlayback: false
    }, { quoted: m });
};

handler.help = ['الملوك'];
handler.tags = ['other'];
handler.command = /^(الملوك)$/i;

export default handler;