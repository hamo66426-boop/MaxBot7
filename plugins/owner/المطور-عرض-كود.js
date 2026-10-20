import fs from 'fs';
import path from 'path';

const basePath = 'plugins';

// دالة يجلب بها شجرة المجلدات والملفات داخل مسار محدد
const getDirContents = (dirPath) => {
    const absolutePath = path.join(basePath, dirPath);
    if (!fs.existsSync(absolutePath)) return { folders: [], files: [] };

    const items = fs.readdirSync(absolutePath, { withFileTypes: true });
    
    const folders = items.filter(item => item.isDirectory()).map(item => item.name);
    const files = items.filter(item => item.isFile() && item.name.endsWith('.js')).map(item => item.name);

    return { folders, files };
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let inputPath = text ? text.trim() : '';

        // 1. في حالة اختيار/قراءة ملف .js تنفيذي مباشر
        if (inputPath.endsWith('.js')) {
            const filePath = path.join(basePath, inputPath);
            if (!fs.existsSync(filePath)) {
                return m.reply(`❌ الملف \`${inputPath}\` غير موجود.`);
            }
            const fileContent = fs.readFileSync(filePath, 'utf8');
            return await conn.sendMessage(m.chat, { text: fileContent }, { quoted: m });
        }

        // 2. تصفح المجلدات واستعراض قائمة الأزرار
        const currentFullPath = path.join(basePath, inputPath);
        if (!fs.existsSync(currentFullPath) || !fs.statSync(currentFullPath).isDirectory()) {
            return m.reply(`❌ المجلد المسمى \`${inputPath}\` غير موجود.`);
        }

        const { folders, files } = getDirContents(inputPath);

        if (folders.length === 0 && files.length === 0) {
            return m.reply(`📂 المجلد \`${inputPath || 'plugins'}\` فارغ حالياً.`);
        }

        let rows = [];

        // أضف المجلدات لقائمة الأزرار
        folders.forEach((folder) => {
            const folderSubPath = inputPath ? `${inputPath}/${folder}` : folder;
            rows.push({
                header: "📁 مجلد فرعي",
                title: `📂 ${folder}`,
                description: `فتح واستعراض محتويات مجلد ${folder}`,
                id: `${usedPrefix + command} ${folderSubPath}`
            });
        });

        // أضف الملفات لقائمة الأزرار
        files.forEach((file) => {
            const fileSubPath = inputPath ? `${inputPath}/${file}` : file;
            rows.push({
                header: "📜 ملف كود",
                title: `📄 ${file}`,
                description: `عرض وتصفح كود ${file}`,
                id: `${usedPrefix + command} ${fileSubPath}`
            });
        });

        const sections = [
            {
                title: inputPath ? `محتويات المجلد: ${inputPath} 📂` : "مجلد الأوامر الرئيسي plugins 👑",
                rows: rows
            }
        ];

        const captionText = `
.​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
📂 *مستعرض ملفات السكربت والأكواد*

📍 **المسار الحالي:** \`plugins/${inputPath}\`
📊 **المجلدات الفرعية:** ${folders.length}
📜 **الملفات:** ${files.length}

اضغط على الزر بالأسفل لاختيار المجلد أو الملف المراد عرضه.
`.trim();

        // إرسال الرسالة التفاعلية بنظام الأزرار المعتمد في البوت
        await conn.sendMessage(m.chat, {
            text: captionText,
            footer: '​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
            interactiveButtons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "إستعراض الملفات والمجلدات 📂",
                        sections: sections
                    })
                }
            ]
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ حدث خطأ أثناء تصفح الملفات: ${e.message}`);
    }
};

handler.help = ['عرض_كود'];
handler.tags = ['owner'];
handler.command = /^(getplugin|عرض-كود|gp|باتش-عرض)$/i;
handler.owner = true;

export default handler;
