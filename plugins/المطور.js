// plugins/owner.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - المطور

const OWNER_NAME = '꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂'
const OWNER_NUMBER = '201118680635'
const OWNER_EMAIL = 'go588288@gmail.com'
const OWNER_INSTA = 'https://www.instagram.com/go24.q?igsh=MWdoYWtjZWNnMGhncQ=='

let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: 'https://file.garden/aauvg01sjleV_ic1/pro.opus' },
        mimetype: 'audio/mp4',
        ptt: true
      },
      { quoted: m }
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {}

  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${OWNER_NAME}
ORG:꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
TITLE:المطور الرسمي
EMAIL;type=INTERNET:${OWNER_EMAIL}
TEL;type=CELL;waid=${OWNER_NUMBER}:+${OWNER_NUMBER}
ADR;type=WORK:;;Egypt;Egypt;;
URL;type=WORK:${OWNER_INSTA}
X-WA-BIZ-NAME:${OWNER_NAME}
X-WA-BIZ-DESCRIPTION:❄️ Developer of ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`

  let qkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: OWNER_NAME,
        vcard
      }
    }
  }

  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: OWNER_NAME,
        contacts: [{ vcard }]
      }
    },
    { quoted: qkontak }
  )
}

handler.help = ['owner', 'creator']
handler.tags = ['main']
handler.command = /^(owner|creator|المطورين|المطور|مطور|مطورك|مطوري|creador)$/i

export default handler