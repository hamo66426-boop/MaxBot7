import os from 'os';

let handler = async (m, { conn }) => {
  let usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  let heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  let heapTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1);
  let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  let freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  let cpuCores = os.cpus().length;
  let cpuModel = os.cpus()[0].model;
  let cpuSpeed = (os.cpus()[0].speed / 1000).toFixed(1);
  let cpuUsage = (os.loadavg()[0] * 100).toFixed(1);
  let platform = os.platform();
  let arch = os.arch();
  let hostname = os.hostname();
  let uptime = process.uptime();
  let uptimeHours = Math.floor(uptime / 3600);
  let uptimeMins = Math.floor((uptime % 3600) / 60);
  let uptimeSecs = Math.floor(uptime % 60);
  
  // عدد المجموعات
  let groupCount = Object.values(global.db.data.chats).filter(chat => chat?.isBanned === false).length || 0;
  
  // عدد المستخدمين
  let userCount = Object.keys(global.db.data.users).length || 0;
  
  let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🤖 *مـعـلـومـات الـبـوت*

👑 *الـبـوت:*
- *الاسم:* ${conn.user.name || '𝑴𝑨𝑿 𝑩𝑶𝑻'}
- *الرقم:* wa.me/${conn.user.jid.split('@')[0]}
- *شغال منذ:* ${uptimeHours.toString().padStart(2, '0')}:${uptimeMins.toString().padStart(2, '0')}:${uptimeSecs.toString().padStart(2, '0')}

💻 *الـنـظـام:*
- *النظام:* ${platform} ${arch}
- *الجهاز:* ${hostname}
- *المعالج:* ${cpuModel.slice(0, 30)}...
- *النوى:* ${cpuCores} نواة @ ${cpuSpeed}GHz
- *الحمل:* ${cpuUsage}%

🧠 *الـذاكـرة:*
- *الرام المستخدم:* ${usedRam}MB / ${totalRam}GB
- *الرام الفارغ:* ${freeRam}GB
- *Heap:* ${heapUsed}MB / ${heapTotal}MB

📊 *احـصـائـيـات:*
- *المجموعات:* ${groupCount}
- *المستخدمين:* ${userCount}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

  await conn.sendMessage(m.chat, {
    text: msg,
    contextInfo: {
      externalAdReply: {
        title: "𝑴𝑨𝑿 𝑩𝑶𝑻 👑 | معلومات البوت",
        body: "WhatsApp Bot - سريع وسهل التعديل",
        thumbnailUrl: "https://files.catbox.moe/qeqajh.jpg",
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['معلومات', 'حالة'];
handler.tags = ['info'];
handler.command = /^(معلومات|info|botinfo|حالة|status)$/i;

export default handler;