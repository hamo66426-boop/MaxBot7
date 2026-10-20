let handler = m => m;

let lastReply = null;

handler.before = async function (m, { conn, isOwner, isROwner }) {
    if (!m.text) return false;

    let txt = m.text.trim();
    if (txt !== "بوتي") return false;

    const ownerMsg = `🍻🥂 *موجود يعم وربنا 🥂🍻*

ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
*انت المالك بتاعي ي قلبي 🍻🥂*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

*اوامرني وبوتك ينفذ 🥂🍻*

[𝑯𝑨𝑴𝑶]

𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ી ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    const commonReplies = [
        'نعسان محدش يصحيني🙄😴',
        'شوفلك كلبهه'
    ];

    const replies = [...commonReplies];
    if (isROwner) replies.push('عيونو 😍❤️');

    if (isOwner || isROwner) replies.push(ownerMsg);
    else replies.push(`   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
*بس ي خول انت ع الصبح بطل بعبصه 🍻🥂*
𓉘᳟ી ⃞̸͢𑁃 ̚𓉝᳟ી ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꯭๋┄꯭๋━┄꯭๋━┄꫶︦╯`);

    if (isROwner) replies.push('قلب بوتكك من جواا ❤️ 🫶');

    let available = replies.filter(reply => reply !== lastReply);
    if (!available.length) available = replies;

    let chosen = available[Math.floor(Math.random() * available.length)];
    lastReply = chosen;

    await m.reply(chosen);
    return true;
};

export default handler;
