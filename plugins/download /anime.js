// plugins/انمي.js - البحث عن الأنمي 📺
import { ButtonV2 } from '../core/NIXCODE.js'

const CHANNEL = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

let handler = async (m, { conn, text, command }) => {
  // 1. التحقق من وجود النص
  if (!text) return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *الاسـتـخـدام الـصـحـيـح:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ انمي [اسم الانمي بالإنجليزية]
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .انمي Naruto
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
  
  // ═══════════ البحث عن أنمي ═══════════
  if (command === "انمي") {
    // التحقق من الأحرف الإنجليزية
    if (!/^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)) {
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *يـرجـى كـتـابـة اسـم الأنـمـي*
│ 🩸 *بـالأحـرف الإنـجـلـيـزيـة فـقـط!*
│
│ ❄️ *مـثـال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .انمي Naruto
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }

    try {
      // استدعاء API
      let apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=10`;
      let res = await fetch(apiUrl);
      let data = await res.json();
      let results = data.data;

      if (!results || results.length === 0) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *لـم يـتـم الـعـثـور عـلـى نـتـائـج!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
      }

      // بناء أزرار الاختيار
      const sections = [{
        title: "📺 نـتـائـج الـبـحـث",
        rows: results.slice(0, 10).map((anime) => ({
          title: anime.title,
          description: `⭐ ${anime.score || 'N/A'} | 📅 ${anime.year || 'N/A'}`,
          id: `.انمي_معلومات ${anime.mal_id}`
        }))
      }];

      // نص الرسالة
      const caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *نـتـائـج الـبـحـث عـن:* "${text}"
│
│ ❄️ ═══════════════ ❄️
${results.slice(0, 5).map((a, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. ${a.title}
│    ⭐ ${a.score || 'N/A'} | 📅 ${a.year || 'N/A'}`).join('\n')}
│
│ 👑 *اخـتـر مـن الـقـائـمـة لـلـمـزيـد*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      const imageUrl = results[0]?.images?.jpg?.image_url || 'https://files.catbox.moe/p6jm0g.jpg';

      // إرسال الرسالة بأزرار ButtonV2
      await new ButtonV2(conn)
        .setBody(caption)
        .setFooter('❄️ 𝑴𝑨𝑿 𝑩𝑶𝑻 ❄️')
        .setThumbnail(imageUrl)
        .addRawButton({
          buttonText: { displayText: '🎬 اخـتـر الأنـمـي' },
          buttonId: 'anime_select',
          type: 1,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '🎬 اخـتـر الأنـمـي',
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

    } catch (e) {
      console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-انمي]', e);
      conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ فـي الـبـحـث!*
│ 🩸 ${e.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
  }
  
  // ═══════════ معلومات أنمي محدد ═══════════
  if (command === "انمي_معلومات") {
    if (!text) {
      return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *ايـدي الأنـمـي مـطـلـوب!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
    
    try {
      let apiUrl = `https://api.jikan.moe/v4/anime/${text}`;
      let res = await fetch(apiUrl);
      let data = await res.json();
      let anime = data.data;

      if (!anime) {
        return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *لـم يـتـم الـعـثـور عـلـى الـمـعـلـومـات!*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
      }

      const caption = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *${anime.title}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⭐ الـتـقـيـيـم: ${anime.score || 'N/A'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 📅 سـنـة الإصـدار: ${anime.year || 'N/A'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🎭 الـتـصـنـيـف: ${anime.genres?.map(g => g.name).join(', ') || 'غير محدد'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 📺 عـدد الـحـلـقـات: ${anime.episodes || 'غير محدد'}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ⏱️ مـدة الـحـلـقـة: ${anime.duration || 'غير محدد'}
│
│ ❄️ *الـقـصـة:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${anime.synopsis?.slice(0, 300) || 'لا يوجد وصف'}...
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ 🔗 الـرابـط: ${anime.url || ''}
│
│ 👑 *𝑴𝑨𝑿 𝑩𝑶𝑻*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

      await conn.sendMessage(m.chat, {
        image: { url: anime.images?.jpg?.large_image_url || 'https://files.catbox.moe/qeqajh.jpg' },
        caption: caption
      }, { quoted: m });
    } catch (e) {
      console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-انمي-معلومات]', e);
      conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـصـل خـطـأ فـي جـلـب الـمـعـلـومـات!*
│ 🩸 ${e.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
  }
};

handler.help = ['انمي (اسم)'];
handler.tags = ['downloads'];
handler.command = /^(انمي|انمي_معلومات)$/i;

export default handler;