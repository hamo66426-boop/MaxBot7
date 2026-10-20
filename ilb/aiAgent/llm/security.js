/**
 * lib/aiAgent/security.js
 * -------------------------------------------------------------
 * فحص صلاحيات تنفيذ كل أداة قبل ما نلمس Baileys فعليًا.
 * القاعدة الذهبية: الموديل بيقترح إيه المطلوب بس،
 * لكن الفحص النهائي لو مسموح ينفذ أو لأ بيحصل هنا، سيرفر-سايد،
 * مش بناءً على كلام الموديل.
 */

// أسماء الأدوات اللي محتاجة إشراف على الأقل
const ADMIN_TOOLS = new Set(["manageGroup", "moderateMember", "muteMember", "warnMember", "deleteMessage", "mentionGroup"]);
// أدوات مقصورة على مالك البوت فقط (زي تغيير صورة البوت نفسه)
const OWNER_ONLY_TOOLS = new Set(["changeBotPhoto"]);

/**
 * @param {string} toolName
 * @param {object} ctx - { isAdmin, isOwner, isROwner, isBotAdmin, m }
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function checkToolPermission(toolName, ctx) {
  const { isAdmin, isOwner, isROwner, isBotAdmin, m } = ctx;

  if (OWNER_ONLY_TOOLS.has(toolName)) {
    if (!(isOwner || isROwner)) {
      return { allowed: false, reason: "*[❗] الأمر ده مخصص لمالك البوت فقط.*" };
    }
    return { allowed: true };
  }

  if (ADMIN_TOOLS.has(toolName)) {
    if (!m.isGroup) {
      return { allowed: false, reason: "❌ *الأمر ده للمجموعات فقط.*" };
    }
    if (!(isAdmin || isOwner)) {
      return { allowed: false, reason: "*[❗] الأمر ده مخصص للمشرفين فقط.*" };
    }
    if (!isBotAdmin) {
      return { allowed: false, reason: "❌ *لازم يكون البوت أدمن في المجموعة الأول عشان ينفذ الأمر ده.*" };
    }
    return { allowed: true };
  }

  // أدوات القراءة فقط (getGroupInfo)، العامة (createSticker)، أو اللي
  // بتفحص صلاحيتها بنفسها لكل حالة (runBotCommand بيفحص owner/admin/...
  // الخاصة بالأمر المطابق نفسه جوه executionMap.js) متاحة للكل هنا.
  return { allowed: true };
}

/**
 * حماية مالك/مطور البوت من إجراءات ضده (طرد/خفض) — نفس منطق control.js الأصلي
 */
export function isProtectedOwnerTarget(targetJid, conn) {
  const botNumber = conn.user.jid;
  const owners = (global.owner || []).map((o) => o.replace(/[^0-9]/g, "") + "@s.whatsapp.net");
  return targetJid === botNumber || owners.includes(targetJid);
}

export default { checkToolPermission, isProtectedOwnerTarget };