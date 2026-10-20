// plugins/تيك.js - تحميل فيديو تيك توك 🎵
import crypto from 'crypto';
import cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

// ═══════════ دالة التحميل ═══════════
async function downloadTikTok(url, signal) {
  let data = qs.stringify({
    'id': url,
    'locale': 'en',
    'tt': crypto.randomBytes(8).toString('hex'),
  });

  let config = {
    method: 'POST',
    url: 'https://ssstik.io/abc?url=dl',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
    signal
  };

  let response = await axios.request(config);
  let $ = cheerio.load(response.data);

  return {
    author: $('h2').first().text().trim(),
    description: $('.maintext').text().trim(),
    videoUrl: $('a[href*="tikcdn.io"]:not(#hd_download)').first().attr('href'),
    audioUrl: $('.download_link.music').attr('href'),
    hdVideo: $('#hd_download').attr('href')
  };
}

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. التحقق من وجود النص
  if (!text) {
    return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [رابط تيك توك]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} https://vt.tiktok.com/xxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }

  // 2. التحقق من الرابط
  if (!text.includes('tiktok.com') && !text.includes('vt.tiktok')) {
    return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *يـرجـى إدخـال رابـط TikTok صـحـيـح!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }

  // 3. رسالة جاري التحميل
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎵 *جـاري تـحـمـيـل الـفـيـديـو مـن TikTok...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    // 4. تحميل الفيديو مع timeout
    let controller = new AbortController();
    let timeout = setTimeout(() => controller.abort(), 25000);
    
    let videoData = await downloadTikTok(text, controller.signal);
    clearTimeout(timeout);

    // 5. التحقق من النتائج
    if (!videoData.videoUrl && !videoData.audioUrl) {
      throw new Error('لم يتم العثور على فيديو أو صوت');
    }

    // حذف رسالة التحميل
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

    // 6. إرسال الفيديو
    if (videoData.videoUrl) {
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـحـمـيـل فـيـديـو TikTok*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـتـخـدم: ${videoData.author || 'غير معروف'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف: ${videoData.description || 'لا يوجد وصف'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${text}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, { 
        video: { url: videoData.videoUrl }, 
        caption: msg 
      }, { quoted: m });
    }

    // 7. إرسال الصوت لو موجود
    if (videoData.audioUrl) {
      await conn.sendMessage(m.chat, { 
        audio: { url: videoData.audioUrl }, 
        mimetype: 'audio/mpeg' 
      }, { quoted: m });
    }

  } catch (err) {
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-تيك]', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
    conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل تـحـمـيـل الـفـيـديـو:*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }
};

handler.help = ['تيك (رابط)'];
handler.tags = ['downloads'];
handler.command = /^(تيك|tiktok|tt)$/i;

export default handler;