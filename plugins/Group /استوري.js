import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import axios from 'axios';

const formatMessage = (msg) => {
    return `╔═════════════════╗\n${msg}\n╚═════════════════╝`;
};

// ✅ قائمة أرقام المطورين
const OWNERS = [
    '201118680635',
    '201031769315'
];

// 🎨 الألوان (0 أسود للمطور، 1-15 لباقي الأعضاء)
const COLORS = [
    0xFF000000, 0xFFE91E63, 0xFF9C27B0, 0xFF673AB7, 0xFF3F51B5,
    0xFF2196F3, 0xFF03A9F4, 0xFF00BCD4, 0xFF009688, 0xFF4CAF50,
    0xFF8BC34A, 0xFFCDDC39, 0xFFFFEB3B, 0xFFFFC107, 0xFFFF9800, 0xFFFF5722
];

let handler = async (m, { conn, args, command }) => {
    const chatJid = m.chat;
    const sender = String(m.sender || '').toLowerCase();
    const senderNumber = sender.replace(/[^0-9]/g, '');
    const ownerNumbers = [...new Set([
        ...OWNERS,
        ...(global.owner || []).map(owner => String(owner).replace(/[^0-9]/g, ''))
    ])].filter(Boolean);

    // التحقق من رقم الهاتف أو معرّف LID المطابق المسجل للمطور
    const knownOwnerLids = ['252102299361529', '192780412432563'];
    const isOwner =
        ownerNumbers.includes(senderNumber) ||
        (sender.endsWith('@lid') && knownOwnerLids.includes(senderNumber)) ||
        m.isOwner === true ||
        m.isROwner === true;


    // ✅ التحقق من وجود رد
    const quoted = m.quoted;
    let isImage = false;
    let isVideo = false;

    if (quoted) {
        if (quoted.mtype === 'imageMessage') {
            isImage = true;
        } else if (quoted.mtype === 'videoMessage') {
            isVideo = true;
        }
    }

    // ✅ صورة مع كابشن
    if (!isImage && !isVideo) {
        if (m.mtype === 'imageMessage') {
            isImage = true;
        } else if (m.mtype === 'videoMessage') {
            isVideo = true;
        }
    }

    // ✅ القيم الافتراضية
    let postText = '';
    let colorIndex = -1;
    let remainingText = args.join(' ').trim();

    // ────────── تحليل الأمر ──────────
    if (remainingText) {
        let parts = remainingText.split(' ');
        if (parts.length > 0) {
            let potentialColor = parseInt(parts[0]);
            if (!isNaN(potentialColor) && potentialColor >= 0 && potentialColor <= 15) {
                colorIndex = potentialColor;
                remainingText = parts.slice(1).join(' ');
            } else {
                remainingText = parts.join(' ');
            }
        }
        postText = remainingText;
    }

    // ────────── مساعدة مختصرة وفخمة ──────────
    if (!postText && !isImage && !isVideo) {
        return m.reply(formatMessage(
            `🔱 *نِـظَـامْ اسـتُـورِي الـجُـرُوبْ* 🔱\n\n` +
            `🔹 الخيار (0) مخصص للمطور 👑\n` +
            `🎨 باقي الألوان من (1 إلى 15)\n\n` +
            `⚡ *طريقة الاستخدام:*\n` +
            `• .${command} [الرقم] [النص]\n` +
            `• أو بالرد على صورة/فيديو: .${command} [النص]`
        ));
    }

    // ⛔ التحقق من الصلاحية: الخيار 0 للمطور فقط
    if (colorIndex === 0 && !isOwner) {
        return m.reply(formatMessage(`⚠️ الخيار (0) مخصص للمطور فقط!`));
    }

    try {
        // ────────── حالة صورة/فيديو مرفق ──────────
        if (isImage || isVideo) {
            let mediaType = isImage ? 'image' : 'video';

            let buffer;
            try {
                buffer = await m.quoted?.download?.();
            } catch (e) {}

            if (!buffer && m.quoted?.msg?.imageMessage?.url) {
                let res = await axios.get(m.quoted.msg.imageMessage.url, {
                    responseType: 'arraybuffer',
                    timeout: 120000
                });
                buffer = Buffer.from(res.data);
            }

            if (!buffer && m.msg?.imageMessage?.url) {
                let res = await axios.get(m.msg.imageMessage.url, {
                    responseType: 'arraybuffer',
                    timeout: 120000
                });
                buffer = Buffer.from(res.data);
            }

            if (!buffer) throw new Error('فشل تنزيل الميديا');

            let mimetype = isImage ? 'image/jpeg' : 'video/mp4';

            let prepared = await prepareWAMessageMedia(
                { [mediaType]: buffer, mimetype },
                { upload: conn.waUploadToServer }
            );

            let messageKey = isImage ? 'imageMessage' : 'videoMessage';

            const contentMsg = {
                [messageKey]: {
                    ...prepared[messageKey],
                    caption: postText || '',
                    contextInfo: {
                        isGroupStatus: true,
                        pairedMediaType: 'NOT_PAIRED_MEDIA',
                        statusAudienceMetadata: { audienceType: 0 }
                    }
                }
            };

            const webMsg = proto.Message.fromObject(contentMsg);
            const waMsg = generateWAMessageFromContent(chatJid, webMsg, { userJid: conn.user.id, quoted: m });
            await conn.relayMessage(chatJid, waMsg.message, { messageId: waMsg.key.id });
            await conn.sendMessage(chatJid, { react: { text: '✅', key: m.key } });
            return;
        }

        // ────────── حالة الاستوري النصي ──────────
        const finalColor = (colorIndex >= 0 && colorIndex < COLORS.length)
            ? COLORS[colorIndex]
            : COLORS[Math.floor(Math.random() * (COLORS.length - 1)) + 1];

        // 🎨 تخصيص لون النص: الذهبي للمطور (0)، والأبيض لباقي الأرقام
        const textColor = (colorIndex === 0) ? 4294967040 : 4294967295;

        const groupMetadata = await conn.groupMetadata(chatJid);
        const statusJidList = groupMetadata.participants.map(p => p.id);

        await conn.relayMessage(chatJid, {
            statusJidList,
            messageContextInfo: {
                messageSecret: Buffer.from(Array(32).fill(0).map(() => Math.floor(Math.random() * 256)))
            },
            groupStatusMessageV2: {
                message: {
                    extendedTextMessage: {
                        text: `${postText}`,
                        thumbnailUrl: 'https://files.catbox.moe/qeqajh.jpg',
                        textArgb: textColor,
                        backgroundArgb: finalColor,
                        font: 5,
                        previewType: 0,
                        contextInfo: {
                            statusAttributions: [{ type: 10 }],
                            featureEligibilities: { canBeReshared: true, canReceiveMultiReact: true },
                            statusSourceType: 4,
                            statusAudienceMetadata: { audienceType: 0 }
                        },
                        inviteLinkGroupTypeV2: 0
                    }
                }
            }
        }, {});

        await conn.sendMessage(chatJid, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('[ستوري] Error:', error.message);
        await conn.sendMessage(chatJid, { react: { text: '❌', key: m.key } });
        await m.reply(formatMessage(`❌ حدث خطأ: ${error.message}`));
    }
};

handler.usage = ['ستوري'];
handler.category = "group";
handler.command = ['ستوري', 'story', 'منشور'];

export default handler;
