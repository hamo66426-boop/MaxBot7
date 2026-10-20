import axios from "axios";

const itachiPrompts = [
  "Itachi Uchiha aesthetic", "Itachi Akatsuki wallpaper HD", "Itachi Mangekyou Sharingan", 
  "Itachi Susanoo fanart", "Itachi Anbu mask", "Itachi Uchiha dark mood", 
  "Itachi vs Sasuke iconic moments", "Itachi crying blood", "Itachi smiling sad", 
  "Itachi Uchiha pfp HD", "Itachi with crows aesthetic", "Itachi Amaterasu fire", 
  "Young Itachi Uchiha", "Itachi and Shisui", "Itachi Uchiha realistic art", 
  "Itachi Mangekyou activation", "Itachi sitting on throne", "Itachi Uchiha manga panels", 
  "Itachi wallpaper 4k phone", "Itachi silhouette moon", "Itachi Akatsuki cloak", 
  "Itachi Uchiha chibi cute", "Itachi emotional death scene", "Itachi and Kisame team", 
  "Itachi Izanami moment", "Itachi Uchiha genjutsu style", "Itachi eyes close up", 
  "Itachi in the rain anime", "Itachi Uchiha watercolor painting", "Itachi minimal wallpaper", 
  "Itachi Anbu sword action", "Itachi Uchiha badass entrance", "Itachi finger poke brothers", 
  "Itachi leaf village forehead protector", "Itachi Uchiha glowing eyes", "Itachi legendary shinobi art", 
  "Itachi Susanoo full body", "Itachi Uchiha sketching", "Itachi crow clone jutsu", 
  "Itachi Uchiha aesthetic red and black"
];

const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  accept: "application/json, text/javascript, */*, q=0.01",
  referer: "https://www.pinterest.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "x-app-version": "a9522f",
  "x-pinterest-appstate": "active",
  "x-pinterest-pws-handler": "www/[username]/[slug].js",
  "x-requested-with": "XMLHttpRequest",
};

async function getCookies() {
  try {
    let response = await axios.get(base);
    let setHeaders = response.headers["set-cookie"];
    return setHeaders ? setHeaders.map(v => v.split(";")[0]).join("; ") : null;
  } catch { return null; }
}

async function searchPinterest(query) {
  try {
    let cookies = await getCookies();
    if (!cookies) return { status: false };

    let params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: { isPrefetch: false, query, scope: "pins", bookmarks: [""], page_size: 10 },
        context: {},
      }),
      _: Date.now(),
    };

    let { data } = await axios.get(`${base}${search}`, {
      headers: { ...headers, cookie: cookies },
      params,
    });

    let results = data.resource_response.data.results.filter(v => v.images?.orig);
    if (!results.length) return { status: false };

    return {
      status: true,
      pins: results.map(v => ({ id: v.id, image: v.images.orig.url })),
    };
  } catch { return { status: false }; }
}

let handler = async (m, { conn }) => {
  let randomPrompt = itachiPrompts[Math.floor(Math.random() * itachiPrompts.length)];

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري جلب صور إيتاتشي...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let result = await searchPinterest(randomPrompt);
    if (!result.status) throw new Error('فشل جلب الصور');

    let pins = result.pins.slice(0, 10);
    
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    for (let i = 0; i < pins.length; i++) {
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🦅 *إيـتـاتـشـي أوتشيها* 🖤

📸 *صورة رقم:* ${i + 1}/${pins.length}
👁️ *Itachi Uchiha*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, {
        image: { url: pins[i].image },
        caption: msg
      }, { quoted: m });
      
      if (i < pins.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    let finalMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم جلب ${pins.length} صور لإيتاتشي*

🦅 *Itachi Uchiha - Legend*

💡 *اكتب .ايتاتشي للمزيد*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: m });

  } catch (err) {
    console.error('[ايتاتشي] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
    conn.reply(m.chat, '❌ *فشل جلب الصور، حاول مرة أخرى!*', m);
  }
};

handler.help = ['ايتاتشي'];
handler.tags = ['images'];
handler.command = /^(صور-ايتاتشي|صور-إيتاتشي|itachiphotos)$/i;

export default handler;