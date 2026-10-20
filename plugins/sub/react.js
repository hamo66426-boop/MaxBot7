let handler = async (m, { conn, text, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ رياكت [رابط الرسالة] | [إيموجي]*\n*│*\n\n*📌 مثال:*\n.رياكت https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435/1050 | 🌹`, m);

    let [rawUrl, emoji] = text.split("|").map(s => s.trim());
    if (!emoji) return conn.reply(m.chat, '❌ *يرجى تحديد الإيموجي بعد الرابط بعلامة |*', m);

    let urlParts = rawUrl.split("/");
    let channelInvite = urlParts[urlParts.length - 2];
    let messageId = urlParts[urlParts.length - 1];

    if (!channelInvite || !messageId) return conn.reply(m.chat, '❌ *الرابط غير صحيح!*', m);

    // رسالة جاري المعالجة
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري إرسال الرياكت...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let metadata = await conn.newsletterMetadata("invite", channelInvite);
        let channelJid = metadata.id;
        
        // إرسال الرياكت
        await conn.newsletterReactMessage(channelJid, messageId, emoji);

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم إرسال الرياكت بنجاح*

${emoji} *الإيموجي:* ${emoji}
📢 *القناة:* ${metadata.thread_metadata?.name?.text || 'غير معروف'}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[رياكت] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *فشل إرسال الرياكت!*', m);
    }
};

handler.help = ['رياكت (رابط) | (إيموجي)'];
handler.tags = ['owner'];
handler.command = /^(رياكت|react)$/i;
handler.owner = true;

export default handler;