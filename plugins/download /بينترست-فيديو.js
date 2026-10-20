// plugins/بينترست-فيديو.js - تحميل من Pinterest 📥
import axios from 'axios';
import * as cheerio from 'cheerio';

// ═══════════ جلب التوكن ═══════════
async function getSnappinToken() {
  let { headers, data } = await axios.get('https://snappin.app/');
  let cookies = headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
  let $ = cheerio.load(data);
  let csrfToken = $('meta[name="csrf-token"]').attr('content');
  return { csrfToken, cookies };
}

// ═══════════ دالة التحميل ═══════════
async function snappinDownload(pinterestUrl) {
  try {
    let { csrfToken, cookies } = await getSnappinToken();

    let postRes = await axios.post(
      'https://snappin.app/',
      { url: pinterestUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          Cookie: cookies,
          Referer: 'https://snappin.app',
          Origin: 'https://snappin.app',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    let $ = cheerio.load(postRes.data);
    let thumb = $('img').attr('src');

    let downloadLinks = $('a.button.is-success')
      .map((_, el) => $(el).attr('href'))
      .get();

    let videoUrl = null;
    let imageUrl = null;

    for (let link of downloadLinks) {
      let fullLink = link.startsWith('http') ? link : 'https://snappin.app' + link;
      let head = await axios.head(fullLink).catch(() => null);
      let contentType = head?.headers?.['content-type'] || '';

      if (link.includes('/download-file/')) {
        if (contentType.includes('video')) {
          videoUrl = fullLink;
        } else if (contentType.includes('image')) {
          imageUrl = fullLink;
        }
      } else if (link.includes('/download-image/')) {
        imageUrl = fullLink;
      }
    }

    return {
      status: true,
      thumb,
      video: videoUrl,
      image: videoUrl ? null : imageUrl
    };

  } catch (err) {
    return {
      status: false,
      message: err?.response?.data?.message || err.message || 'Unknown Error'
    };
  }
}

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let url = args[0];
  
  // 1. التحقق من الرابط
  if (!url) {
    return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [رابط بينترست]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} https://pin.it/xxxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }

  // 2. رسالة جاري التحميل
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 📥 *جـاري تـحـمـيـل الـفـيـديـو مـن Pinterest...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    // 3. تحميل
    let result = await snappinDownload(url);
    if (!result.status) throw result.message;

    // حذف رسالة التحميل
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

    // 4. إرسال الفيديو
    if (result.video) {
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـحـمـيـل الـفـيـديـو مـن Pinterest بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${url}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, { 
        video: { url: result.video }, 
        caption: msg,
        mimetype: 'video/mp4'
      }, { quoted: m });
      
    } 
    // 5. إرسال الصورة
    else if (result.image) {
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـحـمـيـل الـصـورة مـن Pinterest بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${url}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, { 
        image: { url: result.image }, 
        caption: msg 
      }, { quoted: m });
      
    } 
    // 6. مفيش وسائط
    else {
      throw 'لم يتم العثور على وسائط.';
    }

  } catch (err) {
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-بينترست-فيديو]', err);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
    conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل الـتـحـمـيـل:*
│ 🩸 ${err}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }
};

handler.help = ['بينترست-فيديو (رابط)'];
handler.tags = ['downloads'];
handler.command = /^(بينترست-فيديو|pin-video|pint-video)$/i;

export default handler;