import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: 'config/.env' });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, text }) => {
  if (!text?.trim()) {
    return conn.reply(
      m.chat,
      '❗ الاستخدام الصحيح:\n.بحث_تيك محمد رمضان',
      m
    );
  }

  const apiKey = process.env.SCAVIO_API_KEY;

  if (!apiKey) {
    return conn.reply(
      m.chat,
      '❌ مفتاح Scavio مش موجود في config/.env',
      m
    );
  }

  let loadingMsg;

  try {
    loadingMsg = await conn.sendMessage(
      m.chat,
      { text: `🔍 جاري البحث في TikTok عن "${text}"...` },
      { quoted: m }
    );

    const res = await fetch(
      'https://api.scavio.dev/api/v1/tiktok/search/videos',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: text.trim(),
          count: 5,
          cursor: '0'
        })
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error(
        '[بحث_تيك] Scavio:',
        res.status,
        JSON.stringify(result).slice(0, 500)
      );
      throw new Error(`Scavio HTTP ${res.status}`);
    }

    const data = result.data || {};
    const items = Array.isArray(data.search_item_list)
      ? data.search_item_list
      : [];

    const videos = items
      .map(entry => entry.aweme_info || entry)
      .filter(item => item.aweme_id || item.share_url);

    if (!videos.length) {
      await conn.sendMessage(
        m.chat,
        { text: `❌ مفيش نتائج لـ "${text}". جرّب كلمة بحث تانية.` },
        { quoted: m }
      );
      return;
    }

    const selected = videos.slice(0, 3).map(item => ({
      item,
      title: (item.desc || item.title || 'بدون عنوان').slice(0, 90),
      videoUrl:
        item.video?.play_addr?.url_list?.[0] ||
        item.video?.download_addr?.url_list?.[0] ||
        item.video?.play_addr?.url_list?.[1],
      shareUrl:
        item.share_url ||
        (item.aweme_id ? `https://www.tiktok.com/video/${item.aweme_id}` : '')
    }));

    const playable = selected.filter(v => v.videoUrl);
    const unavailable = selected.filter(v => !v.videoUrl);

    if (playable.length) {
      const album = await conn.sendMessage(
        m.chat,
        { album: { expectedVideoCount: playable.length } },
        { quoted: m }
      );

      for (let i = 0; i < playable.length; i++) {
        const v = playable[i];
        await conn.sendMessage(m.chat, {
          video: { url: v.videoUrl },
          caption: `🎬 ${i + 1}/${playable.length} • ${v.title}`,
          albumParentKey: album.key
        });
      }
    }

    for (const v of unavailable) {
      await conn.sendMessage(m.chat, {
        text: `🎬 ${v.title}${v.shareUrl ? `\\n${v.shareUrl}` : ''}`
      }, { quoted: m });
    }

  } catch (err) {
    console.error('[بحث_تيك] error:', err.message);

    await conn.reply(
      m.chat,
      '❌ حصل خطأ أثناء البحث أو إرسال النتائج. راجع سجل Termux.',
      m
    );
  } finally {
    if (loadingMsg?.key) {
      try {
        await conn.sendMessage(m.chat, {
          delete: loadingMsg.key
        });
      } catch {}
    }
  }
};

handler.help = ['بحث_تيك (كلمة)'];
handler.tags = ['search'];
handler.command = /^(بحث_تيك|تيك_بحث)$/i;

export default handler;
