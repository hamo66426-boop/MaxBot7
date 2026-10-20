import fs from 'fs';
import path from 'path';
import pino from 'pino';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

// 📂 المسار الخاص بجلسات البوتات الفرعية من السيرفر
const SUBBOT_DIR = './Sessions/SubBot';

// 🔄 دالة استعادة وتشغيل البوتات الفرعية تلقائياً عند إقلاع البوت
async function reloadSubBots() {
  if (global.subBotsRestored) return;
  global.subBotsRestored = true;

  if (!global.conns) global.conns = [];
  if (!fs.existsSync(SUBBOT_DIR)) return;

  try {
    const folders = fs.readdirSync(SUBBOT_DIR);
    if (folders.length === 0) return;

    console.log(`⚡ جاري استعادة ${folders.length} بوت فرعي من المسار (${SUBBOT_DIR})...`);

    for (const folder of folders) {
      const sessionPath = path.join(SUBBOT_DIR, folder);
      
      // التأكد من أنه مجلد وليس ملفاً عادياً
      if (!fs.statSync(sessionPath).isDirectory()) continue;

      await startSubBot(sessionPath, folder);
    }
  } catch (err) {
    console.error('❌ خطأ في استعادة البوتات الفرعية:', err);
  }
}

async function startSubBot(sessionPath, folderName) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['KING-BOT SubBot', 'Chrome', '1.0.0']
    });

    sock.isInit = false;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        sock.isInit = true;
        let phone = sock.user?.id ? sock.user.id.split(':')[0].split('@')[0] : folderName;
        console.log(`✅ تم استعادة اتصال البوت الفرعي بنجاح: ${phone}`);

        // إضافة البوت إلى القائمة العالمية global.conns
        const existingIndex = global.conns.findIndex(c => c.user?.id === sock.user?.id);
        if (existingIndex !== -1) {
          global.conns[existingIndex] = sock;
        } else {
          global.conns.push(sock);
        }
      } else if (connection === 'close') {
        sock.isInit = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (sock.user?.id) {
          global.conns = global.conns.filter(c => c.user?.id !== sock.user?.id);
        }

        if (shouldReconnect) {
          setTimeout(() => startSubBot(sessionPath, folderName), 10000);
        }
      }
    });
  } catch (e) {
    console.error(`❌ تعذر تشغيل الجلسة (${folderName}):`, e.message);
  }
}

// 🟢 يتم تنفيذ الاستعادة التلقائية فور تلقي أول رسالة بعد تشغيل البوت
export async function before(m, { conn }) {
  if (!global.subBotsRestored) {
    reloadSubBots();
  }
}

// 📜 الأمر الرئيسي لعرض قائمة البوتات الفرعية المتصلة
let handler = async (m, { conn }) => {
  if (!global.conns || !Array.isArray(global.conns)) {
    global.conns = [];
  }

  // تصفية البوتات المتصلة حالياً
  let bots = global.conns.filter(sock => sock?.user && (sock?.isInit || sock?.ws?.socket?.readyState === 1));

  if (bots.length === 0) {
    return conn.reply(m.chat, '📭 *لا يوجد بوتات فرعية متصلة حالياً!*\n\n💡 *لتنصيب بوت جديد استخدم:* .تنصيب', m);
  }

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🤖 *الـبـوتـات الـفـرعـيـة*\n\n`;

  bots.forEach((sock, i) => {
    let jid = sock.user?.id || sock.user?.jid || '';
    let phone = jid ? jid.split(':')[0].split('@')[0] : 'غير معروف';
    let name = sock.authState?.creds?.me?.name || sock.user?.name || 'مجهول';

    msg += `├ׁ̟̇˚₊· ͟͟͞͞➳❥ ${i + 1}. 👤 *الاسم:* ${name}\n`;
    msg += `│   📱 *الرقم:* ${phone}\n`;
    msg += `│   📊 *الحالة:* 🟢 متصل\n`;
    msg += `│   ${'━'.repeat(20)}\n`;
  });

  msg += `\n📊 *الإجمالي:* ${bots.length}/50\n\n👑 *بواسطة:* @${m.sender.split('@')[0]}\n\n➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['البوتات', 'bots'];
handler.tags = ['subbot'];
handler.command = /^(البوتات|bots)$/i;

export default handler;
