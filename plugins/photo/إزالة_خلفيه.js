import axios from 'axios';
import FormData from 'form-data';

const removalAi = {
  cookies: {},

  headers: {
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36',
    'accept-language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
  },

  saveCookies(res) {
    try {
      let setCookies = res.headers['set-cookie'] || res.headers.get('set-cookie') || [];
      if (!Array.isArray(setCookies)) setCookies = [setCookies];
      
      for (let item of setCookies) {
        if (!item || typeof item !== 'string') continue;
        let [pair] = item.split(';');
        let [key, ...val] = pair.split('=');
        if (key && val.length) {
          this.cookies[key.trim()] = val.join('=').trim();
        }
      }
    } catch(e) {}
  },

  getCookieHeader() {
    return Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
  },

  async getSecurity() {
    let headers = {
      ...this.headers,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    };
    let cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;

    let res = await axios.get('https://removal.ai/', { headers });
    this.saveCookies(res);

    let html = res.data;
    let match = html.match(/var\s+ajax_upload_object\s*=\s*(\{[\s\S]*?\});/);
    if (!match) throw new Error('ajax_upload_object not found');
    return Function(`return (${match[1]})`)().security;
  },

  async getWebToken(security) {
    let headers = {
      ...this.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Referer': 'https://removal.ai/upload/',
    };
    let cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;

    let res = await axios.get(`https://removal.ai/wp-admin/admin-ajax.php?action=ajax_get_webtoken&security=${security}`, { headers });
    this.saveCookies(res);

    if (!res.data.success) throw new Error(JSON.stringify(res.data));
    return res.data.data.webtoken;
  },

  async removeBackground(buffer) {
    let security = await this.getSecurity();
    let token = await this.getWebToken(security);

    let form = new FormData();
    form.append('image_file', buffer, { filename: 'image.png', contentType: 'image/png' });

    let headers = {
      ...this.headers,
      'web-token': token,
      'accept': '*/*',
      'origin': 'https://removal.ai',
    };
    let cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;
    headers = { ...headers, ...form.getHeaders() };

    let res = await axios.post('https://api.removal.ai/3.0/remove', form, { headers });
    this.saveCookies(res);

    return res.data;
  }
};

// ✅ تشتغل بالرد + بالصورة اللي معاها تعليق + بالأمر المباشر
let handler = async (m, { conn, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  // لو مفيش صورة خالص
  if (!mime.includes('image')) {
    return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} (بالرد على صورة)*\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} (الصورة مع تعليق)*\n*│*\n\n🖼️ *ازالة خلفية الصورة*`, m);
  }

  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🎨 *جاري إزالة خلفية الصورة...*\n\n⏳ *قد تستغرق 10-30 ثانية*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let buffer = await q.download();
    let result = await removalAi.removeBackground(buffer);

    if (!result.url && !result.preview_demo) {
      throw new Error('فشل إزالة الخلفية');
    }

    let imageUrl = result.url || result.preview_demo || result.original;

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم إزالة الخلفية بنجاح*

🖼️ *➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑*

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: msg
    }, { quoted: m });

  } catch (err) {
    console.error('[ازالة_الخلفية] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
  }
};

handler.help = ['ازالة_الخلفية (بالرد على صورة/الصورة مع تعليق)'];
handler.tags = ['images'];
handler.command = /^(ازالة_الخلفية|removebg|نزع_الخلفية)$/i;

export default handler;