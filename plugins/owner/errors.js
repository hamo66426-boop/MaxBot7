let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    // جلب الأخطاء من global
    let errors = global.errors || [];
    
    if (!errors || errors.length === 0) {
        return conn.reply(m.chat, '✅ *النظام مستقر! لا توجد أي أخطاء مسجلة حالياً.*', m);
    }

    // عرض آخر 10 أخطاء فقط
    let recentErrors = errors.slice(-10);
    
    let res = recentErrors.map((err, index) => {
        let stack = err?.stack || err?.toString() || 'خطأ غير محدد';
        let file = err?.file || 'غير محدد';
        let command = err?.command || 'غير محدد';
        
        // اختصار الخطأ
        let shortStack = stack.split('\n').slice(0, 3).join('\n');
        
        return `⚠️ *خطأ ${index + 1}/${recentErrors.length}*
📂 *الملف:* ${file}
🌱 *الأمر:* ${command}
❌ *السبب:* ${shortStack}
${'─'.repeat(25)}`;
    }).join('\n\n');

    let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🔍 *سـجـل الأخـطـاء*

📊 *عدد الأخطاء:* ${errors.length}
📋 *آخر ${recentErrors.length} أخطاء:*

${res}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.help = ['الايرورات'];
handler.tags = ['owner'];
handler.command = /^(الايرورات|errors|اخطاء)$/i;
handler.owner = true;

export default handler;