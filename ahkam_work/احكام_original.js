const sessions = () => {
  if (!global.maxAhkamSessions) {
    global.maxAhkamSessions = {};
  }
  return global.maxAhkamSessions;
};

const getKey = (m, conn) =>
  `${conn.user?.id || 'main'}:${m.chat}`;

const getText = (m) =>
  String(m.text || m.body || '').trim().replace(/\s+/g, ' ');

const mention = (jid) => `@${jid.split('@')[0]}`;

async function handler(m, { conn }) {
  if (!m.isGroup) {
    return m.reply('❄️ لعبة أحكام متاحة في الجروبات فقط.');
  }

  const all = sessions();
  const key = getKey(m, conn);

  if (all[key]) {
    return m.reply(
      '⚠️ فيه لعبة أحكام مفتوحة بالفعل في الجروب ده.'
    );
  }

  all[key] = {
    organizer: m.sender,
    players: [m.sender]
  };

  return conn.sendMessage(m.chat, {
    text:
      '⚖️ *بدأت لعبة أحكام!*\n\n' +
      '✅ تم تسجيل المنظّم تلقائيًا.\n' +
      '👥 اللي عايز يلعب يكتب: *انا*\n' +
      '🔒 لإنهاء التسجيل، المنظّم الأصلي يكتب: *نعم*\n\n' +
      '🎮 لازم يكون فيه لاعبان على الأقل لبدء الجولة.'
  }, { quoted: m });
}

handler.before = async function (m, { conn }) {
  if (!m.text && !m.body) return;
  if (m.isGroup !== true) return;

  const text = getText(m);
  if (text !== 'انا' && text !== 'أنا' && text !== 'نعم') {
    return;
  }

  const all = sessions();
  const key = getKey(m, conn);
  const game = all[key];

  if (!game) return;

  if (text === 'انا' || text === 'أنا') {
    if (game.players.includes(m.sender)) {
      await m.reply('✅ إنت مسجّل بالفعل في لعبة أحكام.');
      return true;
    }

    game.players.push(m.sender);

    await conn.sendMessage(m.chat, {
      text:
        `✅ تم إضافتك للعبة يا ${mention(m.sender)}\n` +
        '⏳ مستنيين المنظّم يكتب *نعم* لإنهاء التسجيل.',
      mentions: [m.sender]
    });

    return true;
  }

  if (m.sender !== game.organizer) {
    await m.reply('🔒 إنهاء التسجيل من حق منظّم اللعبة بس.');
    return true;
  }

  if (game.players.length < 2) {
    await m.reply(
      '⚠️ مينفعش تبدأ اللعبة لوحدك!\n' +
      '👥 لازم لاعب إضافي واحد على الأقل يكتب *انا*.'
    );
    return true;
  }

  const players = [...game.players];
  const targetIndex = Math.floor(Math.random() * players.length);
  const target = players[targetIndex];

  const judges = players.filter(id => id !== target);
  const judge = judges[Math.floor(Math.random() * judges.length)];

  delete all[key];

  await conn.sendMessage(m.chat, {
    text:
      '⚖️ *نتيجة لعبة أحكام* ⚖️\n\n' +
      `↢ اخترت الشخص ↤︎ ${mention(target)} ليتم الحكم عليه\n\n` +
      `↢ الحاكم ↤︎ ${mention(judge)}\n\n` +
      '🎮 انتهت الجولة! لبدء لعبة جديدة اكتبوا *.احكام*.',
    mentions: [target, judge]
  });

  return true;
};

handler.help = ['احكام'];
handler.tags = ['games'];
handler.command = /^احكام$/i;

export default handler;
