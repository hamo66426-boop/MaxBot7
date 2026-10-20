// أوامر الفعل - صفع، قصف، اتحرش، اهانه، بطوله
const DATA = {
    صفع:   ['👋💥 صفعة بالحجم الكبير!','🤚 صفعة نايمة!','👋 والله صفعة جامدة!','💥 صفعة نار!','👋 آخ! صفعة موجعة!'],
    قصف:   ['💣💥 قصف جوي!','🚀 صاروخ في الطريق!','💥 قصف مدفعي!','🔥 قصف ناري!','💣 قنبلة أرضية!'],
    اهانه: ['😂 أنت أضحك حاجة شفتها!','🤣 يا سلام عليك!','😏 اتعلم الأدب الأول!','💀 واللهي مش فاهم إزاي بتعيش!','🤦 أنا آسف على وقتك!'],
    بطوله: ['🦸 بطل الجروب!','⚔️ محارب لا يُقهر!','🏅 بطولة حقيقية!','🦁 شجاعة أسد!','⚡ بطل الأبطال!'],
    كومنت: ['🔥 تعليق ناري!','💯 تعليق في الصميم!','😂 تعليق مضحك!','✨ تعليق رائع!','👌 تعليق ممتاز!'],
};
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const handler = async (m, { conn, command }) => {
    const target  = m.mentionedJid?.[0] || m.quoted?.sender;
    const mention = target ? `@${target.split('@')[0]}` : (m.pushName || 'صاحبي');
    return conn.sendMessage(m.chat, {
        text: `${mention}\n\n${rnd(DATA[command])}`,
        mentions: target ? [target] : []
    }, { quoted: m });
};
handler.usage    = Object.keys(DATA);
handler.tags = ['fun'];
handler.command  = Object.keys(DATA);
export default handler;
