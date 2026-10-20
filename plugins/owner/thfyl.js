let handler = async (m, { conn, text, isOwner }) => {
  if (!isOwner) return conn.reply(m.chat, `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n❌ *هذا الأمر مخصص للمطور فقط!*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);

  let activeBots = global.conns.filter(sock => sock?.user && sock?.isInit);
  if (activeBots.length === 0) return conn.reply(m.chat, '📭 *مفيش بوتات فرعية متصلة حالياً.*', m);

  let num = text ? text.replace(/[^0-9]/g, '') : "";
  
  if (!num || num.length < 10) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ تحفيل [الرقم]*\n*│*\n\n*📌 مثال:*\n.تحفيل 2012xxxx`, m);
  }

  let target = num.startsWith('20') ? num : '20' + num.replace(/^0/, '');
  let maskedNum = target.substring(0, 4) + "××××××" + target.substring(target.length - 2);
  target += '@s.whatsapp.net';

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🚀 *استنفار شامل بـ ${activeBots.length} بوت..*\n🎯 *الهدف:* ${maskedNum}\n🔥 *جاري التحميل 1000 رسالة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  let words = [
    "يا ابن المتناكة", "يا خول", "يا منيوك", "يا عرص", "يا شرموطة", "يا لقيط", 
    "يا ابن الزانية", "طيزك حمرا", "يا لبوة", "يا ابن الشرموطة", "يا مهان", 
    "يا خنيث", "يا معرص", "يا منبوذ", "يا كيس زبالة", "يا نجس", "يا لقيط الحواري",
    "يا ابن الكلب", "يا ابن الوسخة", "يا ديوث", "يا قحبة", "يا ابن العرص",
    "يا متناك", "يا منيوكة", "كس امك", "كس اختك", "يا عرصة", "يا خولة",
    "يا ابن القحبة", "يا شرموط", "يا زبالة", "يا نجس", "يا وسخ", "يا ابن النجسة",
    "يلعن كسمك", "يلعن ابوك", "يلعن دين امك", "في كس امك", "في طيزك",
    "يا خرة", "يا ابن الخرة", "يا غبي", "يا اهبل", "يا منحط", "يا متخلف",
    "يا ابن المتخلفين", "يا عار", "يا فاشل", "يا نكرة", "يا صفر", "يا معتوه"
  ];

  let totalMessages = 1000;
  let messages = [];
  for (let i = 0; i < totalMessages; i++) {
    let w1 = words[Math.floor(Math.random() * words.length)];
    let w2 = words[Math.floor(Math.random() * words.length)];
    let w3 = words[Math.floor(Math.random() * words.length)];
    let w4 = words[Math.floor(Math.random() * words.length)];
    messages.push(`${w1} ${w2} ${w3} ${w4} 💥 [${i + 1}/${totalMessages}]`);
  }

  let sentCount = 0;
  
  for (let i = 0; i < messages.length; i++) {
    let botIdx = i % activeBots.length;
    let sock = activeBots[botIdx];

    if (sock) {
      sock.sendMessage(target, { 
        text: `${messages[i]}\n\n💀 𝑴𝑨𝑿 𝑩𝑶𝑻 𝑶𝑵 𝑻𝑶𝑷\n🎯 Target: ${maskedNum}\n🔥 ${i + 1}/${totalMessages}`
      }).catch(() => null);
      sentCount++;
    }
    if (i % activeBots.length === 0) await new Promise(r => setTimeout(r, 30));
  }

  await conn.sendMessage(m.chat, { delete: loadingMsg.key });

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم الدعس بنجاح!*

🎯 *الهدف:* ${maskedNum}
💥 *الطلقات:* ${sentCount}/${totalMessages}
🤖 *البوتات:* ${activeBots.length}

👑 *بواسطة:* @${m.sender.split('@')[0]}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['تحفيل', 'هجوم', 'دعس'];
handler.tags = ['owner'];
handler.command = /^(تحفيل|هجوم|دعس)$/i;
handler.owner = true;

export default handler;
