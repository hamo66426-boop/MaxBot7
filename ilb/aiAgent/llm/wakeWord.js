/**
 * lib/aiAgent/llm/wakeWord.js
 * -------------------------------------------------------------
 * بيكتشف لو الرسالة موجّهة للـ AI Agent، وبيرجّع النص "الصافي"
 * (من غير كلمة التفعيل) عشان يتبعت للموديل.
 *
 * قاعدة الاكتشاف:
 *  1) لو الرسالة رد (quoted) على رسالة البوت نفسه (fromMe) => بتتحسب
 *     استمرار محادثة مع البوت، مفيش داعي لكلمة تفعيل جديدة.
 *  2) غير كده، لازم كلمة التفعيل تكون في *أول* الرسالة (زي أمر)،
 *     مش أي مكان في النص — عشان كلمات عادية في وسط الكلام
 *     (زي "بوت" بمعنى قدم/شبشب في العامية) متفعلش الوكيل غلط.
 *
 * ملحوظة: الملف ده بيكتشف بس، مش بينفذ ولا بيتكلم مع الموديل.
 */

const WAKE_WORDS = ["بوت", "bot"];

// بيتأكد إن الرسالة *تبدأ* بكلمة التفعيل (مع تجاهل مسافات زيادة في الأول)
function buildWakeRegex(word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // ^ + كلمة التفعيل + (مسافة/علامة ترقيم أو نهاية النص) — يعني لازم تكون أول كلمة
  return new RegExp(`^(${escaped})([^\\p{L}\\p{N}_]|$)`, "iu");
}

const WAKE_REGEXES = WAKE_WORDS.map((w) => ({ word: w, regex: buildWakeRegex(w) }));

/**
 * @param {object} m - كائن الرسالة (بعد smsg)
 * @returns {{ triggered: boolean, cleanText: string, viaReply: boolean }}
 */
export function detectWakeWord(m) {
  const rawText = (m.text || "").trim();

  // لازم يكون رد على رسالة البوت نفسه بالظبط (مش أي رد عام على أي حد)
  const isReplyToBot = !!(m.quoted && m.quoted.fromMe === true);

  // الحالة 1: رد على رسالة البوت (مش لازم كلمة تفعيل)
  if (isReplyToBot && rawText) {
    // لو حتى مع كده فيه كلمة تفعيل في الأول، نشيلها برضو عشان النص يبقى نضيف
    for (const { regex } of WAKE_REGEXES) {
      const match = rawText.match(regex);
      if (match) {
        const cleanText = rawText.slice(match[0].length).trim();
        return { triggered: true, cleanText: cleanText || rawText, viaReply: true };
      }
    }
    return { triggered: true, cleanText: rawText, viaReply: true };
  }

  // الحالة 2: لازم كلمة تفعيل تكون في *أول* الرسالة
  if (!rawText) return { triggered: false, cleanText: "", viaReply: false };

  for (const { regex } of WAKE_REGEXES) {
    const match = rawText.match(regex);
    if (match) {
      const cleanText = rawText.slice(match[0].length).replace(/\s+/g, " ").trim();
      return { triggered: true, cleanText, viaReply: false };
    }
  }

  return { triggered: false, cleanText: "", viaReply: false };
}

export default detectWakeWord;