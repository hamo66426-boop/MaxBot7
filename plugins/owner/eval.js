import { createRequire } from 'module';
import { format } from 'util';

let handler = async (m, { conn, text, command, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let codeText = text ? text.trim() : '';

    if (!codeText) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n│\n*├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${command} [كود الجافاسكريبت]*\n*│*\n\n*📌 مثال:*\n${command} m.sender`, m);

    try {
        let require = createRequire(import.meta.url);
        let AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        let vars = {
            conn,
            m,
            reply: (t) => conn.reply(m.chat, t, m),
            print: (...args) => conn.reply(m.chat, format(...args), m),
            require,
            process,
        };

        let processedCode = command === '=>' ? `return (${codeText})` : codeText;

        let executeCode = new AsyncFunction(...Object.keys(vars), processedCode);
        let result = await executeCode(...Object.values(vars));

        if (result !== undefined) {
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
💻 *تـنـفـيـذ الـكـود*

📥 *المدخلات:* \`${codeText.slice(0, 100)}${codeText.length > 100 ? '...' : ''}\`

📤 *الناتج:*
${format(result)}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

            await conn.sendMessage(m.chat, { 
                text: msg,
                mentions: [m.sender]
            }, { quoted: m });
        }
    } catch (err) {
        let errorMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
❌ *خـطـأ فـي الـكـود*

📥 *المدخلات:* \`${codeText.slice(0, 100)}${codeText.length > 100 ? '...' : ''}\`

❌ *الخطأ:*
${err.message || err.stack || err}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: errorMsg,
            mentions: [m.sender]
        }, { quoted: m });
    }
};

handler.help = ['>', '=>'];
handler.tags = ['owner'];
handler.command = /^(>|=>|exec|eval)$/i;
handler.owner = true;

export default handler;