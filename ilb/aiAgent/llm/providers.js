/**
 * lib/aiAgent/llm/providers.js
 * -------------------------------------------------------------
 * قايمة مزوّدين للذكاء الاصطناعي، بيتحاولوا بالترتيب لما البوت
 * يحاول ينفذ أمر "كينج". لو مزوّد رجّع خطأ "نفد الرصيد/الكوتة"
 * (زي 402/429/quota)، بننتقل تلقائيًا للمزوّد اللي بعده بدل ما
 * البوت يقف أو يرد بفشل نهائي.
 *
 * كل المزودين هنا بيستخدموا صيغة OpenAI-compatible (chat.completions
 * + tools)، فمفيش داعي لأي كود مختلف لكل واحد فيهم.
 *
 * لإضافة مزوّد جديد: ضيفه في المصفوفة تحت بنفس الشكل، وحط مفتاحه
 * في .env. لو المفتاح فاضي، المزوّد ده بيتخطى تلقائيًا (مش بيتبعت
 * له طلب أصلاً).
 */

export const PROVIDERS = [
  {
    name: "Groq",
    envKey: "GROQ_API_KEY",
    baseURL: "https://api.groq.com/openai/v1",
    model: "openai/gpt-oss-120b",
  },
  {
    name: "Pollinations",
    envKey: "POLLINATIONS_API_KEY",
    baseURL: "https://gen.pollinations.ai/v1",
    model: "openai",
  },
];

/**
 * @returns {Array<{name:string, apiKey:string, baseURL:string, model:string}>}
 *  المزودين اللي ليهم مفتاح متظبط فعليًا في .env، بنفس ترتيب PROVIDERS.
 */
export function getConfiguredProviders() {
  return PROVIDERS
    .map((p) => ({ ...p, apiKey: process.env[p.envKey] }))
    .filter((p) => !!p.apiKey);
}

export default { PROVIDERS, getConfiguredProviders };