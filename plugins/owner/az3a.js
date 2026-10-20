let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);
    if (!m.quoted) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ اذاعه (بالرد على رسالة)*\n*│*\n\n📝 *قم بالرد على الرسالة اللي عايز تبعتلها لكل المجموعات*`, m);
    
    // جلب كل المجموعات
    let groups = Object.entries(global.db.data.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && !chat?.isBanned)
        .map(([jid]) => jid);
    
    if (groups.length === 0) return conn.reply(m.chat, '📭 *لا توجد مجموعات متاحة!*', m);

    // رسالة جاري الإرسال
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n📢 *جاري الإرسال إلى ${groups.length} مجموعة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    let success = 0;
    let failed = 0;

    for (let jid of groups) {
        try {
            // إعادة توجيه الرسالة المقتَبسة
            await conn.sendMessage(jid, { 
                forward: m.quoted
            });
            success++;
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            failed++;
            console.error(`فشل الإرسال لـ ${jid}:`, e.message);
        }
    }

    // حذف رسالة التحميل
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📢 *تـم الانـتـهـاء مـن الإذاعـة*

✅ *ناجح:* ${success} مجموعة
❌ *فاشل:* ${failed} مجموعة

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.help = ['اذاعه (بالرد على رسالة)'];
handler.tags = ['owner'];
handler.command = /^(اذاعه|اذاعة|broadcast)$/i;
handler.owner = true;

export default handler;