import fs from 'fs';
import path from 'path';

const formatMessage = (msg) => {
    return `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n${msg}\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;
};

// دالة التوقف الزمني لتنظيم العمليات
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, command }) => {
    if (!m.quoted) return m.reply(formatMessage(`📢 الإذاعة عبر البوتات الفرعية\n\n📝 الاستخدام:\n.${command} (بالرد على الرسالة)`));

    // ✅ التحقق من وجود بوتات فرعية متصلة
    if (!global.conns || !Array.isArray(global.conns)) {
        global.conns = [];
    }

    // ✅ تصفية البوتات المتصلة الجاهزة للعمل
    let activeBots = global.conns.filter(sock => sock?.user && (sock?.isInit || sock?.ws?.socket?.readyState === 1));

    if (activeBots.length === 0) {
        return m.reply(formatMessage('❌ لا يوجد بوتات فرعية متصلة!'));
    }

    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: formatMessage(`📢 جاري الإذاعة عبر ${activeBots.length} بوت...\n⏳ يرجى الانتظار، قد يستغرق الأمر بعض الوقت.`)
    }, { quoted: m });

    let success = 0;
    let failed = 0;
    let totalGroups = 0;

    for (let sock of activeBots) {
        try {
            // ✅ جلب كل المجموعات التي يتواجد فيها البوت الفرعي
            let groups = await sock.groupFetchAllParticipating();
            let groupList = Object.values(groups);

            for (let group of groupList) {
                totalGroups++; // زيادة عداد الجروبات المستهدفة

                try {
                    // ✅ جلب أعضاء المجموعة لعمل المنشن المخفي
                    let groupMetadata = await sock.groupMetadata(group.id);
                    let participants = groupMetadata.participants.map(p => p.id);

                    // ✅ إعادة توجيه الرسالة مع منشن مخفي
                    await sock.sendMessage(group.id, {
                        forward: m.quoted,
                        force: true, // إجبار الإرسال لتفادي أخطاء الجلسات المنفصلة
                        mentions: participants
                    });

                    success++;
                } catch (e) {
                    failed++;
                    // ✅ طباعة سبب الفشل في الكونسول (الترمنال) لتسهيل الفحص
                    let botNumber = sock.user.id.split(':')[0];
                    console.log(`❌ فشل في جروب [${group.subject || group.id}] (بوت: ${botNumber}):`, e.message || e);
                }
                
                // ✅ توقف زمني ثانيتين بعد كل محاولة (سواء نجحت أو فشلت) لحماية البوت من الحظر
                await sleep(2000);
            }
        } catch (e) {
            console.log(`❌ فشل في جلب بيانات جروبات البوت ${sock?.user?.id}:`, e.message || e);
        }
    }

    // ✅ حذف رسالة التحميل (تجاهل الخطأ إذا تم حذفها مسبقاً)
    try {
        await conn.sendMessage(m.chat, { delete: loadingMsg.key });
    } catch (e) {}

    let msg = formatMessage(
        `📢 تم الانتهاء من الإذاعة\n\n` +
        `✅ ناجح: ${success} مجموعة\n` +
        `❌ فاشل: ${failed}\n` +
        `🤖 البوتات: ${activeBots.length}\n` +
        `👥 الجروبات المستهدفة: ${totalGroups}\n\n` +
        `👑 بواسطة: @${m.sender.split('@')[0]}\n\n​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑`
    );

    await conn.sendMessage(m.chat, { 
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.usage = ['اذاعة_فرعي'];
handler.category = "sub";
handler.tags = ['subbot'];
handler.command = ['اذاعة_فرعي', 'اذاعه_فرعي'];

export default handler;
