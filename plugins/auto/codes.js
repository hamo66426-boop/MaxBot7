Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

export default async function before(m, { conn }) {
  // إنشاء رسالة وهمية مرة واحدة فقط
  if (!global.reply_status) {
    let senderNumber = m.sender?.split('@')[0] || '0';
    let displayName = m.pushName || m.name || 'User';
    
    global.reply_status = {
      key: {
        participant: `${senderNumber}@s.whatsapp.net`,
        remoteJid: 'status@broadcast',
        fromMe: false,
      },
      message: {
        contactMessage: {
          displayName: displayName,
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:${displayName}
item1.TEL;waid=${senderNumber}:${senderNumber}
END:VCARD`,
        },
      },
      participant: "0@s.whatsapp.net",
    };
  }
  
  return false;
};