/**
 * lib/aiAgent/llm/format.js
 * -------------------------------------------------------------
 * كل نصوص "تم بنجاح" هنا بتتبنى فقط لما تنفيذ حقيقي في
 * executionMap.js يرجّع success=true. الموديل معندهوش
 * صلاحية يولّد نص نجاح بنفسه — ده اللي بيمنع أي "نجاح وهمي".
 */

const startDeco = `╗═══≪ 🌿🍉🍡 ≫═══╔`;
const endDeco = `╝═══≪ 🌿🍉🍡 ≫═══╚`;

function card({ title, lines = [], by }) {
  const body = lines.filter(Boolean).join("\n");
  const byLine = by ? `👑 *بواسطة:* @${by.split("@")[0]}` : "";
  return [startDeco, title, body, byLine, "​➥ 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑", endDeco].filter(Boolean).join("\n");
}

export function formatSuccess(toolName, action, payload = {}) {
  const { by, target, value } = payload;
  switch (`${toolName}:${action}`) {
    case "manageGroup:lock":
      return card({ title: "🔒 *تم قفل المجموعة*", lines: ["𓆩⃞🤐𓆪 *الآن المشرفين فقط يمكنهم التحدث*"], by });
    case "manageGroup:unlock":
      return card({ title: "🔓 *تم فتح المجموعة*", lines: ["𓆩⃞🗣️𓆪 *الآن الجميع يمكنهم التحدث*"], by });
    case "manageGroup:rename":
      return card({ title: "✏️ *تم تغيير اسم المجموعة*", lines: [`📛 *الاسم الجديد:* ${value}`], by });
    case "manageGroup:set_description":
      return card({ title: "📝 *تم تغيير وصف المجموعة*", lines: [`📋 *الوصف الجديد:* ${value}`], by });
    case "manageGroup:change_photo":
      return card({ title: "✅ *تم تغيير صورة المجموعة بنجاح*", lines: [], by });
    case "changeBotPhoto:change":
      return card({ title: "✅ *تم تغيير صورة البوت بنجاح*", lines: [], by });
    case "moderateMember:kick":
      return card({ title: "👋 *تم الطرد بنجاح*", lines: [`𓆩⃞👢𓆪 *العضو المطرود:* @${target.split("@")[0]}`], by });
    case "moderateMember:promote":
      return card({ title: "👑 *تمت الترقية بنجاح*", lines: [`𓆩⃞🍒𓆪 *المشرف الجديد:* @${target.split("@")[0]}`], by });
    case "moderateMember:demote":
      return card({ title: "⬇️ *تم الخفض بنجاح*", lines: [`𓆩⃞🍂𓆪 *العضو المخفض:* @${target.split("@")[0]}`], by });
    default:
      return card({ title: "✅ *تم التنفيذ بنجاح*", lines: [], by });
  }
}

export function formatFailure(reasonText) {
  return `${startDeco}\n❌ *فشل التنفيذ*\n${reasonText || "حصل خطأ غير متوقع."}\n${endDeco}`;
}

/**
 * الرسالة اللي بتترسل لما الموديل يقرر إن الطلب مفيهوش أداة حقيقية.
 * دي صريحة وواضح فيها إن حاجة اتنفذتش، تحقيقًا لقاعدة "متلمسش تدّعي التنفيذ".
 */
export function formatNotAvailable(userFacingExplanation) {
  const text = userFacingExplanation && userFacingExplanation.trim()
    ? userFacingExplanation.trim()
    : "الطلب ده مش من ضمن الحاجات اللي أقدر أنفذها دلوقتي.";
  return `🤖 ${text}\n\n_(الميزة دي مش متاحة لسه في البوت — لو حابب أضيفها فعليًا قولّي.)_`;
}

export function formatGroupInfo(meta) {
  return card({
    title: "ℹ️ *معلومات المجموعة*",
    lines: [
      `📛 *الاسم:* ${meta.subject || "-"}`,
      `👥 *عدد الأعضاء:* ${meta.participants?.length ?? "-"}`,
      `🔒 *الحالة:* ${meta.announce ? "مقفولة (أدمن بس)" : "مفتوحة"}`,
    ],
  });
}

export default { formatSuccess, formatFailure, formatNotAvailable, formatGroupInfo };
