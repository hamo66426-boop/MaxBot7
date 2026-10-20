import fetch from 'node-fetch';

const SCREENSHOT_APIS = [
  (url) => `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`,
  (url) => `https://image.thum.io/get/width/1280/crop/800/maxAge/1/${url.replace(/^https?:\/\//, '')}`,
  (url) => `https://api.pikwy.com/v1/screenshot?t=1&w=1280&h=800&u=${encodeURIComponent(url)}`,
  (url) => `https://free.pagepeeker.com/v2/thumbs.php?size=x&url=${encodeURIComponent(url)}`
];

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [رابط الموقع]*\n*│*\n\n*📌 مثال:*\n${command} google.com`, m);
  }

  let url = args[0].trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n📸 *جاري التقاط سكرين شوت...*\n\n🌐 ${url}\n⏳ *قد تستغرق بضع ثواني*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  let success = false;

  for (let i = 0; i < SCREENSHOT_APIS.length; i++) {
    let screenshotUrl = SCREENSHOT_APIS[i](url);

    try {
      let res = await fetch(screenshotUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (res.ok) {
        let buffer = Buffer.from(await res.arrayBuffer());

        if (buffer.length > 1000) {
          await conn.sendMessage(m.chat, { delete: loadingMsg.key });

          let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📸 *سكرين شوت*

🌐 ${url}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: msg
          }, { quoted: m });

          success = true;
          break;
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (!success) {
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, '❌ *فشل التقاط الشاشة. حاول مرة أخرى أو تأكد من الرابط.*', m);
  }
};

handler.help = ['سكرين (رابط)'];
handler.tags = ['images'];
handler.command = /^(سكرين|screen|screenshot|لقطة)$/i;

export default handler;