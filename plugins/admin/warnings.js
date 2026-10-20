// plugins/انذاراتي.js - عرض إنذاراتي 📊
let handler = async (m, { conn }) => {
    // 1. تجهيز نظام الإنذارات
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];
    if (!chat.warnings) chat.warnings = {};
    
    let userId = m.sender.split('@')[0];
    let count = chat.warnings[userId] || 0;

    // 2. لو مفيش إنذارات
    if (count === 0) {
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الإنـذارات الـخـاصـة بـك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${userId}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الإنـذارات: 0
│
│ 👑 *مـعـنـدكـش أي إنـذارات، اسـتـمـر يـا بـطـل!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        
        return conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });
    }

    // 3. عرض الإنذارات
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الإنـذارات الـخـاصـة بـك*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـضـو: @${userId}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الإنـذارات: ${count}/3
│
│ ${count >= 3 ? '🩸 *وصـلـت لـلـحـد الأقـصـى، سـيـتـم طـردك!*' : 
  count === 2 ? '🩸 *إنـذار أخـيـر قـبـل الـطـرد!*' : 
  '❄️ *خـلـي بـالـك مـن الـقـوانـيـن!*'}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.help = ['انذاراتي'];
handler.tags = ['admin'];
handler.command = /^(انذاراتي|الانذارات|warns|warnings)$/i;
handler.group = true;

export default handler;