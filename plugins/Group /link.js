let handler = async (m, { conn }) => {
    try {
        let inviteCode = await conn.groupInviteCode(m.chat);
        let groupLink = "https://chat.whatsapp.com/" + inviteCode;
        let groupMetadata = await conn.groupMetadata(m.chat);

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🔗 *رابـط الـمـجـمـوعـة*

👑 *الاسم:* ${groupMetadata.subject}

🔗 *الرابط:*
${groupLink}

💡 *اضغط على الزر لنسخ الرابط*

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        // إرسال الرابط مع زر النسخ
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/p6jm0g.jpg" },
            caption: msg,
            footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
            interactiveButtons: [
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 اضغط لنسخ الرابط",
                        copy_code: groupLink
                    })
                }
            ]
        }, { quoted: m });

        // إرسال الرابط كرسالة منفصلة للنسخ السريع
        await conn.sendMessage(m.chat, { text: groupLink }, { quoted: m });

    } catch (err) {
        let mentionedUser = conn.user.jid;
        let errorMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
❌ *خطأ*

⚠️ *يجب تعيين البوت كمشرف لاستخدام هذا الأمر!*

👤 *البوت:* @${mentionedUser.split('@')[0]}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        
        conn.sendMessage(m.chat, { 
            text: errorMsg, 
            mentions: [mentionedUser]
        }, { quoted: m });
    }
};

handler.help = ['لينك (يجيب رابط دعوة المجموعة الحالية، بدون أي مدخلات)'];
handler.tags = ['group'];
handler.command = /^(لينك|link|رابط|الرابط)$/i;
handler.group = true;

export default handler;