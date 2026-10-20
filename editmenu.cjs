const fs = require('fs');
const cp = require('child_process');
const file = 'plugins/اوامراا.js';
const backup = 'plugins/اوامراا.js.safe_backup';
const s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('let old = performance.now()');
const b = s.indexOf('const sections = [{', a);

if (a < 0 || b < 0) {
  console.log('ERROR: حدود القائمة غير موجودة.');
  process.exit(1);
}

const replacement = String.raw`const menuStart = performance.now()
    const fecha = new Date().toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit", year: "numeric" })
    const hora = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
    const dbUsers = global.db?.data?.users || {}
    const userData = dbUsers[m.sender] || {}
    const rank = isROwner ? "رئيس" : "مواطن"
    const level = isROwner ? 999 : (userData.level ?? 1)
    const usersCount = Object.keys(dbUsers).length
    await conn.sendMessage(m.chat, { react: { text: "❄️", key: m.key } })
    const speed = Math.max(0, Math.round(performance.now() - menuStart))
    let menuText = [
      "       ╭━━━〔 👑 〕━━━╮",
      "             𝑴𝑨𝑿 𝑩𝑶𝑻",
      "       ╰━━━━━━━━━━━━╯",
      "",
      "          『 👑 " + rank + " 👑 』",
      "",
      "       ⌬ المستوى ⌯ " + level,
      "       ⌬ البينج ⌯ " + speed + "ms",
      "       ⌬ المستخدمون ⌯ " + usersCount,
      "       ⌬ التاريخ ⌯ " + fecha,
      "       ⌬ الوقت ⌯ " + hora,
      "",
      "          ⚡ SYSTEM ONLINE ⚡",
      "",
      "       ⌯ اختار القسم من الأزرار تحت"
    ].join("\n")
    `;

fs.copyFileSync(file, backup);
fs.writeFileSync(file, s.slice(0, a) + replacement + '\n    ' + s.slice(b), 'utf8');

const check = cp.spawnSync('node', ['--check', file], { encoding: 'utf8' });
if (check.status !== 0) {
  fs.copyFileSync(backup, file);
  console.log('ERROR: الفحص فشل، رجّعت النسخة الاحتياطية تلقائيًا.');
  console.log(check.stderr);
  process.exit(1);
}
console.log('OK: القائمة اتعدلت والفحص نجح.');
