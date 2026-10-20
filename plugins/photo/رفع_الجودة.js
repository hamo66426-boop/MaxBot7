import fetch from 'node-fetch';
import FormData from 'form-data';

// ✅ تخزين آخر صورة لكل مستخدم
let lastImage = {};

const uploadToUguu = async (buffer, ext) => {
  let form = new FormData();
  form.append('files[]', buffer, `file.${ext}`);
  let res = await fetch('https://uguu.se/upload.php', { method: 'POST', body: form });
  let result = await res.json();
  if (!result.files || result.files.length === 0) throw new Error('فشل في رفع الملف');
  return result.files[0].url;
};

const enhanceImage = async (imageUrl, action, method, size) => {
  let params = { imageUrl, action };
  if (action === 'ihancer') { params.method = method || 3; params.size = size || 'high'; }
  let res = await fetch(`https://engez.a7a.online/api/v1/tools/image-enhance?${new URLSearchParams(params)}`);
  let contentType = res.headers.get('content-type') || '';
  if (contentType.includes('image')) {
    return { success: true, isBuffer: true, imageBuffer: Buffer.from(await res.arrayBuffer()) };
  } else {
    let data = await res.json();
    if (data?.success && data?.response?.url) {
      return { success: true, enhancedUrl: data.response.url, size: data.response.size, isBuffer: false };
    }
    throw new Error(JSON.stringify(data || 'فشل في تحسين الصورة'));
  }
};

let handler = async (m, { conn, args, command, text }) => {
  // ✅ دمج كل النصوص الممكنة
  let fullText = (text || '').trim().toLowerCase();
  
  // ✅ استخراج الجودة من النص كله
  let quality = '';
  if (fullText.includes('sd')) quality = 'sd';
  else if (fullText.includes('hd')) quality = 'hd';
  else if (fullText.includes('fhd')) quality = 'fhd';
  else if (fullText.includes('4k')) quality = '4k';
  else quality = (args[0] || '').toLowerCase().trim();

  // ✅ لو فيه جودة صالحة - استخدم آخر صورة محفوظة
  if (['sd', 'hd', 'fhd', '4k'].includes(quality)) {
    let savedImage = lastImage[m.sender];
    
    if (!savedImage) {
      return conn.reply(m.chat, `🖼️ *يرجى إرسال صورة أولاً ثم اختيار الجودة*\n\n📸 *أرسل صورة* ➜ *.${command}* ➜ *اختر الجودة*`, m);
    }

    // التحقق من أن الصورة لسه صالحة (أقل من 5 دقائق)
    if (Date.now() - savedImage.time > 300000) {
      delete lastImage[m.sender];
      return conn.reply(m.chat, '⏰ *انتهت صلاحية الصورة*\n📸 *أرسل صورة جديدة وحاول مرة أخرى*', m);
    }

    let config = getQualityConfig(quality);
    await processEnhance(m, conn, savedImage.buffer, config);
    return;
  }

  // ✅ لو في صورة مقتَبسة أو مع الرسالة - خزنها
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (/image/.test(mime)) {
    try {
      let buffer = await q.download();
      lastImage[m.sender] = { buffer, time: Date.now() };
    } catch(e) {}
  }

  // ✅ القائمة التفاعلية
  let sections = [{
    title: "🎯 اختر جودة التحسين",
    rows: [
      { header: "", title: "📊 SD - جودة منخفضة", description: "تحسين سريع", id: `.${command} sd` },
      { header: "", title: "📊 HD - جودة متوسطة", description: "تحسين متوسط", id: `.${command} hd` },
      { header: "", title: "📊 FHD - جودة عالية", description: "تحسين عالي", id: `.${command} fhd` },
      { header: "", title: "🌟 4K - جودة فائقة", description: "أعلى جودة", id: `.${command} 4k` }
    ]
  }];

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🖼️ *تحسين جودة الصورة*

📸 *أرسل صورة* ➜ *.${command}* ➜ *اختر الجودة*

🎯 *اختر الجودة المناسبة من القائمة*

💡 *أو استخدم مباشرة مع الصورة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} 4k (بالرد على صورة)

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, {
    text: msg,
    footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
    headerType: 'DOCUMENT',
    interactiveButtons: [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "اختر جودة التحسين 🎯",
          sections: sections
        })
      }
    ]
  }, { quoted: m });
};

function getQualityConfig(quality) {
  let configs = {
    'sd': { action: 'ihancer', method: Math.floor(Math.random() * 4) + 1, size: 'low', label: 'SD' },
    'hd': { action: 'ihancer', method: Math.floor(Math.random() * 4) + 1, size: 'medium', label: 'HD' },
    'fhd': { action: 'ihancer', method: Math.floor(Math.random() * 4) + 1, size: 'high', label: 'FHD' },
    '4k': { action: 'jpghd', method: null, size: null, label: '4K' }
  };
  return configs[quality] || null;
}

async function processEnhance(m, conn, buffer, config) {
  let loadingMsg = await conn.sendMessage(m.chat, { 
    text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري تحسين الصورة...*\n\n🎯 *الجودة:* ${config.label}\n⏱️ *قد تستغرق 20-60 ثانية*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
  }, { quoted: m });

  try {
    let imageUrl = await uploadToUguu(buffer, 'jpg');
    if (!imageUrl) throw new Error('فشل رفع الصورة');
    let result = await enhanceImage(imageUrl, config.action, config.method, config.size);

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *تم تحسين الصورة بنجاح*

🎯 *الجودة:* ${config.label}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    if (result.isBuffer) {
      await conn.sendMessage(m.chat, { image: result.imageBuffer, caption: msg }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { image: { url: result.enhancedUrl }, caption: msg }, { quoted: m });
    }

  } catch (err) {
    console.error('[رفع_الجودة] error:', err.message);
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
    conn.reply(m.chat, `❌ *فشل تحسين الصورة:* ${err.message}`, m);
  }
}

handler.help = ['رفع_الجودة (بالرد على صورة)'];
handler.tags = ['images'];
handler.command = /^(رفع_الجودة|enhance|جودة)$/i;

export default handler;