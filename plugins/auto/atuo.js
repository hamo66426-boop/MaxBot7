export default async function before(m, { conn, isAdmin, isOwner, isROwner, match }) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    let settings = global.db.data.settings[conn.user.jid];

let usedPrefix = match?.[0]?.[0] || '';
let command = m.text?.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase() || '';

let publicAllowed = command === 'يوت';

if (!publicAllowed && command) {
  publicAllowed = Object.values(global.plugins || {}).some(plugin => {
    if (!plugin || plugin.disabled) return false;
    if (!(plugin.tags?.includes('games') || plugin.category === 'games')) return false;

    const cmd = plugin.command;
    if (cmd instanceof RegExp) {
      cmd.lastIndex = 0;
      return cmd.test(command);
    }
    if (Array.isArray(cmd)) {
      return cmd.some(item => {
        if (item instanceof RegExp) {
          item.lastIndex = 0;
          return item.test(command);
        }
        return typeof item === 'string' && item.toLowerCase() === command;
      });
    }
    return typeof cmd === 'string' && cmd.toLowerCase() === command;
  });
}

    
    // 1️⃣ لو العضو محظور
    if (user?.banned && !isOwner && !isROwner) {
        return true;
    }
    
    // 2️⃣ لو وضع المشرفين فقط مفعل (chat.modoadmin)
    if (chat?.modoadmin && !isOwner && !isROwner && !isAdmin && !publicAllowed) {
    return true;
  }
    
    // 3️⃣ لو البوت مقفول للمطور فقط (settings.self)
    if (settings?.self && !isOwner && !isROwner && !publicAllowed) {
    return true;
  }
    
    // 4️⃣ لو الخاص مقفول (settings.privateLocked)
    if (!m.isGroup && settings?.privateLocked && !isOwner && !isROwner) {
        return true;
    }
    
    return false;
};