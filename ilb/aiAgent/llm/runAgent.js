/**
 * lib/aiAgent/llm/runAgent.js
 * -------------------------------------------------------------
 * ده الـ orchestrator الرئيسي للـ AI Agent. بيحاول كل مزوّد من
 * providers.js بالترتيب، وأول واحد يرد بنجاح (تفعيل أداة أو رد
 * نصي عادي) بنوقف عنده. لو مزوّد رجّع خطأ "نفد الرصيد/الكوتة"
 * بننتقل تلقائيًا للي بعده — البوت متعطلش لمجرد إن مزوّد واحد
 * وصل لحده اليومي أو خلص رصيده.
 *
 * الفكرة المعمارية المهمة (اقرأها قبل ما تعدّل أي حاجة هنا):
 *   الموديل بيختار بس "إيه الأداة وإيه الـ arguments". هو مش اللي
 *   بيكتب رسالة النجاح للمستخدم. رسالة النجاح بتتولد في format.js
 *   وبس بعد ما executionMap.js يعمل نداء Baileys حقيقي وينجح.
 *   لو الموديل مالوش أداة تناسب الطلب، بيرجع نص عادي (مش نداء
 *   أداة)، وده اللي بيتبعت زي ما هو كرسالة "مش متاح" — من غير
 *   ما نلبسه شكل "تم بنجاح". ده اللي بيمنع أي "نجاح وهمي".
 */

import OpenAI from "openai";
import { botTools, systemInstruction } from "./botTools.js";
import executionMap, { buildCommandCatalog } from "./executionMap.js";
import { formatSuccess, formatFailure, formatNotAvailable, formatGroupInfo } from "./format.js";
import { checkToolPermission } from "../security.js";
import { detectWakeWord } from "./wakeWord.js";
import { getConfiguredProviders } from "./providers.js";

const clients = new Map(); // اسم المزوّد -> عميل OpenAI SDK جاهز (بيتعمل مرة واحدة بس)
function getClient(provider) {
  if (!clients.has(provider.name)) {
    clients.set(provider.name, new OpenAI({ apiKey: provider.apiKey, baseURL: provider.baseURL }));
  }
  return clients.get(provider.name);
}

/** خطأ يستاهل ننقل للمزوّد اللي بعده (كوتة/رصيد/ازدحام) بدل ما نوقف فورًا */
function isFallbackWorthy(err) {
  const status = err?.status ?? err?.response?.status;
  const msg = (err?.message || "").toLowerCase();
  return (
    status === 402 || // insufficient balance
    status === 429 || // rate limit / quota
    status === 500 ||
    status === 502 ||
    status === 503 ||
    /insufficient|quota|balance|rate.?limit|overloaded|unavailable/.test(msg)
  );
}

/**
 * بيحاول يكلم موديل واحد (provider) مع إعادة محاولة بسيطة لو الخطأ مؤقت.
 * @returns {{ ok: true, response: object } | { ok: false, fallback: boolean, err: Error }}
 */
async function callProvider(provider, cleanText) {
  const ai = getClient(provider);
  const MAX_ATTEMPTS = 2;

  const catalog = buildCommandCatalog();
  const fullSystemPrompt = catalog
    ? `${systemInstruction}\n\nقائمة أوامر إضافية متاحة فعليًا في البوت (استخدم runBotCommand بس لو الطلب مطابق لواحد منها ومفيش أداة مخصصة أنسب):\n${catalog}`
    : systemInstruction;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.chat.completions.create({
        model: provider.model,
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: cleanText },
        ],
        tools: botTools,
        tool_choice: "auto",
        temperature: 0.3,
      });
      return { ok: true, response };
    } catch (err) {
      const fallback = isFallbackWorthy(err);
      const isLastAttempt = attempt === MAX_ATTEMPTS;

      // لو الخطأ مؤقت (ازدحام) ولسه فيه محاولات، نستنى شوية ونعيد نفس المزوّد
      if (fallback && !isLastAttempt) {
        await new Promise((r) => setTimeout(r, attempt * 600));
        continue;
      }
      return { ok: false, fallback, err };
    }
  }
}

/**
 * @param {object} m - كائن الرسالة
 * @param {object} ctx - { conn, isAdmin, isOwner, isROwner, isBotAdmin, groupMetadata }
 * @returns {Promise<boolean>} true لو الـ agent هو اللي تعامل مع الرسالة (البوت يعمل return بعدها)
 */
export async function runAgent(m, ctx) {
  const { conn } = ctx;

  const { triggered, cleanText } = detectWakeWord(m);
  if (!triggered) return false;
  if (m.text?.trim() === "بوت") return false;

  const providers = getConfiguredProviders();
  if (!providers.length) {
    // مفيش أي مفتاح API متظبط في .env — نقولها بصراحة
    await conn.sendMessage(m.chat, { text: formatNotAvailable("ميزة الذكاء الاصطناعي مش مفعّلة دلوقتي (مفيش مفتاح API متظبط).") }, { quoted: m });
    return true;
  }

  if (!cleanText) {
    await conn.sendMessage(m.chat, { text: "قولّي محتاج إيه بالظبط بعد كلمة التفعيل 🙂" }, { quoted: m });
    return true;
  }

  let response = null;
  let lastErr = null;

  for (const provider of providers) {
    const result = await callProvider(provider, cleanText);
    if (result.ok) {
      response = result.response;
      break;
    }
    lastErr = result.err;
    if (!result.fallback) break; // خطأ حقيقي (مش كوتة/رصيد) — منكملش نجرب مزودين تانيين
    // غير كده: نكمل اللوب على المزوّد اللي بعده
  }

  if (!response) {
    const reason = lastErr
      ? `مشكلة في الاتصال بالذكاء الاصطناعي (${lastErr.message})`
      : "كل مزودي الذكاء الاصطناعي مش متاحين دلوقتي، جرّب تاني بعد شوية 🙏";
    await conn.sendMessage(m.chat, { text: formatFailure(reason) }, { quoted: m });
    return true;
  }

  const choice = response?.choices?.[0];
  const toolCalls = choice?.message?.tool_calls || [];

  // لا يوجد استدعاء أداة => الموديل بيقول إن الطلب مش متاح. نبعتها زي ما هي بصراحة.
  if (!toolCalls.length) {
    const text = choice?.message?.content?.trim();
    await conn.sendMessage(m.chat, { text: formatNotAvailable(text) }, { quoted: m });
    return true;
  }

  // بننفذ أول استدعاء بس (تعمّد: منسمحش بسلسلة أوامر خطيرة متعددة من غير مراجعة)
  const call = toolCalls[0];
  const toolName = call.function?.name;

  let args = {};
  try {
    args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
  } catch {
    // لو الموديل رجّع JSON مكسور، نتعامل معاه كأنه مفيش arguments بدل ما نكرش
    args = {};
  }

  if (!toolName || !executionMap[toolName]) {
    // احتياطي دفاعي: لو الموديل ولّع أداة مش موجودة أصلاً في executionMap
    await conn.sendMessage(m.chat, { text: formatNotAvailable() }, { quoted: m });
    return true;
  }

  const permission = checkToolPermission(toolName, {
    isAdmin: ctx.isAdmin,
    isOwner: ctx.isOwner,
    isROwner: ctx.isROwner,
    isBotAdmin: ctx.isBotAdmin,
    m,
  });

  if (!permission.allowed) {
    await conn.sendMessage(m.chat, { text: permission.reason }, { quoted: m });
    return true;
  }

  let result;
  try {
    if (toolName === "manageGroup") {
      result = await executionMap.manageGroup(m, conn, args);
    } else if (toolName === "moderateMember") {
      result = await executionMap.moderateMember(m, conn, args, ctx.groupMetadata);
    } else if (toolName === "changeBotPhoto") {
      result = await executionMap.changeBotPhoto(m, conn);
    } else if (toolName === "createSticker") {
      result = await executionMap.createSticker(m, conn);
    } else if (toolName === "getGroupInfo") {
      result = await executionMap.getGroupInfo(m, conn);
    } else if (toolName === "muteMember") {
      result = await executionMap.muteMember(m, conn, args);
    } else if (toolName === "warnMember") {
      result = await executionMap.warnMember(m, conn, args);
    } else if (toolName === "deleteMessage") {
      result = await executionMap.deleteMessage(m, conn);
    } else if (toolName === "mentionGroup") {
      result = await executionMap.mentionGroup(m, conn, args, ctx.groupMetadata);
    } else if (toolName === "runBotCommand") {
      result = await executionMap.runBotCommand(m, conn, args, ctx);
    }
  } catch (err) {
    result = { ok: false, reason: err.message };
  }

  if (!result || !result.ok) {
    await conn.sendMessage(m.chat, { text: formatFailure(result?.reason) }, { quoted: m });
    return true;
  }

  // createSticker بيبعت رسالته بنفسه (الاستيكر نفسه) — منبعتش كارت فوقه
  if (result.alreadySent) return true;

  if (toolName === "getGroupInfo") {
    await conn.sendMessage(m.chat, { text: formatGroupInfo(result.meta) }, { quoted: m });
    return true;
  }

  const successText = formatSuccess(toolName, args.action || "change", {
    by: m.sender,
    target: result.target,
    value: result.value,
    warnCount: result.warnCount,
  });
  await conn.sendMessage(m.chat, { text: successText, mentions: result.target ? [result.target, m.sender] : [m.sender] }, { quoted: m });
  return true;
}

export default runAgent;