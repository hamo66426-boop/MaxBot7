let handler = async (m, { conn, text, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ فولو [رابط القناة]*\n*│*\n\n*📌 مثال:*\n.فولو https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435`, m);

    let urlParts = text.trim().split("/");
    let channelInvite = urlParts[urlParts.length - 1];
    if (!channelInvite) return conn.reply(m.chat, '❌ *الرابط غير صحيح!*', m);

    // رسالة جاري المعالجة
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري عمل فولو للقناة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let metadata = await conn.newsletterMetadata("invite", channelInvite);
        let channelJid = metadata.id;
        
        // عمل فولو بالقناة
        await conn.newsletterFollow(channelJid);

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم عمل فولو للقناة بنجاح*

📢 *القناة:* ${metadata.thread_metadata?.name?.text || 'غير معروف'}
👥 *المشتركين:* ${metadata.thread_metadata?.subscribers_count || '0'}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[فولو] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *فشل عمل فولو للقناة!*', m);
    }
};

handler.help = ['فولو (رابط القناة)'];
handler.tags = ['owner'];
handler.command = /^(فولو|follow)$/i;
handler.owner = true;

export default handler;