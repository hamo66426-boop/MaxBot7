let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [رابط المجموعة]*\n*│*\n\n*📌 مثال:*\n${command} https://chat.whatsapp.com/xxxxx`, m);
  }

  let url = text.trim();
  
  // ✅ استخراج الكود من الرابط
  let inviteCode = '';
  if (url.includes('chat.whatsapp.com/')) {
    inviteCode = url.split('chat.whatsapp.com/')[1].split('?')[0].split('#')[0];
  } else if (url.includes('whatsapp.com/')) {
    inviteCode = url.split('whatsapp.com/')[1].split('?')[0].split('#')[0];
  } else {
    inviteCode = url;
  }

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري جلب معلومات المجموعة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let result = await conn.groupGetInviteInfo(inviteCode);
    
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📋 *مـعـلـومـات الـمـجـمـوعـة*

👑 *الاسم:* ${result.subject || 'غير معروف'}
🆔 *الـ JID:* ${result.id || 'غير معروف'}
📅 *تاريخ الإنشاء:* ${result.creation ? new Date(result.creation * 1000).toLocaleString('ar-EG') : 'غير معروف'}
👤 *المالك:* ${result.owner ? '@' + result.owner.split('@')[0] : 'غير معروف'}
👥 *الأعضاء:* ${result.size || 'غير معروف'}
📝 *الوصف:* ${result.desc || 'لا يوجد'}

🔗 *الرابط:* ${url}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

  } catch (err) {
    console.error('[جروب_ايدي] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *فشل جلب المعلومات*\n\n⚠️ *تأكد من:*\n- الرابط صحيح\n- المجموعة مش مقفولة\n- البوت يقدر يشوف الرابط`, m);
  }
};

handler.help = ['جروب_ايدي (رابط) - بيجيب معلومات مجموعة تانية لو عندك رابط دعوتها بالفعل، مش لجلب رابط المجموعة الحالية'];
handler.tags = ['tools'];
handler.command = /^(جروب_ايدي|groupid|ايدي_جروب)$/i;

export default handler;