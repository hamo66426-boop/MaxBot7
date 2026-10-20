let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let q = m.quoted || m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ضع (بالرد على صورة)*\n*│*\n\n🖼️ *رد على صورة لتغيير صورة البوت*`, m);
    }

    try {
        let media = await q.download();
        await conn.updateProfilePicture(conn.user.jid, media);
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تغيير صورة البوت بنجاح*

🖼️ *صورة جديدة للبوت*
👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, `❌ *حدث خطأ:* ${err.message}`, m);
    }
};

handler.help = ['ضع (بالرد على صورة)'];
handler.tags = ['owner'];
handler.command = /^(ضع|botpp|setpp)$/i;
handler.owner = true;

export default handler;