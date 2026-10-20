// plugins/اسبام.js - مضاد السبام 🛡️
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    // ✅ إصلاح: تحقق من وجود chat
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    if (!chat.antiSpam) chat.antiSpam = false;

    let subCmd = args[0]?.toLowerCase();

    // 2. القائمة الرئيسية بأزرار ButtonV2
    if (!subCmd) {
        let status = chat.antiSpam ? '✅ *مفعل*' : '❌ *معطل*';
        
        let menuText = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *إعـدادات مـضـاد الـسـبـام*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: ${status}
│
│ ❄️ *الـخـيـارات الـمـتـاحـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .اسبام تشغيل
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .اسبام ايقاف
│
│ 🩸 *عـنـد الـتـفـعـيـل: أي عـضـو يـرسـل 5 رسـائـل فـي 5 ثـوانـي يـتـم طـرده*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        const imageUrl = 'https://files.catbox.moe/kahw8j.jpg'

        try {
            await new ButtonV2(conn)
                .setBody(menuText)
                .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
                .setThumbnail(imageUrl)
                .addRawButton({
                    buttonText: { displayText: '🛡️ خـيـارات الـسـبـام' },
                    buttonId: 'antispam_menu',
                    type: 1,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'خـيـارات الـسـبـام',
                            sections: [{
                                title: '🛡️ خـيـارات مـضـاد الـسـبـام',
                                rows: [
                                    { title: '🚫 تشغيل مضاد السبام', description: 'طرد من يرسل رسائل متكررة', id: '.اسبام تشغيل' },
                                    { title: '✅ إيقاف مضاد السبام', description: 'إيقاف حماية السبام', id: '.اسبام ايقاف' }
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
            console.error("[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-اسبام] خطأ في إرسال القائمة:", e);
            await conn.reply(m.chat, menuText, m);
        }
        return;
    }

    // 3. تفعيل مضاد السبام
    if (subCmd === 'تشغيل' || subCmd === 'تفعيل') {
        chat.antiSpam = true;
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـفـعـيـل مـضـاد الـسـبـام*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـمـايـة: نـشـطـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـقـوبـة: طـرد فـوري
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـد: 5 رسـائـل فـي 5 ثـوانـي
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        return conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });
    }

    // 4. إيقاف مضاد السبام
    if (subCmd === 'ايقاف' || subCmd === 'قفل' || subCmd === 'تعطيل') {
        chat.antiSpam = false;
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم إيـقـاف مـضـاد الـسـبـام*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـمـايـة: مـعـطـلـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 🩸 *تـنـبـيـه: يـفـضـل تـفـعـيـلـهـا لـحـمـايـة الـمـجـمـوعـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        return conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });
    }
};

// 5. نظام تتبع السبام ومنعه
let spamTracker = {};

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return;
    if (isAdmin || isOwner || isROwner) return;
    
    // ✅ إصلاح: تحقق آمن من وجود البيانات
    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat?.antiSpam) return;
    if (!m.sender) return;

    let sender = m.sender;
    let now = Date.now();
    
    if (!spamTracker[sender]) {
        spamTracker[sender] = { count: 0, lastTime: now };
    }

    let userData = spamTracker[sender];
    let diff = now - userData.lastTime;

    // إعادة تعيين العداد بعد 5 ثواني
    if (diff > 5000) {
        userData.count = 1;
        userData.lastTime = now;
    } else {
        userData.count++;
    }

    // طرد العضو بعد 5 رسائل في أقل من 5 ثواني
    if (userData.count >= 5) {
        try {
            // حذف آخر رسالة
            await conn.sendMessage(m.chat, { delete: m.key });
            
            // إرسال تحذير
            let warnMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *مـمـنـوع الـسـبـام!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${sender.split('@')[0]}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـسـبـب: إرسـال رسـائـل مـتـكـررة
│
│ 🩸 *بـاي بـاي يـا نـرم!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
            
            await conn.sendMessage(m.chat, { 
                text: warnMsg,
                mentions: [sender]
            }, { quoted: m });
            
            // طرد العضو
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
            
            // مسح بيانات السبام للعضو
            delete spamTracker[sender];
        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-اسبام] خطأ في الطرد:', e.message);
        }
        
        return true; // منع تنفيذ باقي الأوامر
    }
};

handler.help = ['اسبام', 'اسبام تشغيل', 'اسبام ايقاف'];
handler.tags = ['admin'];
handler.command = /^(اسبام|سبام|مضاد_سبام)$/i;
handler.group = true;
handler.admin = true;

export default handler;