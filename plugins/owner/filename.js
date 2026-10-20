import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn, isOwner, isROwner, groupMetadata }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

    try {
        // تغيير اسم المجموعة
        await conn.groupUpdateSubject(m.chat, 'مــــفـــشــــوخ | 👑 | 𝑴𝑨𝑿 𝑩𝑶𝑻');

        // تغيير الوصف
        await conn.groupUpdateDescription(m.chat, 'لو عاوز تجيب حققك تعال هنا \n𝑴𝑨𝑿 𝑩𝑶𝑻 👑\nhttps://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435');

        // تغيير صورة المجموعة
        let ppPath = './media/فشخ.jpg'; 
        let fallbackUrl = 'https://files.catbox.moe/p6jm0g.jpg';
        let ppBuffer;

        try {
            if (fs.existsSync(ppPath)) {
                ppBuffer = fs.readFileSync(ppPath);
            } else {
                let res = await fetch(fallbackUrl);
                ppBuffer = Buffer.from(await res.arrayBuffer());
            }
            await conn.updateProfilePicture(m.chat, ppBuffer);
        } catch (err) {
            console.log('⚠️ فشل تغيير صورة الجروب:', err.message);
        }

        await conn.reply(m.chat, 'تعالو هنا \nhttps://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435', m);
    } catch (err) {
        console.error('خطأ في تحديث بيانات الجروب:', err);
    }

    // طرد كل الأعضاء ما عدا الأدمنز والبوت والمطور
    let participants = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
    let admins = participants.filter(p => p.admin !== null).map(p => p.id);

    let users = participants.map(u => u.id).filter(v =>
        v !== conn.user.jid &&
        v !== m.sender &&
        !admins.includes(v)
    );

    if (users.length === 0) return conn.reply(m.chat, '👀 *بص تحت كدا! مفيش حد يتطرد 😂*', m);

    // رسالة جاري الفشخ
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⚡ *جاري الفشخ ${users.length} عضو...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        await conn.groupParticipantsUpdate(m.chat, users, 'remove');
        
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
💀 *تـم الـفـشـخ بـنـجـاح*

👥 *عدد المفشوخين:* ${users.length} عضو
👑 *بواسطة:* @${m.sender.split('@')[0]}

🖕🏻 *تم فشخ بارك!*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[فشخ] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *حدث خطأ أثناء الفشخ، تأكد من صلاحيات البوت!*', m);
    }
};

handler.help = ['فشخ'];
handler.tags = ['owner','admin'];
handler.command = /^(فشخ)$/i;
handler.group = true;
handler.admin = true;

export default handler;