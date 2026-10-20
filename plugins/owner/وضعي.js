const run = async (m, { conn, args, bot }) => {
  // 1. تحديد البوت المستهدف
  let targetSock = conn; 
  let isMainBot = !conn.user.id.includes(m.sender.split('@')[0]); 
  
  if (global.subBots) {
    const senderNum = m.sender.split('@')[0];
    const subBot = global.subBots.list().find(b => b.phone === senderNum);
    
    if (isMainBot) {
        if (subBot && subBot.sock) {
            targetSock = subBot.sock;
        } else if (!m.isOwner) {
            return m.reply("❌ ليس لديك بوت فرعي متصل لتتحكم فيه.");
        }
    }
  }

  const mode = args[0]?.toLowerCase();
  let prefix = bot?.config?.prefix?.[0] || '.';

  // 2. تغيير الوضع
  if (mode === "عام") {
    targetSock.public = true; 
    return m.reply("🌐 *تم تفعيل الوضع العام لبوتك بنجاح*\n✅ بوتك الآن سيرد على جميع المستخدمين بحرية في الجروبات والخاص.");
  } 
  else if (mode === "خاص") {
    targetSock.public = false; 
    return m.reply("🔒 *تم تفعيل الوضع الخاص لبوتك بنجاح*\n✅ بوتك الآن يتجاهل الجميع وسيرد عليك أنت والمطورين فقط.");
  } 
  else {
    // 3. عرض القائمة التفاعلية بالأزرار
    let currentMode = targetSock.public !== false ? "🌐 عام" : "🔒 خاص";
    
    await conn.sendButton(m.chat, {
      bodyText: `⚙️ *إعدادات الخصوصية لبوتك الفرعي*\n\nالوضع الحالي لبوتك: *${currentMode}*\n\nاختر الوضع الذي تريده من الأزرار أدناه للتبديل بينهما بأي وقت:`,
      footerText: "𝑴𝑨𝑿 𝑩𝑶𝑻 👑 | تحكم البوت",
      buttons: [
        { name: "quick_reply", params: { display_text: "🌐 تفعيل العام", id: `${prefix}تحكم_بوتي عام` } },
        { name: "quick_reply", params: { display_text: "🔒 تفعيل الخاص", id: `${prefix}تحكم_بوتي خاص` } }
      ]
    }, m);
  }
};

run.command = ["تحكم_بوتي", "وضعي"];
run.usage = ["تحكم_بوتي"];
run.category = "sub";

export default run;
