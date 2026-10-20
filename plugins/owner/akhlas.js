let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

    try {
        // تغيير اسم المجموعة
        await conn.groupUpdateSubject(m.chat, 'تم سحب الجروب بواسطه (𝑴𝑨𝑿 𝑩𝑶𝑻)');

        // تغيير الوصف
        let newDescription = `لو عاوز تعمل كده تعال هنا\nجروب تنصيب بوت تعالو\nhttps://chat.whatsapp.com/IvJYpdrv5HG01SzWCEyY2l\n\nتابع قناة 𝑴𝑨𝑿 𝑩𝑶𝑻 في واتساب: https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435`;
        await conn.groupUpdateDescription(m.chat, newDescription);

        // تغيير صورة المجموعة
        await conn.updateProfilePicture(m.chat, { url: 'https://files.catbox.moe/kahw8j.jpg' });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم سحب الجروب بنجاح*

📝 *الاسم:* تم تغييره
📋 *الوصف:* تم تحديثه
🖼️ *الصورة:* تم تغييرها

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[اخلص] error:', err.message);
        conn.reply(m.chat, '❌ *حدث خطأ أثناء تعديل البيانات، تأكد من صلاحيات البوت.*', m);
    }
};

handler.help = ['اخلص'];
handler.tags = ['owner'];
handler.command = /^(اخلص)$/i;
handler.group = true;
handler.owner = true;

export default handler;