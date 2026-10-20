// plugins/فيديو.js - تحميل فيديو يوتيوب 🎬
import axios from 'axios';
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

// ═══════════ وظائف التحميل ═══════════
async function startConversion(videoUrl, quality) {
  let payload = {
    url: videoUrl,
    os: "linux",
    output: { type: "video", format: "mp4" },
    video: { quality: quality }
  };
  let headers = { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" };
  let { data } = await axios.post("https://hub.ytconvert.org/api/download", payload, { headers });
  return data.statusUrl;
}

async function waitForDownload(statusUrl) {
  while (true) {
    let { data } = await axios.get(statusUrl);
    if (data.status === "completed" || data.status === "success") return data.downloadUrl;
    if (data.status === "failed") throw new Error("فشل تحويل الفيديو");
    await new Promise(r => setTimeout(r, 2000));
  }
}

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // ═══════════ 1. عرض خيارات الجودة ═══════════
  if (command === 'فيديو') {
    if (!text) {
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix}فيديو [رابط يوتيوب]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix}فيديو https://youtu.be/xxx
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
    
    let url = text.trim();
    
    // التحقق من الرابط
    if (!url.includes('youtu')) {
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *رابـط يـوتـيـوب غـيـر صـحـيـح.*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    let qualities = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];
    let encodedUrl = Buffer.from(url).toString('base64');

    // ═══════════ قائمة الجودات ═══════════
    const sections = [{
      title: "📥 اخـتـر جـودة الـتـحـمـيـل",
      rows: qualities.map(q => ({
        title: `📥 جودة ${q}`,
        description: `تحميل الفيديو بجودة ${q}`,
        id: `.جودة_فيديو ${q}|${encodedUrl}`
      }))
    }];

    // ═══════════ نص الرسالة ═══════════
    const caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـحـمـيـل فـيـديـو يـوتـيـوب*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${url}
│
│ 👑 *اخـتـر جـودة الـتـحـمـيـل مـن الـقـائـمـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    // ═══════════ إرسال بأزرار ButtonV2 ═══════════
    await new ButtonV2(conn)
      .setBody(caption)
      .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
      .setThumbnail('https://files.catbox.moe/p6jm0g.jpg')
      .addRawButton({
        buttonText: { displayText: '🎬 اخـتـر الـجـودة' },
        buttonId: 'video_quality',
        type: 1,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: '🎬 اخـتـر جـودة الـتـحـمـيـل',
            sections: sections
          })
        }
      })
      .addRawButton({
        buttonText: { displayText: '📢 قـنـاة الـبـوت' },
        buttonId: 'channel',
        type: 2,
        url: CHANNEL
      })
      .addButton('🤖 تـنـصـيـب وحـدة', '.تنصيب')
      .send(m.chat);
  }

  // ═══════════ 2. المعالجة والتحميل ═══════════
  if (command === 'جودة_فيديو') {
    if (!text) return;
    let [quality, encodedUrl] = text.split('|');
    
    // ✅ التحقق من البيانات
    if (!quality || !encodedUrl) {
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *بـيـانـات غـيـر صـحـيـحـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    let videoUrl = Buffer.from(encodedUrl, 'base64').toString();

    // رسالة جاري التحميل
    let loadingMsg = await conn.sendMessage(m.chat, { 
      text: `   ⃝⃘᳟︢֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎬 *جـاري تـحـمـيـل الـفـيـديـو بـجـودة ${quality}...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
      // التحويل
      let statusUrl = await startConversion(videoUrl, quality.trim());
      let downloadUrl = await waitForDownload(statusUrl);

      // تحميل الملف
      let response = await axios({ method: 'GET', url: downloadUrl, responseType: 'arraybuffer' });
      
      // حذف رسالة التحميل
      try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

      // ═══════════ إرسال الفيديو ═══════════
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *تـم تـحـمـيـل الـفـيـديـو بـنـجـاح*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـجـودة: ${quality}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${videoUrl}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, {
        video: Buffer.from(response.data),
        mimetype: 'video/mp4',
        caption: msg
      }, { quoted: m });

    } catch (err) {
      console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-فيديو]', err);
      try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
      conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *فـشـل تـحـمـيـل الـفـيـديـو:*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
  }
};

handler.help = ['فيديو (رابط يوتيوب)'];
handler.tags = ['downloads'];
handler.command = /^(فيديو|جودة_فيديو)$/i;

export default handler;