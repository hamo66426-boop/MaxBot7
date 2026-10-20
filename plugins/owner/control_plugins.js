import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text, command, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let base = './plugins';
    let target = text?.trim();

    // دالة جلب قائمة الملفات
    let listFiles = () => {
        let files = [];
        let walk = (dir) => {
            if (!fs.existsSync(dir)) return;
            let items = fs.readdirSync(dir);
            for (let item of items) {
                let p = path.join(dir, item);
                if (fs.statSync(p).isDirectory()) walk(p);
                else if (item.endsWith('.js')) files.push(path.relative(base, p).replace(/\.js$/, ''));
            }
        };
        walk(base);
        return files.sort();
    };
    
    // دالة البحث عن ملف
    let findFile = (name) => {
        let search = (dir) => {
            if (!fs.existsSync(dir)) return null;
            let items = fs.readdirSync(dir);
            for (let item of items) {
                let p = path.join(dir, item);
                if (fs.statSync(p).isDirectory()) {
                    let found = search(p);
                    if (found) return found;
                } else if (item === `${name}.js`) return p;
            }
            return null;
        };
        return search(base);
    };
    
    // أمر إضافة ملف
    if (command === 'اضافه_ملف') {
        if (!target) {
            let files = listFiles();
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n📁 *الملفات الموجودة* (${files.length})\n\n`;
            if (!files.length) {
                msg += '└─ لا توجد ملفات';
            } else {
                for (let i = 0; i < files.length; i += 20) {
                    let chunk = files.slice(i, i + 20);
                    msg += `┌─ ${i+1}-${Math.min(i+20, files.length)}\n`;
                    msg += chunk.map(f => `│ 📄 ${f}`).join('\n') + '\n└────────────────\n\n';
                }
                msg += '📝 *.اضافه_ملف المسار/الاسم* (مع الرد على الكود)';
            }
            msg += `\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
            return conn.reply(m.chat, msg, m);
        }
        
        if (!m.quoted) return conn.reply(m.chat, '✦ *الرد على الكود اولا* ✦', m);
        let content = m.quoted.text || m.quoted.msg;
        if (!content) return conn.reply(m.chat, '✧ *الكود غير موجود* ✧', m);
        
        let parts = target.split('/');
        let name = parts.pop();
        let dir = base;
        for (let p of parts) {
            dir = path.join(dir, p);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }
        
        let filePath = path.join(dir, `${name}.js`);
        fs.writeFileSync(filePath, content);
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n✅ *تم رفع الملف بنجاح*\n\n📄 *المسار:* \`${path.relative(base, filePath)}\`\n👑 *بواسطة:* @${m.sender.split('@')[0]}\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
    }
    
    // أمر حذف ملف
    else if (command === 'حذف_ملف') {
        if (!target) {
            let files = listFiles();
            let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🗑️ *الملفات المتاحة* (${files.length})\n\n`;
            if (!files.length) {
                msg += '└─ لا توجد ملفات';
            } else {
                for (let i = 0; i < files.length; i += 20) {
                    let chunk = files.slice(i, i + 20);
                    msg += `┌─ ${i+1}-${Math.min(i+20, files.length)}\n`;
                    msg += chunk.map(f => `│ 📄 ${f}`).join('\n') + '\n└────────────────\n\n';
                }
                msg += '📝 *.حذف_ملف المسار/الاسم*';
            }
            msg += `\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
            return conn.reply(m.chat, msg, m);
        }
        
        let filePath = path.join(base, `${target}.js`);
        if (!fs.existsSync(filePath)) {
            filePath = findFile(target.split('/').pop());
        }
        
        if (!filePath || !fs.existsSync(filePath)) {
            return conn.reply(m.chat, `❌ \`${target}.js\`\n└─ *غير موجود*`, m);
        }
        
        fs.unlinkSync(filePath);
        
        // حذف المجلدات الفارغة
        let clean = (dir) => {
            if (dir === base) return;
            if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
                fs.rmdirSync(dir);
                clean(path.dirname(dir));
            }
        };
        clean(path.dirname(filePath));
        
        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n🗑️ *تم حذف الملف بنجاح*\n\n📄 *المسار:* \`${path.relative(base, filePath)}\`\n👑 *بواسطة:* @${m.sender.split('@')[0]}\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
        await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m });
    }
};

handler.help = ['اضافه_ملف', 'حذف_ملف'];
handler.tags = ['owner'];
handler.command = /^(اضافه_ملف|حذف_ملف)$/i;
handler.owner = true;

export default handler;