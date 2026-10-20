// plugins/تجديد.js - تجديد رابط المجموعة 🔗
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

let handler = async (m, { conn, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    try {
        // 2. تجديد رابط المجموعة
        await conn.groupRevokeInvite(m.chat);
        let code = await conn.groupInviteCode(m.chat);
        let newLink = `https://chat.whatsapp.com/${code}`;

        // 3. رسالة التأكيد
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـجـديـد رابـط الـمـجـمـوعـة بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط الـجـديـد:
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${newLink}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 🩸 *تـم إلـغـاء الـرابـط الـقـديـم تـلـقـائـيـاً*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        // 4. إرسال الرسالة بأزرار ButtonV2
        const imageUrl = 'https://files.catbox.moe/qeqajh.jpg';

        try {
            await new ButtonV2(conn)
                .setBody(msg)
                .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
                .setThumbnail(imageUrl)
                .addRawButton({
                    buttonText: { displayText: '📋 اضـغـط لـنـسـخ الـرابـط' },
                    buttonId: 'copy_link',
                    type: 1,
                    nativeFlowInfo: {
                        name: 'cta_copy',
                        paramsJson: JSON.stringify({
                            display_text: '📋 اضـغـط لـنـسـخ الـرابـط',
                            copy_code: newLink
                        })
                    }
                })
                .addRawButton({
                    buttonText: { displayText: '📢 قـنـاة الـبـوت' },
                    buttonId: 'channel',
                    type: 2,
                    url: CHANNEL
                })
                .addButton('🤖 تـنـصـيـب وحـدة', '.تنصيب')
                .send(m.chat)

        } catch (btnError) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تجديد] خطأ في الأزرار:', btnError.message);
            
            // Fallback: إرسال نص عادي لو الأزرار فشلت
            await conn.sendMessage(m.chat, {
                text: msg,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: "تم تجديد رابط المجموعة",
                        body: "❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻",
                        thumbnailUrl: imageUrl,
                        sourceUrl: newLink,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });
        }

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تجديد]', err);
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ*
│ 🩸 *تـأكـد أن الـبـوت مـشـرف فـي الـمـجـمـوعـة!*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

handler.help = ['تجديد', 'تحديث_الرابط'];
handler.tags = ['admin'];
handler.command = /^(تجديد|تحديث_الرابط|رابط_جديد|revoke)$/i;
handler.group = true;
handler.admin = true;

export default handler;