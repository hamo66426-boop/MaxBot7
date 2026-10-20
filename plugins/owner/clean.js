import { execSync } from "child_process";

let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    // رسالة جاري التنظيف
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🧹 *جاري تنظيف ملفات الجلسة...*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let result = execSync(
            'files=$(ls session/pre-key-* session/device-list-* 2>/dev/null | wc -l); rm -rf session/pre-key-* session/device-list-* 2>/dev/null; echo "$files"',
            { encoding: 'utf-8' }
        );
        
        let count = parseInt(result.trim()) || 0;

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🧹 *تـم الـتـنـظـيـف بـنـجـاح*

🗑️ *تم حذف:* ${count} ملف
📁 *ملفات الجلسة المؤقتة*

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[تنظيف] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
    }
};

handler.help = ['تنظيف'];
handler.tags = ['owner'];
handler.command = /^(تنظيف|clean)$/i;
handler.owner = true;

export default handler;