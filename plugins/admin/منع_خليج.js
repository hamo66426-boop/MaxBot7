// plugins/anti-gcc.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - نظام منع غير المصريين 🇪🇬

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

async function resolveJid(conn, jid, chatId) {
    try {
        const clean = await conn.convertLidToRealJid(jid, chatId)
        if (clean && clean.includes('@s.whatsapp.net')) return clean
    } catch {}
    return jid
}

async function makeMention(conn, jid, chatId, fallback = 'العضو') {
    const realJid = await resolveJid(conn, jid, chatId)
    let name = ''
    try {
        name = await conn.getName(realJid)
    } catch {}
    if (!name || name.includes('@') || /^\d+$/.test(name)) name = fallback
    return {
        text: `@${realJid.split('@')[0]}`,
        name: name,
        jid: realJid
    }
}

let handler = async (m, { conn, text, isAdmin, isOwner }) => {

  if (!m.isGroup) {
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❄️ *خـطـأ*
│
│ 🔮 هـذا الأمـر يـعـمـل فـقـط فـي الـمـجـمـوعـات
│
${FOOT}`, m);
  }

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❄️ *صـلاحـيـات غـيـر كـافـيـة*
│
│ 🔮 هـذا الأمـر مـخـصـص لـلـمـشـرفـيـن فـقـط
│
${FOOT}`, m);
  }

  if (!global.db.data.settings) global.db.data.settings = {};
  if (!global.db.data.settings[conn.user.jid]) {
    global.db.data.settings[conn.user.jid] = { blockNonEgypt: false };
  }

  let setting = global.db.data.settings[conn.user.jid];

  if (!text) {
    const currentStatus = setting.blockNonEgypt ? '🟢 مُـفـعـل' : '🔴 مُـعـطـل';
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❄️ *نـظـام مـنـع غـيـر الـمـصـريـيـن*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: ${currentStatus}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الاسـتـخـدام: .منع_الخليج [تفعيل/تعطيل]
│
${FOOT}`, m);
  }

  if (text === 'تفعيل') {
    setting.blockNonEgypt = true;
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *تـم الـتـفـعـيـل*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🇪🇬 نـظـام مـنـع غـيـر الـمـصـريـيـن
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🟢 مُـفـعـلـة
│
${FOOT}`, m);
  } 
  else if (text === 'تعطيل') {
    setting.blockNonEgypt = false;
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ✅ *تـم الـتـعـطـيـل*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ تـم إيـقـاف نـظـام مـنـع غـيـر الـمـصـريـيـن
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـالـة: 🔴 مُـعـطـلـة
│
${FOOT}`, m);
  } 
  else {
    return conn.reply(m.chat, `${HEADER}
${LINE}
│
│ ❄️ *خـطـأ*
│
│ 🔮 اسـتـخـدم: تفعيل أو تعطيل
│
${FOOT}`, m);
  }
};

// ═══════════════════════════════════════════════════════════
// 🔥 نظام الطرد التلقائي عند دخول أعضاء جدد
// ═══════════════════════════════════════════════════════════
handler.before = async function (m, { conn, isBotAdmin }) {
  
  if (!m.isGroup) return;
  if (!m.message?.groupParticipantAdd) return;
  
  let setting = global.db.data.settings?.[conn.user.jid];
  if (!setting?.blockNonEgypt) return;
  
  if (!isBotAdmin) return;
  
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
  const botNumber = conn.user.jid;
  
  const newMembers = m.message.groupParticipantAdd;
  
  let removed = [];
  let removedNames = [];
  
  for (let user of newMembers) {
    if (user === botNumber) continue;
    if (user === groupOwner) continue;
    
    const number = user.split('@')[0];
    
    // السماح للأرقام المصرية فقط (كود مصر 20)
    if (number.startsWith('20')) continue;
    
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      removed.push(user);
      try {
        const mention = await makeMention(conn, user, m.chat);
        removedNames.push(mention.text);
      } catch {
        removedNames.push(`@${number}`);
      }
    } catch (err) {
      console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-AntiGCC] فشل طرد العضو:', err);
    }
  }
  
  if (removed.length > 0) {
    let membersList = removedNames.join('\n├ׁ̟̇˚₊· ͟͟͞͞➳❥ ');
    await conn.sendMessage(m.chat, {
      text: `${HEADER}
${LINE}
│
│ 🚫 *تـم طـرد أعـضـاء*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🇪🇬 تـم طـرد الأعـضـاء غـيـر الـمـصـريـيـن
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${membersList}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـعـدد: ${removed.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🇪🇬 الـمـجـمـوعـة لـلـمـصـريـيـن فـقـط
│
${FOOT}`,
      mentions: removed
    }, { quoted: m });
  }
};

handler.help = ['منع_الخليج <تفعيل/تعطيل>'];
handler.tags = ['admin'];
handler.command = /^منع_الخليج$/i;
handler.group = true;
handler.admin = true;

export default handler