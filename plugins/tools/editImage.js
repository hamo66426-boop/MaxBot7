import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

const client = axios.create({
  baseURL: 'https://emam-api-test.vercel.app/home/sections/Tools/api/imageEditPro'
});

const validRatios = ["1:1", "16:9", "3:2", "2:3", "4:5", "5:4", "9:16", "3:4", "4:3", "custom"];
const MAX_SIZE = 30 * 1024 * 1024;

async function uploadToImgbb(buffer, signal) {
  let formData = new FormData();
  formData.append('source', buffer, { filename: `image-${Date.now()}.jpg` });
  formData.append('type', 'file');
  formData.append('action', 'upload');

  let config = {
    method: 'POST',
    url: 'https://imgbb.com/json',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://imgbb.com/',
      'Origin': 'https://imgbb.com',
      ...formData.getHeaders()
    },
    data: formData,
    signal
  };

  let { data: response } = await axios.request(config);
  return response.image.url;
}

async function convertWebpToJpeg(buffer) {
  return await sharp(buffer).jpeg().toBuffer();
}

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ تعديل [الوصف] | [النسبة]*\n*│*\n\n*📌 مثال:*\n.تعديل اجعل لون البشرة اسود|1:1\n\n*النسب المتاحة:* ${validRatios.join(', ')}`, m);
  
  if (!m.quoted || !(m.quoted.msg || m.quoted).mimetype?.includes('image')) {
    return conn.reply(m.chat, '🖼️ *يرجى الرد على صورة لتعديلها!*', m);
  }

  // رسالة جاري المعالجة
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🎨 *جاري تعديل الصورة...*\n\n⏳ *قد تستغرق دقيقة أو أكثر*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let controller = new AbortController();
    let timeout = setTimeout(() => controller.abort(), 130000);
    
    let [prompt, size] = text.split('|');
    if (!prompt) prompt = text;

    let buffer = await m.quoted.download();

    if (buffer.length > MAX_SIZE) {
      throw new Error('حجم الصورة تجاوز الحد المسموح (30MB)');
    }

    if ((m.quoted.msg || m.quoted).mimetype === 'image/webp') {
      buffer = await convertWebpToJpeg(buffer);
    }

    let imageUrl = await uploadToImgbb(buffer, controller.signal);

    let payload = {
      prompt: prompt,
      image: [imageUrl]
    };

    if (size && validRatios.includes(size)) payload.size = size;

    let createRes = await client.post('/process-image', payload, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });

    let { status, recordId, message } = createRes.data;

    if (!status || !recordId) {
      throw new Error(message || 'Failed to start processing');
    }

    let result = null;
    let error = null;
    let maxRetries = 40;
    let retries = 0;

    while (!result && !error && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      retries++;

      let getRes = await client.get(`/check-result?rid=${recordId}`, {
        responseType: 'arraybuffer',
        signal: controller.signal
      });

      let contentType = getRes.headers['content-type'];

      if (contentType?.includes('application/json')) {
        let jsonData = JSON.parse(Buffer.from(getRes.data).toString('utf-8'));
        if (jsonData.status === false && jsonData.message !== 'Processing not completed yet') {
          error = jsonData.message;
          break;
        }
      } else if (contentType?.includes('image')) {
        result = getRes.data;
        break;
      }
    }

    if (retries >= maxRetries) throw new Error('Max retries reached, no result');
    if (error) throw new Error(error);
    if (!result) throw new Error('No result obtained');

    clearTimeout(timeout);

    // حذف رسالة التحميل
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تعديل الصورة بنجاح*

📝 *الوصف:* ${prompt}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, {
      image: result,
      caption: msg,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (err) {
    console.error('[تعديل] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
  }
};

handler.help = ['تعديل (بالرد على صورة)'];
handler.tags = ['tools'];
handler.command = /^(تعديل|editimage)$/i;

export default handler;