import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const games = () => global.maxAhkamSessions ||= {};
const mutes = () => global.maxAhkamMutes ||= {};
const keyOf = (m, conn) => `${conn.user?.id || 'main'}:${m.chat}`;
const textOf = m => String(m.text || m.body || '').trim().replace(/\s+/g, ' ');
const tag = jid => `@${jid.split('@')[0]}`;
const token = () => Math.random().toString(36).slice(2, 9);

const rulings = [
  'احكي موقف مضحك حصل لك، ولو مش حابب تخطي.',
  'قول 3 حاجات بتحبها في شخصيتك.',
  'قلّد صوت شخصية كرتونية لمدة 10 ثوانٍ.',
  'اذكر 5 أسماء بلاد في 10 ثوانٍ.',
  'قول لغزًا للمجموعة وخليهم يحلوه.',
  'اتكلم بالفصحى لمدة دقيقتين.',
  'قول نكتة خفيفة للمجموعة.',
  'اذكر 5 أكلات بحرف الميم.',
  'احكي عن هواية نفسك تتعلمها.',
  'اختار لاعبًا واسأله سؤالًا لطيفًا، ومن حقه يرفض الإجابة.'
];

async function interactive(conn, m, payload) {
  const content = proto.Message.InteractiveMessage.fromObject(payload);
  const msg = generateWAMessageFromContent(
    m.chat, { interactiveMessage: content },
    { userJid: conn.user.jid, quoted: m }
  );
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

async function buttons(conn, m, game) {
  const t = game.token;
  const payload = {
    body: { text: '⚖️ *اختاروا الخطوة الجاية:*\nالحاكم المختار وحده يقدر يستخدم الأزرار.' },
    footer: { text: 'MAX BOT • لعبة أحكام' },
    nativeFlowMessage: {
      buttons: [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '✅ نفّذ الحكم', id: `.ahkam_done_${t}` }) },
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🔇 رفض تنفيذ الحكم', id: `.ahkam_refuse_${t}` }) },
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '⚖️ اختار حكم', id: `.ahkam_choose_${t}` }) }
      ],
      messageParamsJson: JSON.stringify({
        bottom_sheet: {
          in_thread_buttons_limit: 3,
          divider_indices: [1, 2, 3, 999],
          list_title: 'لعبة أحكام',
          button_title: 'اختار إجراء'
        }
      })
    }
  };
  await interactive(conn, m, payload);
}

async function chooseRuling(conn, m, game) {
  const rows = rulings.map((r, i) => ({
    header: `الحكم ${i + 1}`,
    title: r.length > 24 ? r.slice(0, 24) + '…' : r,
    description: 'اضغط لاختيار هذا الحكم',
    id: `.ahkam_pick_${game.token}_${i}`
  }));
  await interactive(conn, m, {
    body: { text: '⚖️ *اختار الحكم المناسب.*\nمسموح تخطي أي سؤال شخصي.' },
    footer: { text: 'MAX BOT • أحكام خفيفة وآمنة' },
    nativeFlowMessage: {
      buttons: [{
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '⚖️ قائمة الأحكام',
          sections: [{ title: 'الأحكام المتاحة', rows }]
        })
      }],
      messageParamsJson: JSON.stringify({
        bottom_sheet: {
          in_thread_buttons_limit: 1,
          divider_indices: [1, 999],
          list_title: 'قائمة الأحكام',
          button_title: 'عرض الأحكام'
        }
      })
    }
  });
}

async function handler(m, { conn }) {
  if (!m.isGroup) return m.reply('❄️ لعبة أحكام متاحة في الجروبات فقط.');
  const all = games();
  const key = keyOf(m, conn);
  if (all[key]) return m.reply('⚠️ فيه لعبة أحكام مفتوحة بالفعل في الجروب ده.');

  all[key] = {
    organizer: m.sender,
    players: [m.sender],
    phase: 'register',
    token: token()
  };
  await conn.sendMessage(m.chat, {
    text: '⚖️ *بدأت لعبة أحكام!*\n\n✅ المنظّم اتسجل تلقائيًا.\n👥 اللي عايز يلعب يكتب: *انا*\n🔒 المنظّم الأصلي ينهي التسجيل بكتابة *نعم*.\n\n🎮 لازم لاعبان على الأقل لبدء الجولة.'
  }, { quoted: m });
}

handler.before = async function (m, { conn }) {
  if (m.isGroup !== true || !m.sender) return;
  const key = keyOf(m, conn);
  const all = games();
  const game = all[key];
  const text = textOf(m);

  // محاولة حذف رسائل اللاعب الرافض خلال مدة العقوبة.
  const muted = mutes()[key];
  if (muted && muted.until > Date.now() && muted.jid === m.sender) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error('[أحكام] تعذر حذف رسالة اللاعب:', e.message);
    }
    return true;
  } else if (muted && muted.until <= Date.now()) {
    delete mutes()[key];
    await conn.sendMessage(m.chat, {
      text: `🔊 انتهت مدة التقييد، يقدر ${tag(muted.jid)} يتكلم تاني.`,
      mentions: [muted.jid]
    });
  }

  if (!game) return;
  if (game.phase === 'register' && (text === 'انا' || text === 'أنا')) {
    if (game.players.includes(m.sender)) {
      await m.reply('✅ إنت مسجّل بالفعل في لعبة أحكام.');
    } else {
      game.players.push(m.sender);
      await conn.sendMessage(m.chat, {
        text: `✅ تم إضافتك للعبة يا ${tag(m.sender)}\n⏳ مستنيين المنظّم يكتب *نعم* لإنهاء التسجيل.`,
        mentions: [m.sender]
      });
    }
    return true;
  }

  if (game.phase === 'register' && text === 'نعم') {
    if (m.sender !== game.organizer) {
      await m.reply('🔒 إنهاء التسجيل من حق المنظّم بس.');
      return true;
    }
    if (game.players.length < 2) {
      await m.reply('⚠️ لازم لاعب إضافي واحد على الأقل يكتب *انا*.');
      return true;
    }

    const target = game.players[Math.floor(Math.random() * game.players.length)];
    const possibleJudges = game.players.filter(id => id !== target);
    const judge = possibleJudges[Math.floor(Math.random() * possibleJudges.length)];
    game.target = target;
    game.judge = judge;
    game.phase = 'decision';

    await conn.sendMessage(m.chat, {
      text: `⚖️ *نتيجة لعبة أحكام*\n\n↢ اخترت الشخص ↤︎ ${tag(target)} ليتم الحكم عليه\n\n↢ الحاكم ↤︎ ${tag(judge)}\n\nالحاكم يختار الإجراء من الأزرار التالية.`,
      mentions: [target, judge]
    });
    await buttons(conn, m, game);
    return true;
  }

  const action = text.match(/^\.ahkam_(done|refuse|choose)_([a-z0-9]+)$/i);
  const pick = text.match(/^\.ahkam_pick_([a-z0-9]+)_(\d+)$/i);
  if (!action && !pick) return;
  if (!game || game.phase !== 'decision' || m.sender !== game.judge) {
    await m.reply('🔒 الأزرار دي خاصة بالحاكم المختار وفي الجولة الحالية فقط.');
    return true;
  }

  if (action && action[2] !== game.token) return true;
  if (pick && pick[1] !== game.token) return true;

  if (action?.[1] === 'choose') {
    await chooseRuling(conn, m, game);
    return true;
  }

  if (pick) {
    const index = Number(pick[2]);
    if (!Number.isInteger(index) || index < 0 || index >= rulings.length) return true;
    game.phase = 'closed';
    await conn.sendMessage(m.chat, {
      text: `⚖️ *الحكم المختار*\n\n${rulings[index]}\n\n${tag(game.target)} الدور عليك، وتقدر تتخطى أي سؤال شخصي.`,
      mentions: [game.target]
    });
    delete all[key];
    return true;
  }

  if (action?.[1] === 'done') {
    game.phase = 'closed';
    await conn.sendMessage(m.chat, {
      text: `✅ أعلن الحاكم تنفيذ الحكم على ${tag(game.target)}.\n🎮 انتهت الجولة! لبدء لعبة جديدة اكتبوا *.احكام*.`,
      mentions: [game.target]
    });
    delete all[key];
    return true;
  }

  if (action?.[1] === 'refuse') {
    game.phase = 'closed';
    const until = Date.now() + 3 * 60 * 1000;
    mutes()[key] = { jid: game.target, until };
    await conn.sendMessage(m.chat, {
      text: `🔇 ${tag(game.target)} رفض تنفيذ الحكم.\nسيحاول البوت حذف رسائله لمدة 3 دقائق، بشرط امتلاكه صلاحية الحذف في الجروب.`,
      mentions: [game.target]
    });
    setTimeout(async () => {
      const current = mutes()[key];
      if (current && current.until === until) {
        delete mutes()[key];
        try {
          await conn.sendMessage(m.chat, {
            text: `🔊 انتهت مدة التقييد، يقدر ${tag(game.target)} يتكلم تاني.`,
            mentions: [game.target]
          });
        } catch (e) {}
      }
    }, 3 * 60 * 1000);
    delete all[key];
    return true;
  }
};

handler.help = ['احكام'];
handler.tags = ['games'];
handler.command = /^احكام$/i;
export default handler;
