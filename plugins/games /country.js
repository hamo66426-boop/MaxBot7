// plugins/علم.js - لعبة خمن العلم 🌍
import fetch from 'node-fetch';

// ═══════════ الإعدادات ═══════════
const CHANNEL_JID = '120363424844460135@newsletter'
const CHANNEL_NAME = '𝑴𝑨𝑿 𝑩𝑶𝑻'
const BOT_NAME = '𝑴𝑨𝑿 𝑩𝑶𝑻'
const FOOTER = '❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️'

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn }) => {
    if (!global.gameActive) global.gameActive = {};

    // إلغاء أي جولة نشطة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        let controller = new AbortController();
        let timeout = setTimeout(() => controller.abort(), 20000);
        
        // جلب بيانات الدول
        let res = await fetch("https://gist.githubusercontent.com/Kyutaka101/799d5646ceed992bf862026847473852/raw/dcbecff259b1d94615d7c48079ed1396ed42ef67/gistfile1.txt", { signal: controller.signal });
        let data = await res.json();
        let country = data[Math.floor(Math.random() * data.length)];

        clearTimeout(timeout);

        // ═══════════ رسالة البداية ═══════════
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *خـمـن الـعـلـم*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوقـت: 30 ثـانـيـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـجـائـزة: 100 XP + 🍪 2 كـوكـيـز
│
│ 👑 *رد عـلـى الـصـورة بـاسـم الـدولـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        let sent = await conn.sendMessage(m.chat, {
            image: { url: country.img },
            caption: msg
        }, { quoted: m });

        // ═══════════ بدء الجولة ═══════════
        global.gameActive[m.chat] = {
            answer: country.name.toLowerCase(),
            image: country.img,
            msgId: sent.key.id,
            timeout: setTimeout(async () => {
                if (global.gameActive[m.chat]) {
                    let answer = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    try {
                        await conn.reply(m.chat, `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ⏰ *انـتـهـى الـوقـت!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإجـابـة: ${answer}
│
│ 👑 *${BOT_NAME}*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
                    } catch (e) {}
                }
            }, 30000)
        };
    } catch (e) {
        console.error('[علم] error:', e.message);
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ فـي تـحـمـيـل الـلـعـبـة*
│ 🩸 حـاول تـانـي
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
};

// ═══════════ Handler.before (كشف الإجابة) ═══════════
handler.before = async function (m, { conn }) {
    if (!m.quoted || !m.text) return;
    if (!global.gameActive?.[m.chat]) return;
    
    let game = global.gameActive[m.chat];
    if (m.quoted.id !== game.msgId) return;
    
    // ═══════════ إجابة صحيحة ═══════════
    if (m.text.toLowerCase().trim() === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        
        // إضافة المكافأة
        let user = global.db.data.users[m.sender];
        if (user) {
            user.exp = (user.exp || 0) + 100;
            user.coin = (user.coin || 0) + 2;
        }
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *صـحـيـح! عـاش يـا بـطـل!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـجـائـزة: +100 XP + 🍪 2 كـوكـيـز
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإجـابـة: ${game.answer}
│
│ 👑 *اكـتـب .علم عـشـان تـلـعـب تـانـي*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        
        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: msg
        }, { quoted: m });
        return true;
    }
    
    // ═══════════ إجابة خاطئة ═══════════
    await m.reply(`   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *إجـابـة غـلـط! جـرب تـانـي*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);
    return true;
};

handler.help = ['علم'];
handler.tags = ['games'];
handler.command = /^(علم|country|flag)$/i;

export default handler;