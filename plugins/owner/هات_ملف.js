import fs from 'fs';
import path from 'path';

const pluginsDir = './plugins';

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (['node_modules', '.git', 'session', 'database', 'tmp'].includes(file)) continue;
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function findClosestMatch(input, options, maxDistance = 3) {
    let closest = null;
    let minDistance = Infinity;
    for (const option of options) {
        const distance = levenshteinDistance(input.toLowerCase(), option.toLowerCase());
        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            closest = option;
        }
    }
    return closest;
}

let handler = async (m, { conn, args, command, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    if (!fs.existsSync(pluginsDir)) {
        return conn.reply(m.chat, '❌ *مجلد plugins غير موجود.*', m);
    }

    const allFiles = getAllFiles(pluginsDir);
    const commandNames = allFiles.map(f => path.relative(pluginsDir, f).replace(/\\/g, '/').replace('.js', ''));

    if (!commandNames.length) {
        return conn.reply(m.chat, '❌ *لا يوجد أوامر في مجلد plugins.*', m);
    }

    const inputText = args.join(' ').trim();

    // القائمة التفاعلية
    if (!inputText) {
        const chunkSize = 20;
        const sections = [];

        for (let i = 0; i < commandNames.length; i += chunkSize) {
            const chunk = commandNames.slice(i, i + chunkSize);
            sections.push({
                title: `📂 PART ${sections.length + 1}`,
                rows: chunk.map(name => ({
                    header: "",
                    title: name,
                    description: `.${command} ${name}`,
                    id: `.${command} ${name}`
                }))
            });
        }

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📂 *قائمة أوامر plugins*

📊 *إجمالي الأوامر:* ${commandNames.length}

💡 *اختر أمر من القائمة لعرض الكود*

👑 *بواسطة:* @${m.sender.split('@')[0]}

➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, {
            text: msg,
            mentions: [m.sender],
            footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
            headerType: 'DOCUMENT',
            interactiveButtons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: '📂 اختر الأمر',
                        sections
                    })
                }
            ]
        }, { quoted: m });
        return;
    }

    // إرسال الكود بنفس طريقة الكود الأساسي الأصلي
    let selectedCommand = '';

    if (/^\d+$/.test(inputText)) {
        const index = parseInt(inputText) - 1;
        if (index >= 0 && index < commandNames.length) {
            selectedCommand = commandNames[index];
        } else {
            return conn.reply(m.chat, `⚠️ *الرقم غير صحيح!* بين 1 و ${commandNames.length}`, m);
        }
    } else {
        if (commandNames.includes(inputText)) {
            selectedCommand = inputText;
        } else {
            let found = commandNames.find(c => c.endsWith('/' + inputText) || c.endsWith(inputText) || c.includes(inputText));
            if (found) {
                selectedCommand = found;
            } else {
                const closestMatch = findClosestMatch(inputText, commandNames);
                let replyMsg = `⚠️ *الأمر "${inputText}" غير موجود!*`;
                if (closestMatch) replyMsg += `\n🔎 *ربما تقصد:* ${closestMatch}`;
                replyMsg += `\n\n📂 *أرسل .${command} لعرض القائمة.*`;
                return conn.reply(m.chat, replyMsg, m);
            }
        }
    }

    try {
        const filePath = allFiles[commandNames.indexOf(selectedCommand)];
        const code = fs.readFileSync(filePath, 'utf-8');
        const codeLines = code.split('\n');
        const fileSize = (code.length / 1024).toFixed(2);

        // ✅ نفس طريقة الكود الأساسي الأصلي
        const codeBlocks = codeLines.map(line => {
            let highlightType = 1;
            if (line.trim().startsWith('//') || line.trim().startsWith('/*')) highlightType = 2;
            else if (line.trim().startsWith('import')) highlightType = 3;
            else if (line.trim().startsWith('export') || line.trim().startsWith('handler')) highlightType = 4;
            return {
                highlightType: Math.min(highlightType, 4),
                codeContent: line + '\n'
            };
        });

        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [
                    {
                        messageType: 2,
                        messageText: `\n📄 *${path.basename(filePath)}*\n📦 الحجم: ${fileSize} KB\n✏️ ${codeLines.length} سطر\n`
                    },
                    {
                        messageType: 5,
                        codeMetadata: {
                            codeLanguage: 'javascript',
                            codeBlocks
                        }
                    }
                ],
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1,
                    forwardedAiBotMessageInfo: {
                        botJid: '867051314767696@bot'
                    },
                    forwardOrigin: 4
                }
            }
        };

        const { generateWAMessageFromContent, generateMessageIDV2 } = await import('@whiskeysockets/baileys');

        const msg = await generateWAMessageFromContent(m.chat, {
            botForwardedMessage: { message: richMessage }
        }, {
            senderId: conn.user.id,
            userJid: conn.user.id,
            messageId: generateMessageIDV2(conn.user.id),
            quoted: m
        });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error('[هات] error:', err.message);
        conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
    }
};

handler.help = ['هات (اسم الأمر)'];
handler.tags = ['owner'];
handler.command = /^(هات|جلب|get)$/i;
handler.owner = true;

export default handler;