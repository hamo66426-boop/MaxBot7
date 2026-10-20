let handler = async (m, { conn, isOwner, isROwner }) => {
    if (!isOwner && !isROwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمطورين فقط!*', m);

    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري الفحص الشامل...*\n🔍 *لو موجود هرفعك، ولو مش موجود هجيبلك الرابط*\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    let ownerJids = [conn.user.jid, ...(global.owner || []).map(o => o + '@s.whatsapp.net')];
    if (!ownerJids.includes(m.sender)) ownerJids.push(m.sender);

    let promotedLines = [];
    let inviteLines = [];
    let mentionedUsers = [];
    let processedGroups = new Set();

    try {
        let getGroups = await conn.groupFetchAllParticipating();
        let groups = Object.values(getGroups);

        for (let group of groups) {
            if (processedGroups.has(group.id)) continue;

            try {
                let participants = group.participants || [];
                let jidsToPromote = [];
                let isSenderInGroup = participants.some(p => p.id === m.sender);

                // البحث عن مطورين يحتاجوا ترقية
                for (let p of participants) {
                    if (ownerJids.includes(p.id) && p.admin !== 'admin' && p.admin !== 'superadmin') {
                        jidsToPromote.push(p.id);
                    }
                }

                let actionTaken = false;

                // رفع المطورين
                if (jidsToPromote.length > 0) {
                    await conn.groupParticipantsUpdate(group.id, jidsToPromote, 'promote');
                    actionTaken = true;
                    
                    for (let promotedJid of jidsToPromote) {
                        promotedLines.push(`👑 *المطور:* @${promotedJid.split('@')[0]}\n📁 *الجروب:* ${group.subject}\n`);
                        if (!mentionedUsers.includes(promotedJid)) {
                            mentionedUsers.push(promotedJid);
                        }
                    }
                }

                // لو الكينج مش في الجروب
                if (!isSenderInGroup) {
                    try {
                        let code = await conn.groupInviteCode(group.id);
                        inviteLines.push(`🔗 *الجروب:* ${group.subject}\n📎 *الرابط:* https://chat.whatsapp.com/${code}\n👈 *تعال خد ادمن هنا يا كينج!*\n`);
                        actionTaken = true;
                    } catch (e) {}
                }

                if (actionTaken) {
                    processedGroups.add(group.id);
                }

            } catch (err) {
                continue;
            }
        }

        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        // بناء التقرير
        let report = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
✅ *التقرير الشامل*

`;

        if (promotedLines.length > 0) {
            report += `🎯 *تم رفع ${promotedLines.length} مطورين:*\n\n${promotedLines.join('\n')}\n`;
            report += `${'━'.repeat(25)}\n\n`;
        } else {
            report += `🎯 *الرفع:* مفيش حد محتاج يترفع.\n${'━'.repeat(25)}\n\n`;
        }

        if (inviteLines.length > 0) {
            report += `🔗 *جروبات أنت مش فيها (${inviteLines.length}):*\n\n${inviteLines.join('\n')}`;
        } else {
            report += `🔗 *الجروبات:* أنت منور في كل الجروبات يا كينج 👑`;
        }

        report += `\n\n👑 *بواسطة:* @${m.sender.split('@')[0]}\n\n​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        // تقسيم التقرير لو طويل
        if (report.length > 3500) {
            let chunks = [];
            let current = '';
            let lines = report.split('\n');
            for (let line of lines) {
                if ((current + line + '\n').length > 3500) {
                    chunks.push(current);
                    current = line + '\n';
                } else {
                    current += line + '\n';
                }
            }
            if (current) chunks.push(current);
            
            for (let chunk of chunks) {
                await conn.sendMessage(m.chat, { text: chunk, mentions: mentionedUsers }, { quoted: m });
            }
        } else {
            await conn.sendMessage(m.chat, { text: report, mentions: mentionedUsers }, { quoted: m });
        }

    } catch (err) {
        console.error('[رفع_المطورين] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *حدث خطأ برمجي، راجع الكونسول.*', m);
    }
};

handler.help = ['رفع_المطورين', 'رفع_الكل'];
handler.tags = ['owner'];
handler.command = /^(رفع_المطورين|رفع_الكل)$/i;
handler.owner = true;

export default handler;