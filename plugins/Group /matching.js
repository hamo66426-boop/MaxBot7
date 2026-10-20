const handler = async (m, { conn }) => {
    try {
        const { Scrapy } = await import('drakon');
        const res = await Scrapy.Matching();
        const parsed = typeof res === 'string' ? JSON.parse(res) : res;
        const data = parsed?.data;

        if (!data?.boy || !data?.girl) {
            throw new Error('Matching API returned invalid data');
        }

        const caption = '💕 *تـطـقـيـم الـيـوم*\n\n➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑\n💡 للتالي اكتب .تطقيم';

        await conn.sendMessage(m.chat, {
            image: { url: data.boy },
            caption: `👦 *Boy*\n\n${caption}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            image: { url: data.girl },
            caption: `👧 *Girl*\n\n${caption}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });

    } catch (err) {
        console.error('[تطقيم - DRAKON] error:', err);
        await conn.reply(m.chat, '❌ حصل خطأ في جلب الصور. راجع سجل التيرمكس لمعرفة السبب.', m);
    }
};

handler.help = ['تطقيم', 'ماتشينج'];
handler.tags = ['group'];
handler.command = /^(تطقيم|ماتشينج|matching)$/i;
handler.group = true;

export default handler;
