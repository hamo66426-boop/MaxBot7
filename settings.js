// settings.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - Configuration ✧

import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

global.owner = ['201118680635', '201031769315', "252102299361529", "192780412432563"]

global.mods = []
global.prems = []

global.baileys = '@whiskeysockets/baileys'
global.botName = '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂'
global.botNameShort = '꧁༒☬ 𝑴𝑨𝑿 ☬༒꧂'
global.watermark = '『 𝑴𝑨𝑿 𝑩𝑶𝑻 』'

global.fetch = fetch
global.axios = axios
global.moment = moment
global.fs = fs

global.packname = '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂'
global.author = '꧁༒ 𝑯𝑨𝑴𝑶 ༒꧂'

global.multiplier = 85

global.botNumberCode = '201031769315'

global.ch = {
  ch1: '120363424844460135@newsletter',
  ch2: '120363424844460135@newsletter'
}

global.yt = 'https://youtube.com/@hamo-m1f?si=gCQQTg1GnnAHLUzr'
global.ig = 'https://www.instagram.com/hamo66426?psln=MzE0dHhvNWlrNTJt'
global.md = ''
global.fb = ''
global.tk = 'https://www.tiktok.com/@gun_x7x?_r=1&_t=ZS-9AUyj1azpmT'
global.paypal = ''
global.soporteGB = 'https://whatsapp.com/channel/0029VbD0vMB7YSd9riHRc435'

global.dfailPool = [
    'https://files.catbox.moe/kahw8j.jpg',
    'https://files.catbox.moe/p6jm0g.jpg',
    'https://files.catbox.moe/qeqajh.jpg',
    'https://files.catbox.moe/kahw8j.jpg',
    'https://files.catbox.moe/p6jm0g.jpg',
    'https://files.catbox.moe/qeqajh.jpg',
    'https://files.catbox.moe/kahw8j.jpg',
    'https://files.catbox.moe/p6jm0g.jpg',
    'https://files.catbox.moe/qeqajh.jpg'
]

global.dfailMessages = {
    rowner: '❌ *المطور فقط*',
    owner: '❌ *المطور فقط*',
    mods: '❌ *القادة فقط*',
    premium: '⭐ *بريميوم فقط*',
    group: '👥 *جروبات فقط*',
    private: '📱 *خاص فقط*',
    admin: '👑 *مشرفين فقط*',
    botAdmin: '🤖 *البوت مش أدمن*',
    unreg: '📝 *غير مسجل*',
    restrict: '🚫 *معطل حالياً*'
}

global.dfailTitle = '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - YoRHa'
global.dfailDesc = '⧼ 𝑷𝑹𝑶𝑻𝑶𝑻𝒀𝑷𝑬 ⧽'
global.dfailUrl = ''

global.opts = global.opts || {}
global.opts['restrict'] = true