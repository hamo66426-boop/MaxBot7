import axios from 'axios';
import FormData from 'form-data';

const MAX_SIZE = 30 * 1024 * 1024;

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ لرابط (بالرد على صورة/فيديو/صوت)*\n*│*`, m);

  // رسالة جاري الرفع
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري رفع الملف وتحويله إلى رابط...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let controller = new AbortController();
    let timeout = setTimeout(() => controller.abort(), 25000);

    let media = await q.download();
    if (!media) {
      await conn.sendMessage(m.chat, { delete: loadingMsg.key });
      return conn.reply(m.chat, '❌ *فشل في تحميل الميديا من واتساب.*', m);
    }

    if (media.length > MAX_SIZE) {
      await conn.sendMessage(m.chat, { delete: loadingMsg.key });
      return conn.reply(m.chat, '❌ *حجم الملف تجاوز الحد المسموح (30MB).*', m);
    }

    let form = new FormData();
    form.append('file', media, {
      filename: `file_${Date.now()}.${mime.split('/')[1]}`
    });

    let response = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
      headers: { ...form.getHeaders() },
      signal: controller.signal,
      maxContentLength: MAX_SIZE,
      maxBodyLength: MAX_SIZE
    });

    if (!response.data || !response.data.data || !response.data.data.url) {
      throw new Error('فشل السيرفر في توليد الرابط');
    }

    let rawUrl = response.data.data.url;
    let link = rawUrl.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');

    clearTimeout(timeout);

    // حذف رسالة التحميل
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تحويل الملف إلى رابط*

🔗 *الرابط المباشر:*
${link}

📁 *النوع:* ${mime}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    // إرسال الرابط مع زر النسخ
    await conn.sendMessage(m.chat, {
      text: msg,
      mentions: [m.sender],
      footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
      interactiveButtons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 اضغط لنسخ الرابط",
            copy_code: link
          })
        }
      ]
    }, { quoted: m });

    // إرسال الرابط كرسالة منفصلة للنسخ السريع
    await conn.sendMessage(m.chat, { text: link }, { quoted: m });

  } catch (err) {
    console.error('[لرابط] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *حدث خطأ:* ${err.message}`, m);
  }
};

handler.help = ['لرابط (بالرد على ميديا)'];
handler.tags = ['tools'];
handler.command = /^(لرابط|image2url|رفععع|upload)$/i;

export default handler;