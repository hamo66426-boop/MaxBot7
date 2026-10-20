const formatMessage = (text, role = "لـ الـمـجـمـوعـة") => {
  return `ـ ــ ⚜️ ❲ 👑 ${role} ❳ ⚜️ ــ ـ
ـ ــ ⚜️ ❪ ➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑 ❫ ⚜️ ــ ـ

${text}

ـ ــ ⚜️ ــــــــــــــــــــــــ ⚜️ ــ ـ`;
};

let handler = async (m, { conn, bot }) => {
    const context = (jid, img) => ({
        mentionedJid: [jid],
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424844460135@newsletter',
            newsletterName: '𝑴𝑨𝑿 𝑩𝑶𝑻',
            serverMessageId: 0
        },
        externalAdReply: {
            title: "𝑴𝑨𝑿 𝑩𝑶𝑻👑 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐖𝐒/𝐕𝐈𝐈 𝐟𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
            body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
            thumbnailUrl: img,
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true
        }
    });

    const { images } = bot.config.info;
    const img = images.random();

    const innerMsg = `كلم مطور لو عاوز بوت https://wa.me/201551798379\nاو \nhttps://wa.me/201128290021\n\nرقم المطور \nhttps://wa.me/201551798379\nاو \nhttps://wa.me/201128290021`;

    await conn.sendMessage(m.chat, { 
      text: formatMessage(innerMsg),
      contextInfo: context(m.sender, img)
    }, { quoted: reply_status });
};

handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc"];

export default handler;
