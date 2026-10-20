let handler = async (m, { conn, groupMetadata }) => {
    try {
        let participants = (groupMetadata || await conn.groupMetadata(m.chat)).participants;
        let participant = participants.find(
            p => p.id === m.sender || p.jid === m.sender
        );

        if (!participant) {
            return conn.reply(m.chat, '❌ *عذراً، لم أتمكن من استخراج بياناتك في هذه المجموعة.*', m);
        }

        let jid = participant.jid || participant.id;
        let lid = participant.lid || 'غير متوفر';
        let name = m.pushName || m.name || 'Owner';
        let number = jid.split('@')[0];

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
👤 *مـعـلـومـات الـمـسـتـخـدم*

📝 *الاسـم:* ${name}
📱 *الـرقـم:* ${number}
🆔 *الـ JID:* ${jid}
🔍 *الـ LID:* ${lid}

👑 *بواسطة:* @${m.sender.split('@')[0]}

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (err) {
        console.error('[لمطور] error:', err.message);
        conn.reply(m.chat, `❌ *خطأ:* ${err.message}`, m);
    }
};

handler.help = ['لمطور', 'id'];
handler.tags = ['tools'];
handler.command = /^(لمطور|id)$/i;

export default handler;