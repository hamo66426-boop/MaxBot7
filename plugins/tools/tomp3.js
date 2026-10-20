import { exec } from "child_process";
import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const formatMessage = (msg) => {
    return `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n${msg}\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
};

let handler = async (m, { conn, command }) => {
    // ✅ التحقق من وجود رد
    const quoted = m.quoted || m;
    
    // ✅ التحقق من نوع الميديا (فيديو أو فويس أو صوت)
    const mtype = quoted.mtype || '';
    const mimetype = quoted.msg?.mimetype || quoted.mimetype || '';
    const isVideo = mtype === 'videoMessage' || mimetype.includes('video');
    const isVoice = mtype === 'audioMessage' && (quoted.msg?.ptt || quoted.ptt);
    const isAudio = mtype === 'audioMessage' || mimetype.includes('audio');

    if (!isVideo && !isVoice && !isAudio) {
        return m.reply(formatMessage(`🎵 تحويل الصوت/الفيديو\n\n📝 الاستخدام:\n.${command} (بالرد على فيديو أو فويس)\n\n🎬 بيحول الفويس لصوت MP3 عادي`));
    }

    // رسالة جاري التحويل
    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: formatMessage('⏳ جاري التحويل...')
    }, { quoted: m });

    try {
        let tmp = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tmp)) await fsp.mkdir(tmp, { recursive: true });

        let inputFile = path.join(tmp, `${Date.now()}_input.${isVideo ? 'mp4' : 'ogg'}`);
        let outputFile = path.join(tmp, `${Date.now()}_output.mp3`);

        // ✅ تنزيل الميديا
        let mediaBuffer;
        try {
            mediaBuffer = await quoted.download();
        } catch (e) {}

        // ✅ طرق بديلة للتنزيل
        if (!mediaBuffer && quoted.msg?.videoMessage?.url) {
            let res = await fetch(quoted.msg.videoMessage.url);
            mediaBuffer = Buffer.from(await res.arrayBuffer());
        }
        if (!mediaBuffer && quoted.msg?.audioMessage?.url) {
            let res = await fetch(quoted.msg.audioMessage.url);
            mediaBuffer = Buffer.from(await res.arrayBuffer());
        }
        if (!mediaBuffer && m.msg?.audioMessage?.url) {
            let res = await fetch(m.msg.audioMessage.url);
            mediaBuffer = Buffer.from(await res.arrayBuffer());
        }

        if (!mediaBuffer || mediaBuffer.length < 1000) {
            throw new Error('فشل تنزيل الميديا');
        }

        await fsp.writeFile(inputFile, mediaBuffer);

        // ✅ تحويل لـ MP3
        await execAsync(`ffmpeg -i "${inputFile}" -vn -acodec libmp3lame -q:a 2 "${outputFile}" -y`);

        let audioBuffer = await fsp.readFile(outputFile);

        // ✅ حذف رسالة التحميل
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let msg = formatMessage(
            `✅ تم التحويل بنجاح\n\n` +
            `🎵 MP3 Audio\n\n` +
            `👑 بواسطة: @${m.sender.split('@')[0]}\n\n​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑`
        );

        await conn.sendMessage(m.chat, { 
            audio: audioBuffer, 
            mimetype: "audio/mpeg"
        }, { quoted: m });

        // إرسال الكابشن منفصل
        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [m.sender] 
        }, { quoted: m });

        // ✅ تنظيف الملفات المؤقتة
        await Promise.all([
            fsp.unlink(inputFile).catch(() => {}),
            fsp.unlink(outputFile).catch(() => {})
        ]);

    } catch (err) {
        console.error('[لصوت] Error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch(e) {}
        m.reply(formatMessage(`❌ خطأ: ${err.message}\n\n💡 تأكد من:\n- الرد على فيديو أو فويس\n- ffmpeg متثبت على السيرفر`));
    }
};

handler.usage = ['لصوت'];
handler.category = "tools";
handler.command = ['لصوت', 'tomp3'];

export default handler;