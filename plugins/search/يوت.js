import yts from 'yt-search';
import { readFile, unlink, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const execFileAsync = promisify(execFile);

let handler = async (m, { conn, text }) => {
    if (!text?.trim()) {
        return conn.reply(
            m.chat,
            '🎵 اكتب اسم الأغنية أو القارئ أو التلاوة.\nمثال: .يوت قرآن عبدالباسط',
            m
        );
    }

    let loadingMsg;
    const outputPath = path.join(
        os.homedir(), 'tmp', `yot_${Date.now()}`
    );

    const candidates = [
        `${outputPath}.mp3`,
        `${outputPath}.webm`,
        `${outputPath}.m4a`,
        `${outputPath}.opus`,
        `${outputPath}.ogg`,
        `${outputPath}.wav`,
        `${outputPath}.aac`
    ];

    try {
        await mkdir(path.dirname(outputPath), { recursive: true });

        loadingMsg = await conn.sendMessage(m.chat, {
            text: `🔎 جاري البحث عن: ${text.trim()}\n🎧 استنى شوية...`
        }, { quoted: m });

        const results = await yts(text.trim());
        const video = results.videos?.[0];

        if (!video?.url) {
            throw new Error('ملقيتش نتيجة مناسبة للبحث ده.');
        }

        await execFileAsync('python3', [
            '-m', 'yt_dlp',
            '-x',
            '--audio-format', 'mp3',
            '--no-playlist',
            '--force-overwrites',
            '-o', `${outputPath}.%(ext)s`,
            video.url
        ], {
            timeout: 300000,
            maxBuffer: 10 * 1024 * 1024
        });

        const audioPath = candidates.find(file => existsSync(file));

        if (!audioPath) {
            throw new Error('التحميل انتهى لكن ملف الصوت مش موجود.');
        }

        const audioBuffer = await readFile(audioPath);

        if (!audioBuffer.length) {
            throw new Error('ملف الصوت فاضي.');
        }

        if (audioBuffer.length > 25 * 1024 * 1024) {
            throw new Error('حجم الصوت كبير للإرسال؛ جرّب نتيجة أقصر.');
        }

        try {
            await conn.sendMessage(m.chat, {
                delete: loadingMsg.key
            });
        } catch {}

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: audioPath.endsWith('.mp3')
                ? 'audio/mpeg'
                : 'application/octet-stream',
            fileName: `${(video.title || 'audio')
                .replace(/[\\/:*?"<>|]/g, '_')
                .slice(0, 80)}${audioPath.endsWith('.mp3') ? '.mp3' : path.extname(audioPath)}`,
            ptt: false
        }, { quoted: m });

    } catch (err) {
        console.error('[يوت]', err);

        if (loadingMsg?.key) {
            try {
                await conn.sendMessage(m.chat, {
                    delete: loadingMsg.key
                });
            } catch {}
        }

        await conn.reply(
            m.chat,
            `❌ مقدرتش أجيب الصوت.\nالسبب: ${err.message || 'خطأ غير معروف'}`,
            m
        );
    } finally {
        for (const file of candidates) {
            try {
                await unlink(file);
            } catch {}
        }
    }
};

handler.help = ['يوت (اسم الصوت)'];
handler.tags = ['search'];
handler.command = /^يوت$/i;

export default handler;
