import fs from 'fs';

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return conn.reply(m.chat, '❌ *البوت الأساسي فقط هو اللي يقدر يحذف البوتات الفرعية!*', m);

  if (!args[0]) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ حذف_بوت [الرقم]*\n*│*\n\n*📌 مثال:*\n.حذف_بوت 2012xxxx`, m);
  }

  let input = args[0].trim();
  
  // ✅ استخدام global.conns (نظام yukiJadiBot)
  let bots = global.conns.filter(sock => sock?.user);
  
  if (bots.length === 0) {
    return conn.reply(m.chat, '📭 *لا يوجد بوتات فرعية متصلة!*', m);
  }

  // ✅ البحث عن البوت بالرقم
  let target = bots.find(sock => {
    let phone = sock.user.jid.split(':')[0].split('@')[0];
    return phone === input || phone.includes(input);
  });

  if (!target) {
    return conn.reply(m.chat, '❌ *لم يتم العثور على البوت!*\n📝 *تأكد من الرقم أو استخدم .البوتات لعرض القائمة*', m);
  }

  let phone = target.user.jid.split(':')[0].split('@')[0];
  
  try {
    // إغلاق اتصال البوت
    try { target.ws?.close(); } catch(e) {}
    target.ev.removeAllListeners();
    
    // حذف من القائمة
    let i = global.conns.indexOf(target);
    if (i >= 0) global.conns.splice(i, 1);
    
    // حذف مجلد الجلسة
    let sessionPath = `./${global.jadi || 'Sessions/SubBot'}/${phone}`;
    try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch(e) {}

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🗑️ *تم حذف البوت بنجاح*

📱 *الرقم:* ${phone}

📊 *المتبقي:* ${global.conns.filter(s => s?.user).length}

👑 *بواسطة:* @${m.sender.split('@')[0]}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });

  } catch (err) {
    console.error('[حذف_بوت] error:', err.message);
    conn.reply(m.chat, `❌ *فشل حذف البوت:* ${err.message}`, m);
  }
};

handler.help = ['حذف_بوت (رقم)'];
handler.tags = ['subbot'];
handler.command = /^(حذف_بوت|حذف_بوتي)$/i;
handler.owner = true;

export default handler;