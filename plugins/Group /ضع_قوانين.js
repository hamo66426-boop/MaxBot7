let handler = async (m, { conn, text, isAdmin, isOwner }) => {
  if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
  if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

  let chat = global.db.data.chats[m.chat];

  // ✅ لو مفيش نص - اطلب من المستخدم يبعت القوانين
  if (!text) {
    let currentRules = chat.rules || 'لا توجد قوانين مسجلة';

    // ✅ نخزن إن المستخدم في وضع تحديث القوانين
    if (!global.waitingForRules) global.waitingForRules = {};
    global.waitingForRules[m.sender] = m.chat;

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📝 *إرسال القوانين الجديدة*

📋 *القوانين الحالية:*
${currentRules}

✏️ *ابعت أي رسالة دلوقتي وهتتحفظ كقوانين*

⚠️ *الرسالة الجاية هتكون هي القوانين*

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    return conn.reply(m.chat, msg, m);
  }

  // ✅ لو فيه نص - احفظه كقوانين
  chat.rules = text;

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم حفظ القوانين بنجاح*

📋 *القوانين الجديدة:*
${text}

💡 *لعرض القوانين:* .قوانين

👑 *بواسطة:* @${m.sender.split('@')[0]}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, { 
    text: msg, 
    mentions: [m.sender] 
  }, { quoted: m });
};

// ✅ مستمع للرسالة اللي بعد .ضع_قوانين
handler.before = async function (m, { conn }) {
  if (!global.waitingForRules?.[m.sender]) return;
  if (m.text?.startsWith('.')) {
    delete global.waitingForRules[m.sender];
    return;
  }

  let chatId = global.waitingForRules[m.sender];
  delete global.waitingForRules[m.sender];

  let chat = global.db.data.chats[chatId];
  chat.rules = m.text;

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم حفظ القوانين بنجاح*

📋 *القوانين الجديدة:*
${m.text}

💡 *لعرض القوانين:* .قوانين

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.reply(m.chat, msg, m);
};

handler.help = ['ضع_قوانين'];
handler.tags = ['group'];
handler.command = /^(ضع_قوانين|اضف_قوانين|setrules)$/i;
handler.group = true;
handler.admin = true;

export default handler;