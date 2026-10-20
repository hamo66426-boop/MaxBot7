// plugins/عين.js - لعبة خمن الشخصية 👁️

// ═══════════ الإعدادات ═══════════
const CHANNEL_JID = '120363424844460135@newsletter'
const CHANNEL_NAME = '𝑴𝑨𝑿 𝑩𝑶𝑻'
const BOT_NAME = '𝑴𝑨𝑿 𝑩𝑶𝑻'
const MAX_ROUNDS = 10;

const NAMES = [
  "ايرين","نيزوكو","سوكونا","موازن","كيلوا","غون","ايتاتشي","ساسكي","دابي","اوبيتو",
  "نوبارا","ليفاي","يوتا","فريدا","شيده","ياماتو","نامي","ايمو","انيا","جينبي",
  "بوروتو","شانكس","لاو","لوفي","زورو","اكازا","ميكاسا","رين","دوما","كانيكي",
  "غوجو","ساي","نيجي","انمي","ساكورا","اوريتشمارو","ماهيتو","جيرايا","روبين",
  "سانجي","ميهوك","كايدو","مايكي","كورابيكا","شيغاراكي","تينغن","تانجيرو",
  "ميدوريا","كونان","الكيورا","شوتو","غاتارو","بارو","غارا","باكوغو","ماكيما",
  "توجا","باين","كوراما"
];

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const getPrize = (rank) => {
  if (rank === 0) return { exp: 500, coin: 10, emoji: "🎉" };
  if (rank === 1) return { exp: 300, coin: 5, emoji: "🎖" };
  return { exp: 100, coin: 2, emoji: "⭐" };
};

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn }) => {
  let chatId = m.chat;
  if (!global.gameEye) global.gameEye = {};
  
  let g = global.gameEye[chatId];
  
  // لو فيه جولة نشطة، أعد إرسالها
  if (g?.current) {
    return await conn.sendMessage(chatId, {
      image: { url: g.current.img },
      caption: g.current.caption
    }, { quoted: m });
  }

  try {
    let controller = new AbortController();
    let timeout = setTimeout(() => controller.abort(), 20000);
    
    // ═══════════ عرض النتائج النهائية ═══════════
    if (!g || g.round >= MAX_ROUNDS) {
      if (g && Object.keys(g.scores).length > 0) {
        let sorted = Object.entries(g.scores).sort((a, b) => b[1] - a[1]);
        let prizes = [];

        for (let i = 0; i < sorted.length; i++) {
          let [id, score] = sorted[i];
          let prize = getPrize(i);
          
          // ✅ إصلاح: global.db?.data?.users بدل global.db.users
          let user = global.db?.data?.users?.[id];
          if (user) {
            user.exp = (user.exp || 0) + prize.exp;
            user.coin = (user.coin || 0) + prize.coin;
          }
          prizes.push(`├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${prize.emoji} @${id.split('@')[0]} - ${score} نقطة`);
          prizes.push(`│    +${prize.exp} XP + 🍪${prize.coin}`);
        }

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *انـتـهـت الـلـعـبـة*
│
│ ❄️ ═══════════════ ❄️
${prizes.join('\n')}
│
│ 👑 *اكـتـب .عين لـلـعـب مـن جـديـد*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(chatId, {
          text: msg,
          mentions: sorted.map(s => s[0])
        }, { quoted: m });
      }
      
      global.gameEye[chatId] = { round: 0, scores: {}, current: null };
    }

    // ═══════════ بدء جولة جديدة ═══════════
    let g2 = global.gameEye[chatId];
    g2.round++;

    // جلب البيانات
    let data = await fetch(
      "https://raw.githubusercontent.com/fjfilhjfjg-boop/Pomni-AI/refs/heads/main/%D8%B9%D9%8A%D9%86.md",
      { signal: controller.signal }
    ).then(r => r.json());
    
    clearTimeout(timeout);
    
    let char = data[Math.floor(Math.random() * data.length)];

    let wrong = shuffle([...NAMES]).filter(n => n !== char.name).slice(0, 3);
    let opts = shuffle([char.name, ...wrong]);

    let caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *خـمـن الـشـخـصـيـة* (${g2.round}/${MAX_ROUNDS})
│
│ ❄️ ═══════════════ ❄️
${opts.map((o, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}️⃣ ${o}`).join('\n')}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوقـت: 30 ثـانـيـة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ رد عـلـى الـصـورة بـرقـم أو اسـم الـشـخـصـيـة
│
│ 👑 *${BOT_NAME}*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    let sent = await conn.sendMessage(chatId, {
      image: { url: char.img },
      caption
    }, { quoted: m });

    // ═══════════ بدء الجولة ═══════════
    g2.current = {
      answer: char.name.toLowerCase(),
      opts: opts.map(o => o.toLowerCase()),
      img: char.img,
      caption,
      id: sent.key.id,
      timer: setTimeout(async () => {
        if (global.gameEye[chatId]?.current) {
          let ans = global.gameEye[chatId].current.answer;
          global.gameEye[chatId].current = null;
          try {
            await conn.sendMessage(chatId, {
              text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ⏰ *الـوقـت انـتـهـى!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الإجـابـة: ${ans}
│
│ 👑 *اكـتـب .عين لـلـبـدء مـن جـديـد*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
            }, { quoted: m });
          } catch (e) {}
        }
      }, 30000)
    };
  } catch (e) {
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-عين]', e.message);
    try {
      conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ فـي تـحـمـيـل الـلـعـبـة*
│ 🩸 حـاول تـانـي
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    } catch (e) {}
  }
};

// ═══════════ Handler.before (كشف الإجابة) ═══════════
handler.before = async function (m, { conn }) {
  let g = global.gameEye?.[m.chat];
  if (!g?.current) return;
  
  let cur = g.current;
  
  // ✅ إصلاح: التحقق الصح للمطابقة
  if (m.quoted?.id !== cur.id) return;
  
  let answer = m.text?.toLowerCase().trim();
  if (!answer) return;
  if (!cur.opts.includes(answer)) return;
  
  clearTimeout(cur.timer);
  g.current = null;
  
  // ═══════════ إجابة صحيحة ═══════════
  if (answer === cur.answer) {
    g.scores[m.sender] = (g.scores[m.sender] || 0) + 1;
    
    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *صـح!*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـلاعـب: @${m.sender.split('@')[0]}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـنـقـاط: ${g.scores[m.sender]}
│
│ 👑 *${BOT_NAME}*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
    
    await conn.sendMessage(m.chat, {
      text: msg,
      mentions: [m.sender]
    }, { quoted: m });
    
    // الجولة القادمة
    setTimeout(() => handler(m, { conn }), 2000);
  } else {
    await m.reply(`   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ${BOT_NAME}
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *غـلـط! جـرب تـانـي*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`);
  }
  return true;
};

handler.help = ['عين'];
handler.tags = ['games'];
handler.command = /^(عين|eye)$/i;

export default handler;