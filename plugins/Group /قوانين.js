let handler = async (m, { conn, isAdmin, isOwner, groupMetadata }) => {
  if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m);
  if (!m.isGroup) return conn.reply(m.chat, '❌ *هذا الأمر للمجموعات فقط!*', m);

  let chat = global.db.data.chats[m.chat];
  let groupName = groupMetadata?.subject || 'المجموعة';

  if (!chat.rules || chat.rules.trim() === '') {
    return conn.reply(m.chat, `📋 *لا توجد قوانين مخصصة للمجموعة*\n\n💡 *لإضافة قوانين استخدم:*\n.ضع_قوانين [القوانين]`, m);
  }

  let rules = chat.rules.split('\n').filter(r => r.trim() !== '');
  
  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📋 *قـوانـيـن ${groupName}*

${rules.map((rule, i) => `${i + 1}. ${rule.trim()}`).join('\n')}

⚠️ *يجب على الجميع الالتزام بهذه القوانين*



➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  // جلب جميع أعضاء المجموعة
  let participants = groupMetadata?.participants || (await conn.groupMetadata(m.chat)).participants;
  // استخراج الـ ID (الرقم) لكل عضو
  let jids = participants.map(p => p.id);

  // إرسال الرسالة مع المنشن المخفي للجميع
  await conn.sendMessage(m.chat, { 
    text: msg, 
    mentions: jids 
  }, { quoted: m });
};

handler.help = ['القوانين'];
handler.tags = ['group'];
handler.command = /^(قوانين|القوانين|rules)$/i;
handler.group = true;
handler.admin = true;

export default handler;