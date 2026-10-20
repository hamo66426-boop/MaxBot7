kkimport 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import readline from 'node:readline';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_CHAT_ID;

if (!token || !chat) {
  console.error('Telegram configuration missing');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });
const rl = readline.createInterface({ input: process.stdin });

let currentBlock = [];
let batch = [];
let timer = null;
let sending = Promise.resolve();

function flush() {
  if (!batch.length) return;
  const text = batch.join('\n\n');
  batch = [];
  clearTimeout(timer);
  timer = null;

  sending = sending.then(async () => {
    for (let i = 0; i < text.length; i += 3500) {
      await bot.sendMessage(chat, text.slice(i, i + 3500));
    }
  }).catch(() => {});
}

rl.on('line', line => {
  // تجميع السطور الخاصة بالبلوك
  currentBlock.push(line);

  // لو السطر ده هو نهاية البلوك (نهاية الفاصل أو الكلمة المستهدفة)
  if (line.includes('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') && currentBlock.length > 2) {
    const fullMessage = currentBlock.join('\n');
    
    // شروط القبول: نتأكد إن البلوك ده فيه رسالة "اتبضنت" أو التنسيق بتاع المارك آوت الخاص بيك
    if (/اتبضنت|𝑴𝑨𝑿 𝑩𝑶𝑻/i.test(fullMessage)) {
      batch.push(fullMessage);
      if (batch.length >= 5) flush();
      else if (!timer) timer = setTimeout(flush, 2000);
    }
    
    // تفريغ الـ بلوك عشان نستقبل رسالة جديدة
    currentBlock = [];
  }
});

rl.on('close', () => {
  if (currentBlock.length > 0) {
    batch.push(currentBlock.join('\n'));
    flush();
  }
});

