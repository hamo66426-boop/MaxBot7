// plugins/كود.js - بحث وقراءة الأكواد 📄
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const FOOTER = '❄️ 2B - YoRHa Unit No.2 Type B ❄️'
const IMAGE_URL = 'https://file.garden/aauvg01sjleV_ic1/download%20(5).jpg'

const HEADER = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝐘𝐨𝐑𝐇𝐚· ͟͟͞͞➳ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂`
const LINE_DIV = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤`
const FOOT_DIV = `𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`

const findFiles = (base, query) => {
    let results = [];
    let search = (dir) => {
        if (!fs.existsSync(dir)) return;

        for (let item of fs.readdirSync(dir)) {
            let fullPath = path.join(dir, item);

            try {
                let stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (['node_modules', '.git', 'session', 'database', 'tmp', '2BSession', '2BSubBot', 'BackupSession'].includes(item)) continue;
                    search(fullPath);
                } else if (item.endsWith('.js')) {
                    let qLower = query.toLowerCase();
                    let matched = false;

                    if (item.toLowerCase().includes(qLower)) {
                        matched = true;
                    } else {
                        let content = fs.readFileSync(fullPath, 'utf-8');
                        if (content.toLowerCase().includes(qLower)) {
                            matched = true;
                        }
                    }

                    if (matched) {
                        results.push({ fileName: item, fullPath: fullPath });
                    }
                }
            } catch (e) {}
        }
    };

    search(base);
    return results;
};

async function makeFkontak(imageUrl) {
    try {
        const res = await fetch(imageUrl);
        const thumb2 = Buffer.from(await res.arrayBuffer());
        return {
            key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '2B' },
            message: { locationMessage: { name: FOOTER, jpegThumbnail: thumb2 } },
            participant: '0@s.whatsapp.net'
        };
    } catch { return undefined; }
}

let handler = async (m, { conn, text, command, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let queryText = text?.trim() || '';
    let base = './plugins';
    if (!fs.existsSync(base)) base = './';

    // ═══════════════════════════════════════
    // ✅ عرض محتوى ملف
    // ═══════════════════════════════════════
    if (queryText.startsWith('__GET__')) {
        let relativePath = queryText.replace('__GET__', '').trim();
        let fullPath = path.join(base, relativePath);

        if (!fs.existsSync(fullPath)) {
            return conn.reply(m.chat, `${HEADER}
${LINE_DIV}
│
│ ❌ *الـمـلـف مـش مـوجـود*
│
│ 📄 *المسار:* \`${relativePath}\`
│
${FOOT_DIV}`, m);
        }

        let fileContent = fs.readFileSync(fullPath, 'utf-8');
        let fileName = path.basename(fullPath);

        await conn.sendMessage(m.chat, {
            document: Buffer.from(fileContent),
            fileName: fileName,
            mimetype: 'application/javascript',
            caption: `${HEADER}
${LINE_DIV}
│
│ 📄 *${fileName}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـار: \`${relativePath}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـجـم: ${(fileContent.length / 1024).toFixed(2)} KB
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
${FOOT_DIV}`,
            mentions: [m.sender]
        }, { quoted: m });
        return;
    }

    // ═══════════════════════════════════════
    // ✅ البحث
    // ═══════════════════════════════════════
    if (!queryText) {
        return conn.reply(m.chat, `${HEADER}
${LINE_DIV}
│
│ 📄 *نـظـام الـبـحـث عـن الأكـواد*
│
│ ❄️ ═══════════════ ❄️
│
│ 🔮 *الاسـتـخـدام:*
│
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} [كلمة البحث]
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} __GET__ [المسار]
│
│ 📌 *مثال:*
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} طرد
├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} menu
│
${FOOT_DIV}`, m);
    }

    let searchQuery = queryText.replace(/\.js$/, '');

    let loadingMsg = await conn.sendMessage(m.chat, {
        text: `${HEADER}
${LINE_DIV}
│
│ 🔍 *جـاري الـبـحـث عـن "${searchQuery}"...*
│
${FOOT_DIV}`
    }, { quoted: m });

    let foundFiles = findFiles(base, searchQuery);

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    if (foundFiles.length === 0) {
        return conn.reply(m.chat, `${HEADER}
${LINE_DIV}
│
│ ❌ *لـم يـتـم الـعـثـور عـلـى مـلـفـات*
│
│ 📄 *كـلـمـة الـبـحـث:* "${searchQuery}"
│
${FOOT_DIV}`, m);
    }

    // ═══════════════════════════════════════
    // ✅ ملف واحد - ابعت الكود كـ Document
    // ═══════════════════════════════════════
    if (foundFiles.length === 1) {
        let file = foundFiles[0];
        let relativePath = path.relative(base, file.fullPath);
        let fileContent = fs.readFileSync(file.fullPath, 'utf-8');

        await conn.sendMessage(m.chat, {
            document: Buffer.from(fileContent),
            fileName: file.fileName,
            mimetype: 'application/javascript',
            caption: `${HEADER}
${LINE_DIV}
│
│ 📄 *${file.fileName}*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـمـسـار: \`${relativePath}\`
├ׁ̟̇˚₊· ͟͟͞͞➳❥ الـحـجـم: ${(fileContent.length / 1024).toFixed(2)} KB
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
${FOOT_DIV}`,
            mentions: [m.sender]
        }, { quoted: m });
        return;
    }

    // ═══════════════════════════════════════
    // ✅ أكتر من ملف - Interactive Message
    // ═══════════════════════════════════════
    let maxList = 15;
    let filesToShow = foundFiles.slice(0, maxList);

    let rows = filesToShow.map((file) => {
        let relativePath = path.relative(base, file.fullPath);
        return {
            header: "",
            title: `📄 ${file.fileName}`,
            description: `المسار: ${relativePath}`,
            id: `.${command} __GET__${relativePath}`
        };
    });

    let sections = [{
        title: `🔍 نتائج البحث (${foundFiles.length} ملف)`,
        rows: rows
    }];

    let listText = `${HEADER}
${LINE_DIV}
│
│ 🔍 *نـتـائـج الـبـحـث عـن "${searchQuery}"*
│
│ ❄️ ═══════════════ ❄️
├ׁ̟̇˚₊· ͟͟͞͞➳❥ عـدد الـمـلـفـات: ${foundFiles.length}
├ׁ̟̇˚₊· ͟͟͞͞➳❥ بـواسـطـة: @${m.sender.split('@')[0]}
│
│ 🔮 *اخـتـر مـلـف مـن الـقـائـمـة*
│
${FOOT_DIV}`;

    // تحميل الصورة
    let media = null;
    try {
        const res = await fetch(IMAGE_URL);
        const buf = Buffer.from(await res.arrayBuffer());
        media = await prepareWAMessageMedia({ image: buf }, { upload: conn.waUploadToServer });
    } catch {}

    const payload = {
        body: { text: listText },
        footer: { text: FOOTER },
        header: {
            hasMediaAttachment: !!media,
            subtitle: `نتائج البحث عن ${searchQuery}`,
            ...(media ? { imageMessage: media.imageMessage } : {})
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '📂 اختر ملف لتحميل الكود',
                        sections: sections
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📁 قائمة الأكواد',
                        id: '.كود plugins'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🔄 بحث جديد',
                        id: '.كود'
                    })
                }
            ],
            messageParamsJson: JSON.stringify({
                limited_time_offer: {
                    text: `📊 ${foundFiles.length} ملف`,
                    url: 'https://wa.me/201118680635',
                    copy_code: `البحث: ${searchQuery}`,
                    expiration_time: Date.now() + 86400000
                },
                bottom_sheet: {
                    in_thread_buttons_limit: 1,
                    divider_indices: [1, 2, 3, 999],
                    list_title: '📄 قائمة الملفات',
                    button_title: '▻ عـرض الـمـلـفـات ⚡'
                }
            })
        }
    };

    try {
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload);
        const fkontak = await makeFkontak(IMAGE_URL);
        const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid: conn.user.jid, quoted: fkontak });
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.error('[كود] interactive failed:', e.message);

        let fallbackText = listText + `\n*📋 الملفات:*\n` +
            filesToShow.map((f, i) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ *${i + 1}.* ${f.fileName}\n   └ \`${path.relative(base, f.fullPath)}\``).join('\n');
        await conn.reply(m.chat, fallbackText, m);
    }
};

handler.help = ['كود (بحث)', 'كود __GET__ (مسار)'];
handler.tags = ['owner'];
handler.command = /^(كود|getcode|cat)$/i;
handler.owner = true;

export default handler;