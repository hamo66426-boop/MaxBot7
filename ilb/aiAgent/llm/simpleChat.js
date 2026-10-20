/**
 * lib/aiAgent/llm/simpleChat.js
 * -------------------------------------------------------------
 * نداء بسيط (من غير tools/function-calling) بيستخدمه أي بلجن
 * محتاج رد نصي عادي من الذكاء الاصطناعي (زي أمر ".بوت" أو
 * الرد التلقائي في _autorespond.js)، مع نفس نظام الـ Fallback
 * المستخدم في وكيل "كينج" (providers.js): بيجرب Groq الأول،
 * ولو وصل لحده بينتقل تلقائيًا لـ Pollinations.
 */

import OpenAI from "openai";
import { getConfiguredProviders } from "./providers.js";

const clients = new Map();
function getClient(provider) {
  if (!clients.has(provider.name)) {
    clients.set(provider.name, new OpenAI({ apiKey: provider.apiKey, baseURL: provider.baseURL }));
  }
  return clients.get(provider.name);
}

function isFallbackWorthy(err) {
  const status = err?.status ?? err?.response?.status;
  const msg = (err?.message || "").toLowerCase();
  return (
    status === 402 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    /insufficient|quota|balance|rate.?limit|overloaded|unavailable/.test(msg)
  );
}

/**
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} [opts]
 * @param {number} [opts.temperature]
 * @returns {Promise<string>} نص الرد
 * @throws لو كل المزودين فشلوا (مفيش مفتاح متظبط، أو خطأ حقيقي مش كوتة)
 */
export async function simpleChat(messages, opts = {}) {
  const providers = getConfiguredProviders();
  if (!providers.length) {
    throw new Error("مفيش مفتاح API متظبط (GROQ_API_KEY أو POLLINATIONS_API_KEY) في إعدادات البوت.");
  }

  let lastErr = null;
  for (const provider of providers) {
    try {
      const ai = getClient(provider);
      const response = await ai.chat.completions.create({
        model: provider.model,
        messages,
        temperature: opts.temperature ?? 0.7,
      });
      const text = response.choices?.[0]?.message?.content?.trim();
      if (text) return text;
      lastErr = new Error("لم يتم العثور على رد");
    } catch (err) {
      lastErr = err;
      if (!isFallbackWorthy(err)) throw err; // خطأ حقيقي، منكملش نجرب مزودين تانيين
      // غير كده: نكمل للمزوّد اللي بعده
    }
  }
  throw lastErr || new Error("كل مزودي الذكاء الاصطناعي مش متاحين دلوقتي.");
}

export default simpleChat;
