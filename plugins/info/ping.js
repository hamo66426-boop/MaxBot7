let handler = async (m, { conn }) => {
  // 1. حساب سرعة استلام الرسالة
  let userTimestamp = m.messageTimestamp ? (m.messageTimestamp.low || m.messageTimestamp) * 1000 : Date.now();
  let msgSpeed = Math.abs(Date.now() - userTimestamp);

  // 2. إرسال رسالة مؤقتة لحساب سرعة استجابة البوت
  let start = Date.now();
  let initialMsg = await conn.sendMessage(m.chat, { text: '🔄 *جاري قياس السرعة...*' }, { quoted: m });
  let end = Date.now();

  // حساب سرعة استجابة البوت بالمللي ثانية
  let botSpeed = end - start;

  // 3. تحديد حالة الاستجابة بناءً على (botSpeed)
  let speedStatus;
  if (botSpeed < 1000) speedStatus = '🟢 *ممتازة*';
  else if (botSpeed < 2000) speedStatus = '🟡 *جيدة*';
  else if (botSpeed < 3500) speedStatus = '🟠 *متوسطة*';
  else speedStatus = '🔴 *بطيئة*';

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
⚡ *اخـتـبـار الـسـرعـة الـشـامـل*

📩 *سرعة استلام الرسالة:* ${msgSpeed} ms
⚙️ *سرعة استجابة البوت:* ${botSpeed} ms
🏷️ *حالة الاستجابة:* ${speedStatus}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  // تعديل الرسالة بالنتيجة النهائية
  await conn.sendMessage(m.chat, { text: msg, edit: initialMsg.key });
};

handler.help = ['بنج', 'ping'];
handler.tags = ['info'];
handler.command = /^(بنج|ping|speed|سرعة)$/i;

export default handler;
