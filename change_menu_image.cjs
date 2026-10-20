const fs = require('fs');
const cp = require('child_process');

const file = 'plugins/اوامراا.js';
const backup = 'plugins/اوامراا.js.before_image_change';
const s = fs.readFileSync(file, 'utf8');
const pattern = /const THUMB_URL = ['"][^'"]*['"]/;

if (!pattern.test(s)) {
  console.log('ERROR: رابط الصورة غير موجود، الملف لم يتغير.');
  process.exit(1);
}

if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);

const updated = s.replace(
  pattern,
  "const THUMB_URL = 'https://i.ibb.co/jZkHXkNw/edabe78b71fe6d899c4bfd84c31e6083.jpg'"
);

fs.writeFileSync(file, updated, 'utf8');

const check = cp.spawnSync('node', ['--check', file], { encoding: 'utf8' });

if (check.status !== 0) {
  fs.writeFileSync(file, s, 'utf8');
  console.log('ERROR: الفحص فشل، وتم إرجاع الملف لحالته السابقة.');
  console.log(check.stderr);
  process.exit(1);
}

console.log('OK: رابط الصورة اتغير والفحص نجح.');
