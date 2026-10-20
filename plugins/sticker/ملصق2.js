import fetch from 'node-fetch';
import { Sticker } from 'wa-sticker-formatter';

// ✅ بحث مباشر في Pinterest بدون API خارجي
async function searchPinterestDirect(query) {
  try {
    let url = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=${Date.now()}`;
    
    let res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://www.pinterest.com/',
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    
    let data = await res.json();
    let results = data?.resource_response?.data?.results || [];
    
    let images = results
      .filter(r => r.images?.orig?.url)
      .map(r => r.images.orig.url);
    
    return images.slice(0, 5);
  } catch(e) {
    return [];
  }
}

// ✅ بحث في Google Images
async function searchGoogleImages(query) {
  try {
    // استخدام API مجاني
    let url = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=10295e38d9f78419a&searchType=image&key=AIzaSyD7UqMqIOr48vQKgj4B5LKYjTJ_nEoFVZI`;
    let res = await fetch(url);
    let data = await res.json();
    
    if (data.items?.length > 0) {
      return data.items.map(i => i.link).slice(0, 5);
    }
  } catch(e) {}
  
  return [];
}

// ✅ بحث في Wallhaven (صور عالية الجودة)
async function searchWallhaven(query) {
  try {
    let url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&purity=100`;
    let res = await fetch(url);
    let data = await res.json();
    
    if (data.data?.length > 0) {
      return data.data.map(i => i.path).slice(0, 5);
    }
  } catch(e) {}
  
  return [];
}

// ✅ بحث بسيط باستخدام DuckDuckGo
async function searchDuckDuckGo(query) {
  try {
    let url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    let res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    let html = await res.text();
    
    // استخراج VQD
    let vqdMatch = html.match(/vqd=([\d-]+)/);
    if (!vqdMatch) return [];
    
    let vqd = vqdMatch[1];
    let apiUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&o=json&f=,,,&p=1`;
    let apiRes = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://duckduckgo.com/' }
    });
    let apiData = await apiRes.json();
    
    return (apiData.results || []).map(r => r.image).filter(Boolean).slice(0, 5);
  } catch(e) {}
  
  return [];
}

async function createSticker(buffer) {
  let sticker = new Sticker(buffer, {
    pack: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
    author: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
    type: 'full',
    quality: 60,
    background: '#00000000'
  });
  return await sticker.toBuffer();
}

let handler = async (m, { conn, command, text }) => {
  if (!text) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [كلمة البحث]*\n*│*\n\n*📌 مثال:*\n${command} انمي\n${command} كوره`, m);
  }

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🔍 *جاري البحث عن "${text}"...*\n\n🔄 *جاري تجربة 4 مصادر...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let images = [];
    let usedEngine = '';

    // ✅ نجرب كل المصادر بالترتيب
    let sources = [
      { name: 'Pinterest', fn: () => searchPinterestDirect(text) },
      { name: 'DuckDuckGo', fn: () => searchDuckDuckGo(text) },
      { name: 'Google', fn: () => searchGoogleImages(text) },
      { name: 'Wallhaven', fn: () => searchWallhaven(text) }
    ];

    for (let source of sources) {
      images = await source.fn();
      if (images.length > 0) {
        usedEngine = source.name;
        break;
      }
    }

    if (images.length === 0) {
      await conn.sendMessage(m.chat, { delete: loadingMsg.key });
      return conn.reply(m.chat, `❌ *لم أجد صور لـ "${text}"*\n\n💡 *جرب:*\n- كتابة كلمة بالإنجليزية\n- كلمة بحث مختلفة`, m);
    }

    await conn.sendMessage(m.chat, { 
      text: `✅ *تم العثور على ${images.length} صور*\n📊 *المصدر:* ${usedEngine}\n⏳ *جاري التحويل لملصقات...*`,
      edit: loadingMsg.key 
    }).catch(() => {});

    let successCount = 0;
    for (let url of images) {
      try {
        let imgRes = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        let buffer = Buffer.from(await imgRes.arrayBuffer());
        
        let stickerBuffer = await createSticker(buffer);
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        successCount++;
        await new Promise(r => setTimeout(r, 800));
      } catch (err) {
        console.error(`فشل: ${url.slice(0, 50)}`, err.message);
      }
    }

    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}

    if (successCount > 0) {
      let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم إرسال ${successCount} ملصق بنجاح*

🔍 *البحث:* ${text}
📊 *المصدر:* ${usedEngine}

💡 *اكتب .${command} للبحث مرة أخرى*

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    } else {
      conn.reply(m.chat, '❌ *فشل تحويل الصور إلى ملصقات!*', m);
    }

  } catch (err) {
    console.error('[ملصقات] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, '❌ *حدث خطأ، حاول لاحقاً.*', m);
  }
};

handler.help = ['ملصقات (كلمة بحث)'];
handler.tags = ['sticker'];
handler.command = /^(ملصقات|ستيكرات)$/i;

export default handler;