import fs from 'fs';
import path from 'path';

const handler = async (m, { text, usedPrefix, command }) => {
  // تذكير وتوضيح طريقة الاستخدام عند كتابة الأمر فقط بدون اسم الملف
  if (!text) {
    if (command === 'امسح' || command === 'حذف_ملف' || command === 'deletep') {
      throw `⚠️ *طريقة استخدام أمر الحذف:*\n\n` +
            `يرجى كتابة الأمر متبوعاً باسم الملف أو مساره.\n\n` +
            `💡 *أمثلة:*
- حذف ملف رئيسي: \`${usedPrefix + command} menu\`
- حذف ملف فرعي: \`${usedPrefix + command} main/menu\``;
    } else {
      throw `⚠️ *طريقة استخدام أمر الإضافة:*\n\n` +
            `قم بالرد (Reply) على الكود واكتب الأمر متبوعاً باسم الملف أو مساره.\n\n` +
            `💡 *أمثلة:*
- إضافة ملف رئيسي: \`${usedPrefix + command} menu\`
- إضافة ملف فرعي: \`${usedPrefix + command} download/tiktok\``;
    }
  }

  // تنظيف النص وتحديد المسار الكامل للملف
  const cleanPath = text.replace(/\.js$/, ''); // إزالة .js لو كتبها المستخدم
  const filePath = path.join('plugins', `${cleanPath}.js`);

  // --- عملية الإضافة ---
  if (command === 'ضيف' || command === 'اضافه_ملف' || command === 'addp' || command === 'addplugin') {
    if (!m.quoted || !m.quoted.text) {
      throw `📩 *يرجى الرد (Reply) على الرسالة التي تحتوي على الكود ليتم حفظها!*`;
    }

    // إنشاء المجلد الفرعي تلقائياً لو غير موجود
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // حفظ الملف
    await fs.writeFileSync(filePath, m.quoted.text);
    m.reply(`✅ تم حفظ الملف بنجاح في المسار:\n\`${filePath}\``);

  // --- عملية الحذف ---
  } else if (command === 'امسح' || command === 'حذف_ملف' || command === 'deletep') {
    if (!fs.existsSync(filePath)) {
      throw `❌ الملف غير موجود في المسار:\n\`${filePath}\``;
    }

    // حذف الملف
    fs.unlinkSync(filePath);
    m.reply(`🗑️ تم حذف الملف بنجاح من المسار:\n\`${filePath}\``);
  }
};

handler.help = ['اضافه_ملف <مسار/اسم>', 'حذف_ملف <مسار/اسم>'];
handler.tags = ['owner'];
handler.command = ['ضيف', 'اضافه_ملف', 'حذف_ملف', 'امسح', 'عرض', 'اعرض'];
handler.owner = true; // متاح للمطور فقط

export default handler;
