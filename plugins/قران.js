const surahs = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

const sheikhs = {
    '1': { name: 'مشاري العفاسي', url: 'https://server8.mp3quran.net/afs' },
    '2': { name: 'عبد الباسط عبد الصمد', url: 'https://server7.mp3quran.net/basit' },
    '3': { name: 'ماهر المعيقلي', url: 'https://server12.mp3quran.net/maher' },
    '4': { name: 'ياسر الدوسري', url: 'https://server11.mp3quran.net/yasser' },
    '5': { name: 'فارس عباد', url: 'https://server8.mp3quran.net/frs_a' },
    '6': { name: 'سعد الغامدي', url: 'https://server7.mp3quran.net/s_gmd' },
    '7': { name: 'عبد الرحمن السديس', url: 'https://server11.mp3quran.net/sds' },
    '8': { name: 'خالد الجليل', url: 'https://server10.mp3quran.net/jleel' },
    '9': { name: 'محمد اللحيدان', url: 'https://server8.mp3quran.net/lhdan' },
    '10': { name: 'إدريس أبكر', url: 'https://server6.mp3quran.net/abkr' },
    '11': { name: 'منصور السالمي', url: 'https://server14.mp3quran.net/mansor' },
    '12': { name: 'محمد متولي الشعراوي', url: 'https://server11.mp3quran.net/shaarawi' }
};

const QURAN_IMAGE = "https://files.catbox.moe/qeqajh.jpg";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let args = text ? text.trim().split(/\s+/) : [];

    // عرض قائمة المشايخ
    if (args.length === 0 || !sheikhs[args[0]]) {
        let rows = [];
        for (let key in sheikhs) {
            rows.push({
                header: "",
                title: sheikhs[key].name,
                description: "استمع للقرآن الكريم بصوت القارئ",
                id: `.${command} ${key}`
            });
        }

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🕋 *المكتبة الصوتية للقرآن الكريم*

🎙️ *اختر الشيخ المفضل لديك:*

💡 *اضغط على الزر لاختيار القارئ*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        let sections = [{
            title: "🎙️ قائمة القراء",
            rows: rows
        }];

        try {
            await conn.sendMessage(m.chat, {
                image: { url: QURAN_IMAGE },
                caption: msg,
                footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
                headerType: 'DOCUMENT',
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "اخـتـر الـقـارئ",
                            sections: sections
                        })
                    }
                ]
            }, { quoted: m });
        } catch (e) {
            // fallback
            let fallback = Object.entries(sheikhs).map(([k, v]) => `├ׁ̟̇˚₊· ͟͟͞͞➳❥ .${command} ${k} - ${v.name}`).join('\n');
            await conn.reply(m.chat, msg + '\n\n' + fallback, m);
        }
        return;
    }

    let sheikhId = args[0];
    let sheikh = sheikhs[sheikhId];

    // عرض قائمة السور
    if (args.length === 1) {
        let rowsPart1 = [];
        let rowsPart2 = [];

        for (let i = 0; i < 60; i++) {
            rowsPart1.push({
                header: "",
                title: `سورة ${surahs[i]}`,
                description: `ترتيبها: ${i + 1}`,
                id: `.${command} ${sheikhId} ${i + 1}`
            });
        }

        for (let i = 60; i < surahs.length; i++) {
            rowsPart2.push({
                header: "",
                title: `سورة ${surahs[i]}`,
                description: `ترتيبها: ${i + 1}`,
                id: `.${command} ${sheikhId} ${i + 1}`
            });
        }

        let msg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🕋 *فهرس القرآن الكريم*

🎙️ *الشيخ:* ${sheikh.name}

📖 *اختر السورة من القائمتين*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        let sections1 = [{ title: "📖 السور من 1 إلى 60", rows: rowsPart1 }];
        let sections2 = [{ title: "📖 السور من 61 إلى 114", rows: rowsPart2 }];

        try {
            await conn.sendMessage(m.chat, {
                image: { url: QURAN_IMAGE },
                caption: msg,
                footer: '𝑴𝑨𝑿 𝑩𝑶𝑻 👑',
                headerType: 'DOCUMENT',
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "السور من 1 إلى 60",
                            sections: sections1
                        })
                    },
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "السور من 61 إلى 114",
                            sections: sections2
                        })
                    }
                ]
            }, { quoted: m });
        } catch (e) {
            await conn.reply(m.chat, msg + `\n\n📝 *استخدم:* .${command} ${sheikhId} [رقم السورة]`, m);
        }
        return;
    }

    // إرسال السورة الصوتية
    let surahId = parseInt(args[1]);
    
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        return conn.reply(m.chat, '❌ *رقم السورة غير صحيح! (1-114)*', m);
    }

    let formattedSurahId = String(surahId).padStart(3, '0');
    let audioUrl = `${sheikh.url}/${formattedSurahId}.mp3`;
    let surahName = surahs[surahId - 1];

    let loadingMsg = await conn.sendMessage(m.chat, { 
        text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻\n⏳ *جاري تجهيز سورة ${surahName}...*\n🎙️ *الشيخ:* ${sheikh.name}\n𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`
    }, { quoted: m });

    try {
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, { delete: loadingMsg.key });

        let doneMsg = `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝑴𝑨𝑿 𝑩𝑶𝑻 ͟͟͞͞➳ 𝑴𝑨𝑿 𝑩𝑶𝑻
🕋 *سورة ${surahName}*

🎙️ *الشيخ:* ${sheikh.name}

✅ *تم الإرسال بنجاح*

​➥ 𝑴𝑨𝑿 𝑩𝑶𝑻 👑
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

        await conn.sendMessage(m.chat, { text: doneMsg }, { quoted: m });

    } catch (err) {
        console.error('[قرآن] error:', err.message);
        try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }); } catch (e) {}
        conn.reply(m.chat, '❌ *السورة غير متوفرة لهذا القارئ حالياً.*', m);
    }
};

handler.help = ['قران', 'قرآن'];
handler.tags = ['quran'];
handler.command = /^(قران|قرآن|ق)$/i;

export default handler;