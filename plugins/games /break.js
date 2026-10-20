// plugins/تفكيك.js - لعبة التفكيك 🔨
import fetch from 'node-fetch';

// ═══════════ Handler.before (كشف الإجابة) ═══════════
handler.before = async (m, { conn }) => {
    if (!m.text || !global.break?.games[m.chat] || !global.break?.scores[m.chat]) return;

    const game = global.break.games[m.chat];
    const player = m.sender;
    
    // التحقق من الإجابة
    if (m.text.trim() !== game.answer) return;

    clearTimeout(game.timeout);
    delete global.break.games[m.chat];

    // إضافة نقطة للاعب
    if (!global.break.scores[m.chat][player]) global.break.scores[m.chat][player] = 0;
    global.break.scores[m.chat][player]++;
    
    // حساب إجمالي النقاط
    let total = 0;
    for (let id in global.break.scores[m.chat]) {
        total += global.break.scores[m.chat][id];
    }
    
    // ═══════════ إعلان الفائزين ═══════════
    if (total >= 20) {
        const entries = Object.entries(global.break.scores[m.chat])
            .sort((a, b) => b[1] - a[1]);
        
        const sorted = entries.map(([id, score], i) => 
            `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. @${id.split('@')[0]} - ${score} نقطة`
        );
        
        const mentions = entries.map(([id]) => id);
        
        const winner = entries[0][0];
        
        // ✅ إصلاح: global.db?.data?.users بدل global.db?.users
        if (global.db?.data?.users?.[winner]) {
            global.db.data.users[winner].xp = (global.db.data.users[winner].xp || 0) + 500;
            global.db.data.users[winner].cookies = (global.db.data.users[winner].cookies || 0) + 10;
        }
        
        await conn.sendMessage(m.chat, { 
            text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الـفـائـزون فـي الـتـفـكـيـك*
│
│ ❄️ ═══════════════ ❄️
${sorted.join('\n')}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🏅 @${winner.split('@')[0]}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ حـصـل عـلـى +500 XP
├ׁ̟̇˚₊· ͟͟͞͞➳❥ حـصـل عـلـى +10 كـوكـيـز 🍪
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`,
            mentions
        });
        delete global.break.scores[m.chat];
        return;
    }

    // ═══════════ رسالة "أحسنت" ═══════════
    await m.reply(`   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *أحـسـنـت!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ نـقـاطـك: ${global.break.scores[m.chat][player]}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);
    
    // تشغيل الجولة القادمة في الخلفية
    handler(m, { conn });
};

// ═══════════ Handler الرئيسي (بدء اللعبة) ═══════════
async function handler(m, { conn }) {
    if (!global.break) global.break = { games: {}, scores: {} };

    // إلغاء أي جولة نشطة
    if (global.break.games[m.chat]) {
        clearTimeout(global.break.games[m.chat].timeout);
        delete global.break.games[m.chat];
    }

    // ═══════════ جلب السؤال في الخلفية ═══════════
    const backgroundTask = async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        
        try {
            const res = await fetch("https://raw.githubusercontent.com/Xov445447533/Xov11111/master/src/JSON/venom-تفكيك.json", { signal: controller.signal });
            const data = await res.json();
            const q = data[Math.floor(Math.random() * data.length)];

            await m.reply(`   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *${q.question}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ اكـتـب الإجـابـة بـسـرعـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـنـدك 30 ثـانـيـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ كـل إجـابـة صـحـيـحـة = نـقـطـة
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);

            if (!global.break.scores[m.chat]) global.break.scores[m.chat] = {};

            global.break.games[m.chat] = {
                answer: q.response,
                timeout: setTimeout(async () => {
                    if (global.break.games[m.chat]) {
                        delete global.break.games[m.chat];
                        delete global.break.scores[m.chat];
                        try {
                            await m.reply(`   ⃝⃘᳟︢֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ⏰ *انـتـهـى الـوقـت*
│ 🩸 *مـحـدش عـرف الإجـابـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);
                        } catch (e) {}
                    }
                }, 30000)
            };
        } catch (e) {
            console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تفكيك]', e.message);
            try {
                await m.reply(`𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ فـي تـحـمـيـل الـلـعـبـة*
│ 🩸 حـاول تـانـي
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);
            } catch (e) {}
        } finally {
            clearTimeout(timeout);
        }
    };
    
    backgroundTask();
}

handler.usage = ["تفكيك"];
handler.category = "games";
handler.tags = ['games'];
handler.command = ['تفكيك'];
export default handler;