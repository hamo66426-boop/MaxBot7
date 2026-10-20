// plugins/رادار.js - رادار مراقبة السبام 🔭
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

const SPAM_LIMIT = 4;
const SPAM_WINDOW = 4000;
const WARN_COOLDOWN = 15000;

// نظام تتبع السبام
let msgTracker = new Map();

setInterval(() => {
    let now = Date.now();
    for (let [key, data] of msgTracker.entries()) {
        if (now - data.firstTime > WARN_COOLDOWN * 2) {
            msgTracker.delete(key);
        }
    }
}, 5 * 60 * 1000);

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *هـذا الأمـر لـلـمـجـمـوعـات فـقـط!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);

    // ✅ إصلاح: تحقق من وجود chat
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    if (!chat.antiSpam) chat.antiSpam = false;

    let subCmd = args[0]?.toLowerCase();

    // ═══════════ القائمة الرئيسية بأزرار ButtonV2 ═══════════
    if (!subCmd) {
        let status = chat.antiSpam ? '✅ *مـفـعـل*' : '❌ *مـعـطـل*';
        
        let menuText = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *إعـدادات رادار الـمـراقـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: ${status}
│
│ ❄️ *الـخـيـارات الـمـتـاحـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .رادار تشغيل
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .رادار ايقاف
│
│ 🩸 *عـنـد الـتـفـعـيـل: يـرصـد الـسـبـام ويـطـرد الـمـزعـجـيـن*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        const imageUrl = 'https://files.catbox.moe/kahw8j.jpg'

        try {
            await new ButtonV2(conn)
                .setBody(menuText)
                .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
                .setThumbnail(imageUrl)
                .addRawButton({
                    buttonText: { displayText: '🔭 خـيـارات الـرادار' },
                    buttonId: 'radar_menu',
                    type: 1,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'خـيـارات الـرادار',
                            sections: [{
                                title: '🔭 خـيـارات الـرادار',
                                rows: [
                                    { title: '🔭 تشغيل الرادار', description: 'تفعيل رادار السبام والطرد', id: '.رادار تشغيل' },
                                    { title: '✅ إيقاف الرادار', description: 'إيقاف حماية الرادار', id: '.رادار ايقاف' }
                                ]
                            }]
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

        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-رادار] خطأ في إرسال القائمة:', e);
            await conn.reply(m.chat, menuText, m);
        }
        return;
    }

    // ═══════════ تفعيل الرادار ═══════════
    if (subCmd === 'تشغيل' || subCmd === 'تفعيل') {
        chat.antiSpam = true;
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـفـعـيـل رادار الـمـراقـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـمـايـة: نـشـطـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـد: ${SPAM_LIMIT} رسـائـل فـي ${SPAM_WINDOW/1000} ثـوانـي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        return conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
    }

    // ═══════════ إيقاف الرادار ═══════════
    if (subCmd === 'ايقاف' || subCmd === 'قفل' || subCmd === 'تعطيل') {
        chat.antiSpam = false;
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم إيـقـاف رادار الـمـراقـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـمـايـة: مـعـطـلـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        return conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
    }
};

// ═══════════ نظام كشف السبام التلقائي ═══════════
handler.before = async function (m, { conn, isBotAdmin, isAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return false;
    if (m.key?.fromMe) return false;
    if (isAdmin || isOwner || isROwner) return false;

    // ✅ إصلاح: وصول آمن للبيانات
    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat?.antiSpam) return false;

    let key = `${m.chat}:${m.sender}`;
    let senderNum = m.sender.split('@')[0];
    let now = Date.now();

    let data = msgTracker.get(key);

    if (!data) {
        msgTracker.set(key, { count: 1, firstTime: now, warned: false, warnedAt: 0 });
        return false;
    }

    if (now - data.firstTime > SPAM_WINDOW) {
        data.count = 1;
        data.firstTime = now;
        return false;
    }

    data.count++;

    // ═══════════ تحذير أول ═══════════
    if (data.count >= SPAM_LIMIT && !data.warned) {
        data.warned = true;
        data.warnedAt = now;
        
        try {
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *رادار الـمـراقـبـة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم رصـدك كـسـبـام!
│
│ 🩸 *تـحـذيـر أول - انـتـبـه أو هـتـتـطـرد!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            await conn.sendMessage(m.chat, { 
                text: msg,
                mentions: [m.sender]
            });
        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-رادار warn]', e?.message);
        }
        return false;
    }

    // ═══════════ طرد بعد التحذير ═══════════
    if (data.warned && data.count > SPAM_LIMIT) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });

            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *رادار الـمـراقـبـة - طـرد*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${senderNum}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم طـردك بـسـبـب اسـتـمـرار الـسـبـام!
│
│ 🩸 *تـجـاهـلـت تـحـذيـر الـرادار!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            await conn.sendMessage(m.chat, { 
                text: msg,
                mentions: [m.sender]
            });

            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            msgTracker.delete(key);
        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-رادار kick]', e?.message);
        }
    }

    return false;
};

handler.help = ['رادار', 'رادار تشغيل', 'رادار ايقاف'];
handler.tags = ['admin'];
handler.command = /^(رادار|ردار)$/i;
handler.group = true;
handler.admin = true;

export default handler;