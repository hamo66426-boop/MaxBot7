import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const pending = () => global.maxWhisperPending ||= {};
const whispers = () => global.maxWhisperMessages ||= {};

const token = () => Math.random().toString(36).slice(2, 12);
const clean = m => String(m.text || m.body || '').trim();
const commandText = m => clean(m).replace(/^\./, '').split(/\s+/)[0];
const isGroup = chat => chat.endsWith('@g.us');
const isPrivate = m => !isGroup(m.chat) && m.sender === m.chat;
const tag = jid => `@${jid.split('@')[0]}`;

async function sendButtons(conn, chat, text, buttons, quoted) {
  const payload = {
    body: { text },
    footer: { text: 'MAX BOT • الهمسات 🤫' },
    nativeFlowMessage: {
      buttons: buttons.map(b => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: b.id
        })
      })),
      messageParamsJson: JSON.stringify({
        bottom_sheet: {
          in_thread_buttons_limit: buttons.length,
          divider_indices: buttons.map((_, i) => i + 1).concat(999),
          list_title: 'الهمسات',
          button_title: 'اختار'
        }
      })
    }
  };

  const interactiveMessage = proto.Message.InteractiveMessage.fromObject(payload);
  const msg = generateWAMessageFromContent(
    chat,
    { interactiveMessage },
    { userJid: conn.user.jid, ...(quoted ? { quoted } : {}) }
  );

  await conn.relayMessage(chat, msg.message, { messageId: msg.key.id });
}

function getName(m) {
  return m.pushName || m.sender.split('@')[0];
}

async function beginWhisper(conn, m, target, group, targetName, senderName) {
  const t = token();

  pending()[m.sender] = {
    token: t,
    group,
    target,
    targetName,
    senderName,
    startedAt: Date.now(),
    stage: 'ready'
  };

  await conn.sendMessage(group, {
    text: `🤫 *همسة جديدة*\n\n${tag(m.sender)} عايز يهمس لـ ${tag(target)}.\nاضغط على الزر لبدء كتابة الهمسة.`,
    mentions: [m.sender, target]
  });

  await sendButtons(
    conn,
    group,
    '💌 اضغط لبدء الهمسة في الخاص.',
    [{ text: 'اهمس هنا 🤫', id: `.whisper_start_${t}` }],
    m
  );
}

const handler = async (m, { conn }) => {
  const cmd = commandText(m);
  const sender = m.sender;

  if (cmd === 'همسه' || cmd === 'همسة') {
    if (!isGroup(m.chat)) {
      await conn.sendMessage(m.chat, { text: 'استخدم الأمر في جروب، بالرد على رسالة الشخص اللي عايز تهمس له.' });
      return;
    }

    const target = m.quoted?.sender;
    if (!target) {
      await conn.sendMessage(m.chat, { text: 'رد على رسالة الشخص واكتب .همسه 🤫' });
      return;
    }

    if (target === sender || target === conn.user.id) {
      await conn.sendMessage(m.chat, { text: 'مينفعش تهمس لنفسك 😅' });
      return;
    }

    const targetName = m.quoted?.pushName || target.split('@')[0];
    await beginWhisper(conn, m, target, m.chat, targetName, getName(m));
    return;
  }

  const start = cmd.match(/^whisper_start_([a-z0-9]+)$/i);
  if (start) {
    const p = pending()[sender];

    if (!p || p.token !== start[1] || p.stage !== 'ready' || Date.now() - p.startedAt > 10 * 60 * 1000) {
      await conn.sendMessage(m.chat, { text: 'الطلب انتهى أو مش صالح. ابدأ همسة جديدة من الجروب.' });
      return;
    }

    if (!isGroup(m.chat) || m.chat !== p.group) return;

    p.stage = 'writing';
    p.startedAt = Date.now();

    try {
      await conn.sendMessage(sender, {
        text: `🤫 *اكتب همستك هنا في رسالة واحدة.*\n\nالمستلم: ${p.targetName}\nبعد الإرسال هيوصل للطرفين زر لعرض الهمسة في الخاص.\n⏳ الطلب صالح لمدة 10 دقايق.`
      });
    } catch {
      p.stage = 'ready';
      await conn.sendMessage(m.chat, {
        text: 'مش قادر أبعتلك في الخاص. افتح محادثة البوت وابعتله رسالة، وبعدها جرّب الزر تاني.'
      });
    }
    return;
  }

  const view = cmd.match(/^whisper_view_([a-z0-9]+)$/i);
  if (view) {
    const w = whispers()[view[1]];
    if (!w || Date.now() > w.expiresAt) {
      await conn.sendMessage(m.chat, { text: 'الهمسة انتهت صلاحيتها أو مش موجودة.' });
      return;
    }

    if (sender !== w.sender && sender !== w.target) {
      await conn.sendMessage(m.chat, { text: 'الهمسة دي مش مخصصة ليك.' });
      return;
    }

    try {
      await conn.sendMessage(sender, {
        text: `📩 *الهمسة الخاصة بيك*\n\n${w.text}\n\n🤫 خلي بالك، دي رسالة خاصة.`
      });
    } catch {
      await conn.sendMessage(m.chat, { text: 'افتح الخاص مع البوت وابعتله رسالة، وبعدها جرّب تاني.' });
    }
    return;
  }

  const reply = cmd.match(/^whisper_reply_([a-z0-9]+)$/i);
  if (reply) {
    const w = whispers()[reply[1]];
    if (!w || Date.now() > w.expiresAt) {
      await conn.sendMessage(m.chat, { text: 'الهمسة انتهت صلاحيتها.' });
      return;
    }

    if (sender !== w.target) {
      await conn.sendMessage(m.chat, { text: 'زر الرد ده مخصص لمستلم الهمسة.' });
      return;
    }

    const t = token();
    pending()[sender] = {
      token: t,
      group: w.group,
      target: w.sender,
      targetName: w.senderName,
      senderName: w.targetName,
      startedAt: Date.now(),
      stage: 'writing'
    };

    try {
      await conn.sendMessage(sender, {
        text: `🤫 *اكتب همستك لـ ${w.senderName} في رسالة واحدة.*\nهتتبعت له في الخاص بعد الإرسال.`
      });
    } catch {
      delete pending()[sender];
      await conn.sendMessage(m.chat, { text: 'مش قادر أبعتلك في الخاص. افتح محادثة البوت وابعتله رسالة ثم جرّب تاني.' });
    }
    return;
  }
};

handler.before = async function (m, { conn }) {
  if (!isPrivate(m)) return;
  if (typeof m.text !== 'string') return;
  if (m.text.trim().startsWith('.')) return;

  const p = pending()[m.sender];
  if (!p || p.stage !== 'writing') return;
  if (Date.now() - p.startedAt > 10 * 60 * 1000) {
    delete pending()[m.sender];
    await conn.sendMessage(m.chat, { text: 'انتهى وقت كتابة الهمسة. ابدأ من الجروب من جديد.' });
    return true;
  }

  const text = m.text.trim();
  if (!text) return;

  const id = token();
  const w = {
    sender: m.sender,
    target: p.target,
    senderName: p.senderName || m.pushName || m.sender.split('@')[0],
    targetName: p.targetName,
    group: p.group,
    text,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  };

  whispers()[id] = w;
  delete pending()[m.sender];

  try {
    await conn.sendMessage(m.chat, {
      text: '✅ اتبعتت الهمسة. تقدر أنت والمستلم تشوفوها من زر «رؤية الهمسة».'
    });

    await sendButtons(
      conn,
      w.group,
      `💌 *وصلت همسة خاصة!*\n\nمن: ${tag(w.sender)}\nإلى: ${tag(w.target)}\n\nمحتوى الهمسة مش ظاهر في الجروب.`,
      [
        { text: 'رؤية الهمسة 📩', id: `.whisper_view_${id}` },
        { text: `اهمس لـ ${w.senderName}`, id: `.whisper_reply_${id}` }
      ]
    );
  } catch (e) {
    delete whispers()[id];
    await conn.sendMessage(m.chat, {
      text: 'حصل خطأ أثناء إرسال الهمسة. جرّب مرة تانية.'
    });
  }

  return true;
};

handler.help = ['همسه'];
handler.tags = ['group'];
handler.command = /^(همسه|همسة|whisper_start_[a-z0-9]+|whisper_view_[a-z0-9]+|whisper_reply_[a-z0-9]+)$/i;

export default handler;
