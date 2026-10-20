let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n*.قناة https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435*`, m);

  try {
    // استخراج كود الدعوة بدقة باستخدام Regex
    let match = text.match(/whatsapp\.com\/channel\/([0-9A-Za-z]+)/i);
    let invite = match ? match[1] : text.trim();

    // جلب بيانات القناة
    let res = await conn.newsletterMetadata('invite', invite);
    if (!res) throw new Error('لم يتم العثور على القناة');

    let meta = res.thread_metadata || res;

    let name = meta.name?.text || meta.name || 'غير معروف';
    let desc = meta.description?.text || meta.description || 'لا يوجد وصف';
    let subs = meta.subscribers_count || meta.subscribers || '0';
    let created = meta.creation_time
      ? new Date(parseInt(meta.creation_time) * 1000).toLocaleString('ar-EG')
      : 'غير معروف';
    let status = res.state?.type || meta.state || 'غير معروف';
    let verify = meta.verification || 'غير معروف';
    let jid = res.id || meta.id || 'غير معروف';

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📢 *معلومات القناة*

👤 *الاسم:* ${name}
👥 *المشتركين:* ${subs}
📅 *تاريخ الإنشاء:* ${created}
📡 *الحالة:* ${status}
✔️ *التوثيق:* ${verify}

📝 *الوصف:*
${desc}

🔗 *JID:* \`\`\`${jid}\`\`\`

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    // معالجة آمنة للصورة
    let img = meta.preview?.direct_path
      ? 'https://mmg.whatsapp.net' + meta.preview.direct_path
      : null;

    if (img) {
      await conn.sendMessage(m.chat, { image: { url: img }, caption: msg }, { quoted: m })
        .catch(() => conn.sendMessage(m.chat, { text: msg }, { quoted: m }));
    } else {
      await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    }

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ *حصل خطأ، تأكد من أن الرابط صحيح وأن البوت يملك صلاحية الوصول!*', m);
  }
};

handler.help = ['قناة (رابط)'];
handler.tags = ['main'];
handler.command = /^(قناة|channel)$/i;

export default handler;
