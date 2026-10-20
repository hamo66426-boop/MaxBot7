import axios from 'axios';
import FormData from 'form-data';

const MAX_SIZE = 30 * 1024 * 1024;

let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ نسخ (بالرد على صورة فيها نص)*\n*│*\n\n📸 *ابعت الصورة واعمل عليها ريبلاي بالأمر*`, m);

  // رسالة جاري المعالجة
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري استخراج النص من الصورة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let controller = new AbortController();
    let timeout = setTimeout(() => controller.abort(), 25000);

    let buffer = await m.quoted.download();

    if (buffer.length > MAX_SIZE) {
      throw new Error('حجم الصورة تجاوز الحد المسموح (30MB)');
    }

    let form = new FormData();
    form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

    let res = await axios.post('https://emam-api.web.id/home/sections/Tools/api/ocr-image', form, {
      headers: form.getHeaders(),
      signal: controller.signal,
      maxContentLength: MAX_SIZE,
      maxBodyLength: MAX_SIZE
    });

    clearTimeout(timeout);

    // حذف رسالة التحميل
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let text = res.data.result || 'لم يتم التعرف على نص في الصورة';

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📝 *النص المستخرج من الصورة*

${text}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
      text: msg,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (err) {
    console.error('[نسخ] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
  }
};

handler.help = ['نسخ (بالرد على صورة)'];
handler.tags = ['tools'];
handler.command = /^(نسخ|ocr)$/i;

export default handler;