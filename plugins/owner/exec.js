import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let handler = async (m, { conn, text, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ $ [أمر طرفية]*\n*│*\n\n*📌 مثال:*\n$ npm list\n$ ls\n$ pwd`, m);

    // رسالة جاري التنفيذ
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⚡ *جاري تنفيذ الأمر...*\n\n📥 \`${text.slice(0, 50)}${text.length > 50 ? '...' : ''}\`\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        let { stdout, stderr } = await execAsync(text, { 
            encoding: 'utf-8', 
            timeout: 25000,
            maxBuffer: 1024 * 1024 * 10 // 10MB
        });
        
        let result = stdout || stderr || '(لا يوجد مخرجات)';

        // حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
💻 *تـنـفـيـذ أمـر الـطـرفـيـة*

📥 *الأمر:* \`${text}\`

📤 *الناتج:*
\`\`\`${result.slice(0, 3000)}${result.length > 3000 ? '\n... تم اختصار الناتج' : ''}\`\`\`

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error('[exec] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        
        let errorMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
❌ *خـطـأ فـي الـتـنـفـيـذ*

📥 *الأمر:* \`${text}\`

❌ *الخطأ:*
${err.message.slice(0, 1000)}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: errorMsg,
            mentions: [m.sender]
        }, { quoted: m });
    }
};

handler.help = ['$ (أمر طرفية)'];
handler.tags = ['owner'];
handler.command = /^(\$|exec2|shell)$/i;
handler.owner = true;

export default handler;