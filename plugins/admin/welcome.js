// plugins/ترحيب.js - التحكم في الترحيب ⚙️
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

let handler = async (m, { conn, text, args, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    // ✅ إصلاح: تحقق من وجود chat
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    let subCmd = args[0]?.toLowerCase();

    // 2. حذف الترحيب المخصص
    if (subCmd === 'حذف' || text === 'حذف' || text === 'الافتراضي') {
        if (!chat.customWelcome) {
            return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الـتـرحـيـب فـي هـذه الـمـجـمـوعـة*
│ 🩸 *هـو بـالـفـعـل الـتـرحـيـب الافـتـراضـي!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
        }
        delete chat.customWelcome;
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم حـذف الـتـرحـيـب الـمـخـصـص*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم الـرجـوع لـلـتـرحـيـب الافـتـراضـي
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

    // 3. شرح طريقة التعديل
    if (subCmd === 'تعديل' || text === 'تعديل') {
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *طـريـقـة تـعـديـل الـتـرحـيـب*
│
│ ❄️ ═══════════════ ❄️
│
│ ❄️ *اكـتـب الأمـر مـع الـنـص الـجـديـد:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .ترحيب نورت الجروب يا غالي
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 🩸 *مـلاحـظـة:* الـبـوت هـيـعـمـل مـنـشـن تـلـقـائـي لـلـعـضـو الـجـديـد
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        
        return conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });
    }

    // 4. حفظ الترحيب المخصص
    if (text && subCmd !== 'حذف' && subCmd !== 'تعديل') {
        chat.customWelcome = text;
        chat.welcome = true; // تفعيل الترحيب تلقائياً
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم حـفـظ الـتـرحـيـب الـمـخـصـص*
│
│ ❄️ ═══════════════ ❄️
│ ❄️ *الـنـص الـجـديـد:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${text}
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم تـفـعـيـل الـتـرحـيـب تـلـقـائـيـاً
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

    // 5. القائمة الرئيسية بأزرار ButtonV2
    let currentWelcome = chat.customWelcome 
        ? `📝 *الـتـرحـيـب الـحـالـي:*\n> ${chat.customWelcome}` 
        : `✨ *الـتـرحـيـب الافـتـراضـي لـلـبـوت*`;
    
    let status = chat.welcome ? '✅ *مـفـعـل*' : '❌ *مـعـطـل*';

    let menuText = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *لـوحـة تـحـكـم الـتـرحـيـب*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: ${status}
│
${currentWelcome}
│
│ ❄️ *الـخـيـارات الـمـتـاحـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .ترحيب [النص] - حفظ ترحيب جديد
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .ترحيب تعديل - شرح التعديل
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .ترحيب حذف - حذف المخصص
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    const imageUrl = 'https://files.catbox.moe/p6jm0g.jpg'

    try {
        await new ButtonV2(conn)
            .setBody(menuText)
            .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
            .setThumbnail(imageUrl)
            .addRawButton({
                buttonText: { displayText: '⚙️ خـيـارات الـتـرحـيـب' },
                buttonId: 'welcome_menu',
                type: 1,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '⚙️ خـيـارات الـتـرحـيـب',
                        sections: [{
                            title: '⚙️ خـيـارات الـتـرحـيـب',
                            rows: [
                                { title: '✏️ تعديل الترحيب', description: 'تغيير نص الترحيب الحالي', id: '.ترحيب تعديل' },
                                { title: '🗑️ حذف الترحيب المخصص', description: 'العودة للترحيب الافتراضي', id: '.ترحيب حذف' }
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
        console.error("[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-ترحيب] خطأ في إرسال القائمة:", e);
        await conn.reply(m.chat, menuText, m);
    }
};

handler.help = ['ترحيب', 'ترحيب تعديل', 'ترحيب حذف'];
handler.tags = ['admin'];
handler.command = /^(ترحيب|الترحيب)$/i;
handler.group = true;
handler.admin = true;

export default handler;