"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const lib_1 = require("@/lib");
const basicSend_1 = require("@/basicSend");
const convoA_1 = require("@/convoA");
const messages_1 = require("@/services/messages");
const PORT = process.env.PORT || 3000;
const receiver = new lib_1.IGReceiver({
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET,
});
const sender = new lib_1.IGSender(process.env.PAGE_ACCESS_TOKEN);
// Set IG Messaging home page
sender.setIceBreakers([
    {
        question: 'test btnA',
        payload: '測試A',
    },
    {
        question: '測試連續對話',
        payload: 'convo',
    },
]);
// log request for dev mode
receiver.app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.path}`);
    next();
});
receiver.on('text', async (event) => {
    console.log('\n接收 text');
    const sid = event.sender.id;
    const hasConvo = convoA_1.users.some(user => user.id === sid);
    if (hasConvo) {
        convoA_1.convoA(event, sender);
    }
    else {
        sender.sendTemplate(sid, messages_1.opening);
    }
});
receiver.on('quickReply', (event) => {
    console.log('\n接收 quickReply');
    console.log(event);
});
receiver.on('postback', (event) => {
    console.log('\n接收 postback');
    const [type, _] = event.postback.payload.split(':');
    if (type === 'basic_send')
        return basicSend_1.basicSend(event, sender);
    else if (type === 'convo') {
        convoA_1.convoA(event, sender);
    }
});
receiver.on('attachments', (event) => {
    console.log('\n接收 attachments');
    console.log(event.message.attachments);
});
receiver.start(PORT);
