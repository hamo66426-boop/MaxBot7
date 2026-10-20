// plugins/بنترست.js - البحث في Pinterest 📸
import axios from "axios";
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  accept: "application/json, text/javascript, */*, q=0.01",
  referer: "https://www.pinterest.com/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "x-app-version": "a9522f",
  "x-pinterest-appstate": "active",
  "x-pinterest-pws-handler": "www/[username]/[slug].js",
  "x-requested-with": "XMLHttpRequest",
};

// ═══════════ جلب الكوكيز ═══════════
async function getCookies() {
  try {
    let response = await axios.get(base);
    let setHeaders = response.headers["set-cookie"];
    if (setHeaders) {
      return setHeaders.map(v => v.split(";")[0]).join("; ");
    }
    return null;
  } catch {
    return null;
  }
}

// ═══════════ البحث في Pinterest ═══════════
async function searchPinterest(query) {
  try {
    let cookies = await getCookies();
    if (!cookies) return { status: false, message: "فشل جلب الكوكيز." };

    let params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query,
          scope: "pins",
          bookmarks: [""],
          page_size: 10,
        },
        context: {},
      }),
      _: Date.now(),
    };

    let { data } = await axios.get(`${base}${search}`, {
      headers: { ...headers, cookie: cookies },
      params,
    });

    let results = data.resource_response.data.results.filter(
      v => v.images?.orig
    );

    if (!results.length)
      return { status: false, message: "لم يتم العثور على نتائج." };

    return {
      status: true,
      pins: results.map(v => ({
        id: v.id,
        image: v.images.orig.url,
        pin_url: `https://pinterest.com/pin/${v.id}`,
      })),
    };
  } catch (err) {
    console.error("[Pinterest search error]", err?.response?.status || "", err?.message || err);
    return { status: false, message: "فشل البحث عن الصور، راجع سجل Termux لمعرفة السبب." };
  }
}

// ═══════════ Handler الرئيسي ═══════════
let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // ═══════════ أمر عرض الصورة ═══════════
  if (command === 'عرض_صوره') {
    if (!text) return;
    let [imageUrl, index] = text.split('|');
    
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *صـورة رقـم ${index || '?'}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـرابـط: ${imageUrl}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });
    return;
  }

  // ═══════════ أمر البحث ═══════════
  if (!text) {
    return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} [كلمة البحث]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix + command} naruto
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }

  // رسالة جاري البحث
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🔍 *جـاري جـلـب الـصـور مـن Pinterest...*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let result = await searchPinterest(text);
    
    // لو فشل البحث
    if (!result.status) {
      try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *${result.message}*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    let pins = result.pins.slice(0, 10);
    
    // حذف رسالة التحميل
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}

    // ═══════════ نص الرسالة ═══════════
    let caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *نـتـائـج Pinterest*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـبـحـث عـن: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الـنـتـائـج: ${pins.length}
│
│ 👑 *اخـتـر صـورة مـن الـقـائـمـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    // ═══════════ قائمة الاختيار ═══════════
    const sections = [{
      title: `📸 نـتـائـج: ${text}`,
      rows: pins.map((pin, i) => ({
        title: `📸 صورة رقم ${i + 1}`,
        description: "اضغط لعرض الصورة",
        id: `.عرض_صوره ${pin.image}|${i + 1}`
      }))
    }];

    // ═══════════ إرسال بأزرار ButtonV2 ═══════════
    await new ButtonV2(conn)
      .setBody(caption)
      .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
      .setThumbnail(pins[0]?.image || 'https://files.catbox.moe/kahw8j.jpg')
      .addRawButton({
        buttonText: { displayText: '🖼️ اخـتـر صـورة' },
        buttonId: 'pinterest_select',
        type: 1,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: '🖼️ اخـتـر صـورة لـلـعـرض',
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

  } catch (err) {
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-بنترست]', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
    conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـدث خـطـأ فـي جـلـب الـصـور!*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  }
};

handler.help = ['بنترست (كلمة بحث)'];
handler.tags = ['downloads'];
handler.command = /^(بنترست|بينترست|pinterest|عرض_صوره)$/i;

export default handler;