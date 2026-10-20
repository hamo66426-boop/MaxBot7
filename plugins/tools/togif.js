let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ لجيف (بالرد على فيديو)*\n*│*\n\n🎬 *حول الفيديو إلى GIF متحرك*`, m);

  try {
    let buffer = await m.quoted.download();
    
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تحويل الفيديو إلى GIF*

🎬 *GIF Playback*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
      video: buffer, 
      gifPlayback: true,
      caption: msg,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (err) {
    console.error('[لجيف] error:', err.message);
    conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
  }
};

handler.help = ['لجيف (بالرد على فيديو)'];
handler.tags = ['tools'];
handler.command = /^(لجيف|togif|لچيف)$/i;

export default handler;