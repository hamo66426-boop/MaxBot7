import axios from 'axios';

const STYLES = {
    'انيمي': { suffix: 'anime style, studio ghibli, detailed anime art', emoji: '🌸' },
    'كرتون': { suffix: 'cartoon style, pixar, vibrant colors', emoji: '🎨' },
    'زيتي': { suffix: 'oil painting, classical art, rich textures', emoji: '🖼️' },
    'رسم_رصاص': { suffix: 'pencil sketch, black and white, detailed drawing', emoji: '✏️' },
    'ماء': { suffix: 'watercolor painting, soft colors, artistic', emoji: '💧' },
    'ثلاثي': { suffix: '3D render, hyperrealistic, cinema 4D, octane render', emoji: '🎭' },
    'فانتازيا': { suffix: 'fantasy art, magical, epic, concept art', emoji: '🔮' },
    'سايبر': { suffix: 'cyberpunk, neon lights, futuristic, dark atmosphere', emoji: '🌆' },
    'قديم': { suffix: 'vintage, retro, old photo style, sepia', emoji: '📷' },
    'ابيض_اسود': { suffix: 'black and white, monochrome, artistic photography', emoji: '⬛' }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        let styleList = Object.keys(STYLES).map(s => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} ${s} [وصف]`).join('\n');
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎨 *أداة الرسم بالذكاء الاصطناعي*

📝 *الاستخدام:*
${usedPrefix}${command} [النمط] [الوصف]

🎭 *الأنماط المتاحة:*
${styleList}

📌 *مثال:*
${usedPrefix}${command} انيمي قطة لطيفة

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        return conn.reply(m.chat, msg, m);
    }

    let parts = text.trim().split(/\s+/);
    let firstWord = parts[0]?.toLowerCase();
    let style = STYLES[firstWord];
    let prompt;

    if (style) {
        prompt = parts.slice(1).join(' ');
        if (!prompt) {
            return conn.reply(m.chat, `⚠️ *اكتب الوصف بعد النمط.*\n📌 *مثال:* ${usedPrefix}${command} ${firstWord} قطة لطيفة`, m);
        }
    } else {
        style = { suffix: 'detailed, high quality', emoji: '🎨' };
        prompt = text.trim();
    }

    // رسالة جاري الرسم
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🎨 *جاري الرسم...*\n\n🖌️ *النمط:* ${firstWord || 'عادي'} ${style.emoji}\n📝 *الوصف:* ${prompt.slice(0, 40)}...\n\n⏳ *قد تستغرق 10-20 ثانية*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let englishText = prompt;
        try {
            let trRes = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(prompt)}`,
                { timeout: 8000 }
            );
            let translated = trRes.data?.[0]?.map(x => x?.[0]).filter(Boolean).join('') || prompt;
            if (translated) englishText = translated;
        } catch {}

        let fullPrompt = `${englishText}, ${style.suffix}, high quality, highly detailed`;
        let encoded = encodeURIComponent(fullPrompt);
        
        let imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true`;

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🎨 *تـم الـرسـم بـنـجـاح!*

🖌️ *النمط:* ${firstWord || 'عادي'} ${style.emoji}
📝 *الوصف:* ${prompt}

🔮 *Powered By 𝑴𝑨𝑿 𝑩𝑶𝑻*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.error('[ارسم] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `❌ *حدث خطأ أثناء الرسم:* ${err.message}`, m);
    }
};

handler.help = ['ارسم [نمط] [وصف]'];
handler.tags = ['images'];
handler.command = /^(ارسم|فن|art|draw)$/i;

export default handler;