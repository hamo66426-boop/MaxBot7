// plugins/مخفي.js - منشن للجميع 📢
let handler = async (m, { conn, text, isAdmin, isOwner, groupMetadata }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);

    try {
        // 2. جلب المشاركين في المجموعة
        let group = groupMetadata || await conn.groupMetadata(m.chat);
        let participants = group.participants.map(v => v.id);

        // 3. لو مفيش رسالة مقتبسة، نبعت رسالة عادية بمنشن للكل
        if (!m.quoted) {
            let customText = text ? text : "ﷺ صلي على النبي محمد ﷺ";
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *مـنـشـن لـلـجـمـيـع*
│
│ ❄️ ═══════════════ ❄️
│
│ ${customText}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            return await conn.sendMessage(m.chat, { 
                text: msg, 
                mentions: participants 
            }, { quoted: m });
        }

        // 4. لو فيه رسالة مقتبسة - الطريقة الأولى: التوجيه المباشر عبر fakeObj
        let q = m.quoted;
        
        if (q.fakeObj) {
            return await conn.copyNForward(m.chat, q.fakeObj, true, { 
                mentions: participants, 
                quoted: m 
            });
        }

        // الطريقة الثانية: التوجيه بالهيكل المباشر للرسالة
        if (q.message) {
            return await conn.sendMessage(m.chat, {
                forward: {
                    key: {
                        remoteJid: m.chat,
                        fromMe: q.fromMe,
                        id: q.id,
                        participant: q.sender
                    },
                    message: q.message
                },
                mentions: participants
            }, { quoted: m });
        }

        // الطريقة الثالثة (الاحتياطية): إعادة إرسال المحتوى بشكل مباشر (نص أو ميديا)
        if (q.text) {
            await conn.sendMessage(m.chat, { text: q.text, mentions: participants }, { quoted: m });
        } else if (q.download) {
            let media = await q.download();
            let type = q.mtype.replace('Message', '');
            await conn.sendMessage(m.chat, { 
                [type]: media, 
                caption: q.text || '', 
                mentions: participants 
            }, { quoted: m });
        }

    } catch (err) {
        console.error('Hidetag Error:', err);
        
        // محاولة سريعة أخيرة في حال حدوث استثناء غير متوقع
        try {
            let group = groupMetadata || await conn.groupMetadata(m.chat);
            let participants = group.participants.map(v => v.id);
            if (m.quoted && m.quoted.text) {
                await conn.sendMessage(m.chat, { text: m.quoted.text, mentions: participants }, { quoted: m });
            }
        } catch (e) {
            conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـدث خـطـأ أثـنـاء تـنـفـيـذ الـمـنـشـن!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
        }
    }
}

handler.help = ['مخفي (نص)', 'مخفي (بالرد)'];
handler.tags = ['admin'];
handler.command = /^(مخفي|منشن_للجميع|h|all)$/i;
handler.group = true;
handler.admin = true;

export default handler;