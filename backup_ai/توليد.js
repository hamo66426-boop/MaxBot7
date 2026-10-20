// plugins/imagine.js
// ✧ 𝑴𝑨𝑿 𝑩𝑶𝑻 - توليد الصور بالذكاء الاصطناعي 🎨

import axios from 'axios'
import { join } from 'path'
import { tmpdir } from 'os'
import { createWriteStream, unlinkSync, statSync } from 'fs'
import { pipeline } from 'stream/promises'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = async (emoji) => {
    try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
  }

  // 1. التحقق من وجود النص
  if (!text) {
    await react('❌')
    return m.reply(`𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎨 *2B - تـولـيـد الـصـور*
│
│ ❄️ ═══════════════ ❄️
│ ❄️ *الاسـتـخـدام:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${usedPrefix}${command} [وصف الصورة]
│
│ ❄️ *أمـثـلـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ قطة لطيفة في حديقة
├ׁ̟̇˚₊· ͟͟͞͞➳❥ غروب الشمس على البحر
├ׁ̟̇˚₊· ͟͟͞͞➳❥ مدينة مستقبلية
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`)
  }

  await react('🎨')
  
  // 2. رسالة جاري التوليد
  await m.reply(`   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🎨 *2B تـولـد الـصـورة...*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⏳ انـتـظـر قـلـيـلاً...
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`)

  let filePath = null

  try {
    // 3. ترجمة للإنجليزية
    let englishText = text
    try {
      const trRes = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`,
        { timeout: 8000 }
      )
      const translated = trRes.data?.[0]?.map(x => x?.[0]).filter(Boolean).join('') || text
      if (translated) englishText = translated
    } catch { englishText = text }

    // 4. بناء الـ prompt
    const fullPrompt = `${englishText}, high quality, highly detailed`
    const encoded = encodeURIComponent(fullPrompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true`

    // 5. تحميل الصورة
    filePath = join(tmpdir(), `2b_img_${Date.now()}.jpg`)
    const imgRes = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 120000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    await pipeline(imgRes.data, createWriteStream(filePath))

    // 6. التحقق من حجم الصورة
    const size = statSync(filePath).size
    if (size < 5000) {
      try { unlinkSync(filePath) } catch {}
      throw new Error('فشل توليد الصورة — جرب وصف مختلف')
    }

    // 7. إرسال الصورة
    await conn.sendMessage(m.chat, {
      image: { url: filePath },
      caption: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *2B - تـم تـولـيـد الـصـورة*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـوصـف: ${text}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـجـم: ${(size / 1024).toFixed(2)} KB
│
│ 👑 *Powered by 𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m })

    await react('✅')

  } catch (err) {
    await react('❌')
    console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-Imagine] Error:', err.message)
    m.reply(`𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *2B - فـشـل الـتـولـيـد*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${err.message}
│
│ 🩸 *جـرب وصـف مـخـتـلـف*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`)
  } finally {
    // ✅ تنظيف الملف المؤقت
    if (filePath) {
      try { unlinkSync(filePath) } catch {}
    }
  }
}

handler.help    = ['صورة', 'image']
handler.tags    = ['ai']
handler.command = /^(صورة|صوره|توليد|imagine|img|imag)$/i

export default handler