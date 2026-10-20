/**
 * lib/aiAgent/contextResolver.js
 * -------------------------------------------------------------
 * بيحل "مين المقصود" من منشن / رد (quoted) / رقم مكتوب.
 * نفس المنطق المستخدم في plugins/admin/control.js الأصلي،
 * لكن مستخرج هنا عشان الـ AI agent يستخدمه برضو.
 */

/**
 * @param {object} m - كائن الرسالة
 * @param {string} [textHint] - نص إضافي ممكن يحتوي رقم (لو الموديل بعت رقم كـ argument)
 * @returns {string|null} JID العضو المقصود أو null
 */
export function resolveTargetMember(m, textHint = "") {
  if (m.mentionedJid && m.mentionedJid[0]) {
    return m.mentionedJid[0];
  }
  if (m.quoted && m.quoted.sender) {
    return m.quoted.sender;
  }
  const raw = (textHint || m.text || "").replace(/[^0-9]/g, "");
  if (raw.length >= 11 && raw.length <= 13) {
    return raw + "@s.whatsapp.net";
  }
  return null;
}

export default resolveTargetMember;
