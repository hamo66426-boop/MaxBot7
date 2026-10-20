/**
 * lib/aiAgent/llm/executionMap.js
 * -------------------------------------------------------------
 * التنفيذ الحقيقي لكل أداة، باستخدام نفس نداءات Baileys الموجودة
 * فعليًا في بلجنات المشروع الأصلي (مش نداءات مخترعة):
 *
 *   - manageGroup:lock/unlock   -> conn.groupSettingUpdate()
 *       (مصدر: plugins/admin/ctrl_group.js)
 *   - manageGroup:rename        -> conn.groupUpdateSubject()
 *       (مصدر: plugins/admin/gruop_name_description_pic.js)
 *   - manageGroup:set_description -> conn.groupUpdateDescription()
 *       (نفس المصدر أعلاه)
  *   - manageGroup:change_photo  -> uploadProfilePicture() [استراتيجيات متعددة]
 *       ملاحظة مهمة: نسخة Baileys المستخدمة في المشروع ده بترمي خطأ
 *       غامض ("reading 'read'") مع أكتر من شكل مدخلات لنفس الدالة.
 *       عشان كده uploadProfilePicture() بتجرب 4 أشكال مختلفة بالترتيب
 *       (رابط ملف، Buffer خام، stream، كائن URL) وتوقف عند أول واحد ينجح،
 *       وتجمع كل رسائل الفشل لو الكل فشل عشان تشخيص أدق.
 *   - changeBotPhoto            -> uploadProfilePicture() [نفس الآلية أعلاه]
 *   - moderateMember:kick/promote/demote -> conn.groupParticipantsUpdate()
 *       (مصدر: plugins/admin/control.js)
 *   - createSticker             -> wa-sticker-formatter (نفس اللي بيستخدمه plugins/sticker/*)
 *   - getGroupInfo              -> conn.groupMetadata() (قراءة فقط)
 *
 * كل دالة بترجع { ok: true, ... } أو { ok: false, reason }.
 * ملحوظة: مفيش أي دالة هنا بترجع ok:true من غير ما تعمل نداء
 * Baileys حقيقي وتستنى نتيجته (await).
 */

import fs from "fs";
import os from "os";
import path from "path";
import { isProtectedOwnerTarget } from "../security.js";
import { resolveTargetMember } from "../contextResolver.js";

/**
 * بعض نسخ مكتبة Baileys بتعمل معالجة داخلية للصورة (تصغير/قص) قبل رفعها
 * كصورة بروفايل، ومعالجة الصورة دي ممكن تفشل بخطأ تقني غامض لو الصورة
 * مش بمواصفات معينة (صيغة/أبعاد/قناة شفافية). عشان نتجنب المشكلة دي
 * تمامًا، بنعيد ترميز الصورة إحنا بنفسنا لصورة مربّعة JPEG نضيفة (640x640،
 * بدون شفافية) قبل ما نديها لـ conn.updateProfilePicture.
 *
 * @param {Buffer} buffer
 * @returns {Promise<Buffer>}
 */
async function normalizeProfilePicture(buffer) {
  const sharp = (await import("sharp")).default;
  return sharp(buffer)
    .flatten({ background: "#ffffff" }) // شيل أي شفافية (بعض نسخ Baileys بتفشل مع PNG شفاف)
    .resize(640, 640, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * بيكتب الـ Buffer في ملف مؤقت وبيرجع مسار file:// URL ليه.
 * مطلوب لأن conn.updateProfilePicture في نسخة Baileys دي مش بتقبل
 * Buffer مباشر (شوف الملاحظة في أعلى الملف).
 * @param {Buffer} buffer
 * @returns {Promise<{url: string, cleanup: () => void}>}
 */
async function bufferToFileUrl(buffer) {
  const tmpPath = path.join(os.tmpdir(), `king-bot-pp-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  await fs.promises.writeFile(tmpPath, buffer);
  return {
    path: tmpPath,
    url: `file://${tmpPath}`,
    cleanup: () => fs.promises.unlink(tmpPath).catch(() => {}),
  };
}

/**
 * بيحاول يرفع صورة البروفايل بأكتر من شكل (Baileys بتقبل أشكال مختلفة
 * حسب النسخة/الفورك)، وأول شكل ينجح بيوقف عنده. لو الكل فشل، بيرجع
 * كل رسائل الخطأ مجمّعة عشان يبقى فيه تشخيص أوضح.
 *
 * @param {object} conn
 * @param {string} jid - المجموعة أو conn.user.jid
 * @param {Buffer} buffer - صورة متجهزة بالفعل (مربّعة/JPEG)
 * @returns {Promise<{ok: true, via: string} | {ok: false, errors: string[]}>}
 */
async function uploadProfilePicture(conn, jid, buffer) {
  const tmpFile = await bufferToFileUrl(buffer);
  const errors = [];

  const strategies = [
    {
      // مؤكد إنها شغالة (جربها المستخدم بنفسه) — بتتخطى conn.updateProfilePicture
      // المكسورة تمامًا وبتبعت طلب IQ خام لسيرفرات واتساب مباشرة.
      name: "raw-iq-stanza",
      run: () =>
        conn.query({
          tag: "iq",
          attrs: {
            ...(jid !== conn.user.jid ? { target: jid } : {}),
            to: "@s.whatsapp.net",
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [{ tag: "picture", attrs: { type: "image" }, content: buffer }],
        }),
    },
    { name: "file-url-string", run: () => conn.updateProfilePicture(jid, { url: tmpFile.url }) },
    { name: "raw-buffer", run: () => conn.updateProfilePicture(jid, buffer) },
    { name: "read-stream", run: () => conn.updateProfilePicture(jid, { stream: fs.createReadStream(tmpFile.path) }) },
    { name: "file-url-object", run: () => conn.updateProfilePicture(jid, { url: new URL(tmpFile.url) }) },
  ];

  for (const strategy of strategies) {
    try {
      await strategy.run();
      setTimeout(() => tmpFile.cleanup(), 8000);
      return { ok: true, via: strategy.name };
    } catch (err) {
      if (errors.length === 0) {
        const shortStack = (err.stack || "").split("\n").slice(0, 4).join("\n");
        errors.push(`${strategy.name}: ${err.message}\n${shortStack}`);
      } else {
        errors.push(`${strategy.name}: ${err.message}`);
      }
    }
  }

  setTimeout(() => tmpFile.cleanup(), 8000);
  return { ok: false, errors };
}

export async function execManageGroup(m, conn, args) {
  const { action, value } = args || {};
  try {
    switch (action) {
      case "lock":
        await conn.groupSettingUpdate(m.chat, "announcement");
        return { ok: true };

      case "unlock":
        await conn.groupSettingUpdate(m.chat, "not_announcement");
        return { ok: true };

      case "rename": {
        if (!value) return { ok: false, reason: "محتاج تحدد الاسم الجديد للمجموعة." };
        await conn.groupUpdateSubject(m.chat, value);
        return { ok: true, value };
      }

      case "set_description": {
        if (!value) return { ok: false, reason: "محتاج تحدد الوصف الجديد للمجموعة." };
        await conn.groupUpdateDescription(m.chat, value);
        return { ok: true, value };
      }

      case "change_photo": {
        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || "";
        if (!/image/.test(mime)) {
          return { ok: false, reason: "لازم ترد (reply) على صورة عشان أقدر أغيّر بيها صورة المجموعة." };
        }

        let media;
        try {
          media = await q.download();
        } catch (dlErr) {
          return {
            ok: false,
            reason: `مقدرتش أحمّل الصورة (ممكن تكون قديمة/منتهية). جرب ترد على صورة تانية حديثة. (${dlErr.message})`,
          };
        }
        if (!media || !media.length) {
          return {
            ok: false,
            reason: "الصورة اللي رديت عليها مبقتش متاحة للتحميل (غالبًا لأنها قديمة). ابعت صورة جديدة وردّ عليها بنفس الأمر.",
          };
        }

        let normalized;
        try {
          normalized = await normalizeProfilePicture(media);
        } catch (procErr) {
          return { ok: false, reason: `فشلت معالجة الصورة قبل الرفع. (${procErr.message})` };
        }
        const upload = await uploadProfilePicture(conn, m.chat, normalized);
        if (!upload.ok) {
          return {
            ok: false,
            reason: `[V3] فشل رفع الصورة كصورة للمجموعة بعد تجربة ${upload.errors.length} طرق مختلفة، تأكد إن البوت أدمن في المجموعة.\n${upload.errors.map((e) => `- ${e}`).join("\n")}`,
          };
        }
        return { ok: true };
      }

      default:
        return { ok: false, reason: "إجراء غير معروف." };
    }
  } catch (err) {
    return { ok: false, reason: `فشل تنفيذ الأمر، تأكد إن البوت أدمن في المجموعة. (${err.message})` };
  }
}

export async function execChangeBotPhoto(m, conn) {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";
  if (!/image/.test(mime)) {
    return { ok: false, reason: "لازم ترد (reply) على صورة عشان أقدر أغيّر بيها صورة البوت." };
  }

  let media;
  try {
    media = await q.download();
  } catch (dlErr) {
    return {
      ok: false,
      reason: `مقدرتش أحمّل الصورة (ممكن تكون قديمة/منتهية). جرب ترد على صورة تانية حديثة. (${dlErr.message})`,
    };
  }
  if (!media || !media.length) {
    return {
      ok: false,
      reason: "الصورة اللي رديت عليها مبقتش متاحة للتحميل (غالبًا لأنها قديمة). ابعت صورة جديدة وردّ عليها بنفس الأمر.",
    };
  }

  let normalized;
  try {
    normalized = await normalizeProfilePicture(media);
  } catch (procErr) {
    return { ok: false, reason: `فشلت معالجة الصورة قبل الرفع. (${procErr.message})` };
  }
  const upload = await uploadProfilePicture(conn, conn.user.jid, normalized);
  if (!upload.ok) {
    return {
      ok: false,
      reason: `[V3] فشل رفع الصورة كصورة للبوت بعد تجربة ${upload.errors.length} طرق مختلفة.\n${upload.errors.map((e) => `- ${e}`).join("\n")}`,
    };
  }
  return { ok: true };
}

export async function execModerateMember(m, conn, args, groupMetadata) {
  const { action, target_hint } = args || {};
  const target = resolveTargetMember(m, target_hint);

  if (!target) {
    return { ok: false, reason: "محتاج تحدد العضو المقصود (منشن، أو رد على رسالته، أو رقمه)." };
  }

  if (action === "kick" && isProtectedOwnerTarget(target, conn)) {
    return { ok: false, reason: "متقدرش تطرد مالك/مطور البوت." };
  }
  if (action === "demote" && isProtectedOwnerTarget(target, conn)) {
    return { ok: false, reason: "متقدرش تخفض مالك البوت." };
  }

  try {
    switch (action) {
      case "kick":
        await conn.groupParticipantsUpdate(m.chat, [target], "remove");
        return { ok: true, target };
      case "promote":
        await conn.groupParticipantsUpdate(m.chat, [target], "promote");
        return { ok: true, target };
      case "demote":
        await conn.groupParticipantsUpdate(m.chat, [target], "demote");
        return { ok: true, target };
      default:
        return { ok: false, reason: "إجراء غير معروف." };
    }
  } catch (err) {
    return { ok: false, reason: `فشل تنفيذ الأمر، تأكد من صلاحيات البوت. (${err.message})` };
  }
}

export async function execCreateSticker(m, conn) {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!/image|video/.test(mime)) {
      return { ok: false, reason: "لازم ترد (reply) على صورة أو فيديو قصير عشان أحوّله استيكر." };
    }
    const { Sticker, StickerTypes } = await import("wa-sticker-formatter");
    const media = await q.download();
    const sticker = new Sticker(media, {
      pack: "KING BOT 👑",
      author: "KING BOT",
      type: StickerTypes.FULL,
      quality: 70,
    });
    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
    return { ok: true, alreadySent: true };
  } catch (err) {
    return { ok: false, reason: `فشل عمل الاستيكر. (${err.message})` };
  }
}

export async function execGetGroupInfo(m, conn) {
  try {
    const meta = await conn.groupMetadata(m.chat);
    return { ok: true, meta };
  } catch (err) {
    return { ok: false, reason: `مقدرتش أجيب بيانات المجموعة. (${err.message})` };
  }
}

/**
 * مصدر: plugins/admin/mute.js — نفس آلية الكتم (قايمة في global.db.data.chats[chat].mute)
 */
export async function execMuteMember(m, conn, args) {
  const { action, target_hint } = args || {};
  const target = resolveTargetMember(m, target_hint);
  if (!target) {
    return { ok: false, reason: "محتاج تحدد العضو المقصود (منشن، أو رد على رسالته، أو رقمه)." };
  }
  if (isProtectedOwnerTarget(target, conn)) {
    return { ok: false, reason: "متقدرش تكتم مالك/مطور البوت." };
  }

  const chat = global.db.data.chats[m.chat];
  if (!chat.mute) chat.mute = [];
  const isMuted = chat.mute.includes(target);

  if (action === "mute") {
    if (isMuted) return { ok: false, reason: "العضو ده مكتوم بالفعل." };
    chat.mute.push(target);
    return { ok: true, target };
  }
  if (action === "unmute") {
    if (!isMuted) return { ok: false, reason: "العضو ده مش مكتوم أصلًا." };
    chat.mute = chat.mute.filter((id) => id !== target);
    return { ok: true, target };
  }
  return { ok: false, reason: "إجراء غير معروف." };
}

/**
 * مصدر: plugins/admin/warning.js — نظام إنذارات تراكمي (global.db.data.chats[chat].warnings)
 */
export async function execWarnMember(m, conn, args) {
  const { target_hint } = args || {};
  const target = resolveTargetMember(m, target_hint);
  if (!target) {
    return { ok: false, reason: "محتاج تحدد العضو المقصود (منشن، أو رد على رسالته، أو رقمه)." };
  }
  if (isProtectedOwnerTarget(target, conn)) {
    return { ok: false, reason: "متقدرش تنذر مالك/مطور البوت." };
  }

  const chat = global.db.data.chats[m.chat];
  if (!chat.warnings) chat.warnings = {};
  const userId = target.split("@")[0];
  chat.warnings[userId] = (chat.warnings[userId] || 0) + 1;

  return { ok: true, target, warnCount: chat.warnings[userId] };
}

/**
 * مصدر: plugins/admin/delete.js — حذف رسالة عن طريق مفتاحها الحقيقي (conn.sendMessage({delete}))
 */
export async function execDeleteMessage(m, conn) {
  if (!m.quoted) {
    return { ok: false, reason: "لازم ترد (reply) على الرسالة اللي عايز تحذفها." };
  }
  try {
    const targetKey = {
      remoteJid: m.chat,
      fromMe: m.quoted.fromMe,
      id: m.quoted.id,
      participant: m.quoted.sender || m.quoted.participant,
    };
    await conn.sendMessage(m.chat, { delete: targetKey });
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `مقدرتش أحذف الرسالة، تأكد إن البوت أدمن وإن الرسالة مش قديمة جدًا. (${err.message})` };
  }
}

/**
 * مصدر: plugins/admin/mention.js — منشن فئة من الأعضاء (all/admin/member) في رسالة واحدة
 */
export async function execMentionGroup(m, conn, args, groupMetadata) {
  const { scope } = args || {};
  try {
    const meta = groupMetadata || (await conn.groupMetadata(m.chat));
    const participants = meta.participants;
    const admins = participants.filter((p) => p.admin).map((p) => p.id);
    const members = participants.filter((p) => !p.admin).map((p) => p.id);

    let targets;
    let title;
    if (scope === "admin") {
      targets = admins;
      title = "👑 *مـنـشـن الـمـشـرفـيـن* 👑";
    } else if (scope === "member") {
      targets = members;
      title = "👥 *مـنـشـن الـأعـضـاء* 👥";
    } else {
      targets = participants.map((p) => p.id);
      title = "📢 *مـنـشـن لـلـجـمـيــع* 📢";
    }

    if (!targets.length) {
      return { ok: false, reason: "مفيش أعضاء في الفئة دي حاليًا." };
    }

    const lines = targets.map((id, i) => `│ ${i + 1}. @${id.split("@")[0]}`).join("\n");
    const text = `${title}\n${"─".repeat(25)}\n${lines}\n${"─".repeat(25)}\n> *إجمالي المنشن: ${targets.length}*`;
    await conn.sendMessage(m.chat, { text, mentions: targets }, { quoted: m });
    return { ok: true, alreadySent: true };
  } catch (err) {
    return { ok: false, reason: `مقدرتش أعمل المنشن. (${err.message})` };
  }
}

/**
 * بترجع نص مختصر بكل الأوامر المحمّلة فعليًا في global.plugins (اسم الأمر +
 * وصف مختصر لو موجود)، عشان تتحقن في تعليمات الموديل وقت التشغيل، فيعرف
 * الأسماء الصحيحة الحقيقية للأوامر بدل ما يخمّن. بتتبني لحظة الطلب (مش
 * ثابتة في الكود) عشان تفضل مطابقة لأي بلجن يتضاف/يتشال بعد كده.
 */
export function buildCommandCatalog() {
  const seen = new Set();
  const lines = [];
  for (const [file, plugin] of Object.entries(global.plugins || {})) {
    if (!plugin || plugin.disabled || typeof plugin !== "function") continue;
    const c = plugin.command;
    let names = [];
    if (c instanceof RegExp) {
      let cleaned = c.source.replace(/^\^/, "").replace(/\$$/, "");
      if (/^\(\?:.*\)$/.test(cleaned)) cleaned = cleaned.slice(3, -1);
      else if (/^\(.*\)$/.test(cleaned)) cleaned = cleaned.slice(1, -1);
      names = cleaned.split("|").filter(Boolean).slice(0, 3);
    } else if (Array.isArray(c)) names = c.filter((x) => typeof x === "string");
    else if (typeof c === "string") names = [c];
    if (!names.length) continue;
    const primary = names[0];
    if (!primary || seen.has(primary)) continue;
    seen.add(primary);
    const help = Array.isArray(plugin.help) ? plugin.help[0] : plugin.help;
    const tag = plugin.owner || plugin.rowner ? " [مالك فقط]" : plugin.admin ? " [مشرف فقط]" : "";
    lines.push(`- ${names.join("/")}${help ? `: ${help}` : ""}${tag}`);
  }
  return lines.join("\n");
}

/**
 * أداة عامة (fallback): بتدوّر على أي أمر حقيقي محمّل في مجلد plugins
 * مطابق للاسم اللي بعته الموديل، وتنفذه بنفس آلية handler.js بالظبط
 * (نفس فحوصات الصلاحيات: owner/rowner/admin/botAdmin/group/private/premium)،
 * بدل ما نكتب كود تنفيذ يدوي منفصل لكل أمر من الـ160 أمر.
 *
 * الأمان: صلاحيات كل أمر بتتفحص هنا فرديًا حسب خصائص البلجن نفسه (زي ما
 * بيحصل بالظبط في اللوب الأساسي بـ handler.js)، فمفيش أي تمييز عن
 * التنفيذ العادي بكتابة الأمر بالنقطة.
 */
export async function execRunBotCommand(m, conn, args, ctx = {}) {
  const rawCommand = (args?.command || "").trim();
  if (!rawCommand) return { ok: false, reason: "محتاج تحدد اسم الأمر المطلوب تنفيذه." };

  const commandWord = rawCommand.toLowerCase().split(/\s+/)[0];
  const forwardedText = (args?.text || "").trim();

  const entry = Object.entries(global.plugins || {}).find(([, plugin]) => {
    if (!plugin || plugin.disabled || typeof plugin !== "function") return false;
    const c = plugin.command;
    if (c instanceof RegExp) return c.test(commandWord);
    if (Array.isArray(c)) return c.some((cc) => (cc instanceof RegExp ? cc.test(commandWord) : cc === commandWord));
    if (typeof c === "string") return c === commandWord;
    return false;
  });

  if (!entry) {
    return { ok: false, reason: `مفيش أمر معروف اسمه "${commandWord}".` };
  }
  const [pluginName, plugin] = entry;

  const isROwner = (global.owner || [])
    .map((n) => n.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);
  const isOwner = isROwner || m.fromMe;
  const user = global.db.data.users[m.sender] || {};
  const isPrems =
    isROwner ||
    (global.prems || []).map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender) ||
    user.premium == true;
  const chat = global.db.data.chats[m.chat];
  const settings = global.db.data.settings[conn.user.jid];

  const groupMetadata = ctx.groupMetadata || {};
  const participants = (m.isGroup ? groupMetadata.participants : []) || [];
  const userGroup = (m.isGroup ? participants.find((u) => conn.decodeJid(u.jid || u.id) === m.sender) : {}) || {};
  const botGroup =
    (m.isGroup ? participants.find((u) => conn.decodeJid(u.id || u.jid) === conn.user.jid) : {}) || {};
  const isRAdmin = userGroup?.admin === "superadmin" || false;
  const isAdmin = ctx.isAdmin ?? (isRAdmin || userGroup?.admin === "admin" || false);
  const isBotAdmin = ctx.isBotAdmin ?? (botGroup?.admin || false);

  // نفس ترتيب فحوصات الصلاحيات الموجود في handler.js بالظبط
  if (plugin.rowner && plugin.owner && !(isROwner || isOwner))
    return { ok: false, reason: "الأمر ده خاص بمطور البوت فقط." };
  if (plugin.rowner && !isROwner) return { ok: false, reason: "الأمر ده خاص بمطور البوت فقط." };
  if (plugin.owner && !isOwner) return { ok: false, reason: "الأمر ده خاص بمالك البوت فقط." };
  if (plugin.premium && !isPrems) return { ok: false, reason: "الأمر ده متاح فقط للمستخدمين المميزين (Premium)." };
  if (plugin.group && !m.isGroup) return { ok: false, reason: "الأمر ده يشتغل جوه المجموعات بس." };
  if (plugin.botAdmin && !isBotAdmin) return { ok: false, reason: "لازم البوت يكون أدمن في المجموعة الأول." };
  if (plugin.admin && !isAdmin) return { ok: false, reason: "الأمر ده خاص بمشرفي المجموعة فقط." };
  if (plugin.private && m.isGroup) return { ok: false, reason: "الأمر ده يشتغل في الخاص بس." };

  const extra = {
    match: null,
    usedPrefix: "",
    noPrefix: forwardedText,
    _args: forwardedText ? forwardedText.split(" ") : [],
    args: forwardedText ? forwardedText.split(" ").filter(Boolean) : [],
    command: commandWord,
    text: forwardedText,
    conn,
    participants,
    groupMetadata,
    userGroup,
    botGroup,
    isROwner,
    isOwner,
    isRAdmin,
    isAdmin,
    isBotAdmin,
    isPrems,
    chatUpdate: null,
    __dirname: "",
    __filename: pluginName,
    user,
    chat,
    settings,
  };

  try {
    await plugin.call(conn, m, extra);
    return { ok: true, alreadySent: true };
  } catch (err) {
    return { ok: false, reason: `فشل تنفيذ الأمر "${commandWord}". (${err.message})` };
  }
}

export default {
  manageGroup: execManageGroup,
  changeBotPhoto: execChangeBotPhoto,
  moderateMember: execModerateMember,
  createSticker: execCreateSticker,
  getGroupInfo: execGetGroupInfo,
  muteMember: execMuteMember,
  warnMember: execWarnMember,
  deleteMessage: execDeleteMessage,
  mentionGroup: execMentionGroup,
  runBotCommand: execRunBotCommand,
};