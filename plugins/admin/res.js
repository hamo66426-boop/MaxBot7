// plugins/الطلبات.js - قائمة طلبات الانضمام 📥
let handler = async (m, { conn, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    try {
        // 2. جلب طلبات الانضمام المعلقة
        let req = await conn.groupRequestParticipantsList(m.chat);
        
        // 3. لو مفيش طلبات
        if (!req || req.length === 0) {
            return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *مـفـيـش طـلـبـات انـضـمـام مـعـلـقـة حـالـيـاً*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
        }

        // 4. تجهيز قائمة الطلبات (مع فلترة القيم الفارغة)
        let validRequests = req.filter(r => r.jid || r.phone_number);

        if (validRequests.length === 0) {
            return conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *مـفـيـش طـلـبـات صـالـحـة*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
        }

        let text = validRequests.map((r, i) => {
            let id = r.jid || r.phone_number;
            return `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}- @${id.split('@')[0]}`;
        }).join("\n");

        // 5. إرسال القائمة بمنشن لأصحاب الطلبات فقط
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❄️ *قـائـمـة طـلـبـات الانـضـمـام*
│
│ ❄️ ═══════════════ ❄️
${text}
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الـطـلـبـات: ${validRequests.length}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        // 6. المنشن لأصحاب الطلبات فقط
        let mentions = validRequests.map(r => r.jid || r.phone_number);

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: mentions
        }, { quoted: m });

    } catch (err) {
        console.error('[꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂-الطلبات]', err);
        conn.reply(m.chat, `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ ❌ *حـدث خـطـأ فـي جـلـب الـطـلـبـات!*
│ 🩸 ${err.message}
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`, m);
    }
}

handler.help = ['الريكوستات', 'الطلبات'];
handler.tags = ['admin'];
handler.command = /^(الريكوستات|الطلبات|طلبات|requests)$/i;
handler.group = true;
handler.admin = true;

export default handler;