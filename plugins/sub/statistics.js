let handler = async (m, { conn }) => {
    let sub = global.subBots;
    let uptime = process.uptime();
    let days = Math.floor(uptime / 86400);
    let hours = Math.floor((uptime % 86400) / 3600);
    let minutes = Math.floor((uptime % 3600) / 60);

    let botsCount = sub ? sub.list().length : 0;
    let connectedCount = sub ? sub.list().filter(b => b.connected).length : 0;
    let disconnectedCount = botsCount - connectedCount;

    let groups = Object.entries(global.db.data.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && !chat?.isBanned).length;
    
    let users = Object.keys(global.db.data.users).length;
    let ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
📊 *احـصـائـيـات الـبـوت*

🤖 *البوت الأساسي:* ${conn.user.jid.split('@')[0]}

📈 *البوتات الفرعية:*
🟢 *متصل:* ${connectedCount}
🔴 *غير متصل:* ${disconnectedCount}
📊 *الإجمالي:* ${botsCount}

👥 *المجموعات:* ${groups}
👤 *المستخدمين:* ${users}

⏱️ *مدة التشغيل:*
${days} يوم ${hours} ساعة ${minutes} دقيقة

💾 *الرام:* ${ram}MB

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.help = ['احصائيات'];
handler.tags = ['subbot'];
handler.command = /^(احصائيات|stats|احصائيات_البوتات)$/i;

export default handler;