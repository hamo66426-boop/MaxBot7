import os from 'os';

let handler = async (m, { conn }) => {
  let usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  let freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  let heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  let heapTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1);
  
  // نسبة استخدام الرام
  let ramPercent = ((usedRam / (totalRam * 1024)) * 100).toFixed(1);
  
  let ramBar = '';
  let barCount = Math.floor(ramPercent / 10);
  for (let i = 0; i < 10; i++) {
    ramBar += i < barCount ? '🟢' : '⚪';
  }

  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🧠 *حـالـة الـرام*

📊 *الرام المستخدم:* ${usedRam}MB
💾 *الرام الفارغ:* ${freeRam}GB
🗄️ *الرام الكلي:* ${totalRam}GB
📈 *نسبة الاستخدام:* ${ramPercent}%

${ramBar}

⚙️ *Heap:*
📊 *المستخدم:* ${heapUsed}MB
📊 *الإجمالي:* ${heapTotal}MB

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, {
    text: msg,
    contextInfo: {
      externalAdReply: {
        title: "🧠 RAM Status",
        body: "حالة الرام الخاصة بالبوت",
        thumbnailUrl: "https://files.catbox.moe/kahw8j.jpg",
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['الرام', 'ram'];
handler.tags = ['info'];
handler.command = /^(الرام|ram|ذاكرة)$/i;

export default handler;