"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const lib_1 = require("@/lib");
const senderAPI_1 = require("@/examples/modules/senderAPI");
const basic_send_1 = require("@/examples/basic_send");
const manual_conversation_1 = require("@/examples/manual_conversation");
const routeful_conversation_1 = require("@/examples/routeful_conversation");
const message_1 = require("@/examples/assets/message");
const receiver = new lib_1.IGReceiver({
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET,
});
// Set Instagram Ice Breakers
senderAPI_1.sender.setIceBreakers([
    {
        question: 'Button A',
        payload: 'get_started',
    },
    {
        question: 'Button B',
        payload: 'get_started',
    },
]);
// Invoke express app
receiver.app.use((req, res, next) => {
    // log all request path for dev
    console.log(`\n${req.method} ${req.path}`);
    next();
});
receiver.on('beforeEvent', (event) => {
    console.log('Webhook Event', event);
});
receiver.on('text', async (event, userId) => {
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo) {
        // Intercept the event to continue a conversation
        manual_conversation_1.convoA(event);
    }
    else {
        senderAPI_1.sender.sendTemplate(userId, message_1.opening);
    }
});
receiver.on('attachments', async (event, userId) => {
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo) {
        // Intercept the event to continue a conversation
        manual_conversation_1.convoA(event);
    }
    else {
        senderAPI_1.sender.sendTemplate(userId, message_1.opening);
    }
});
receiver.on('postback', (event, userId) => {
    // If continue a manual conversation
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo)
        return manual_conversation_1.convoA(event);
    // Get custom payload type
    const [type] = event.postback.payload.split(':');
    if (type === 'get_started') {
        senderAPI_1.sender.sendTemplate(userId, message_1.opening);
    }
    else if (type === 'basic_send') {
        // Show Instagram basic messaging demo
        basic_send_1.basicSend(event);
    }
    else if (type === 'manual_conversation' || type === 'convo') {
        // Start a manual conversation
        manual_conversation_1.convoA(event);
    }
    else if (type === 'routeful_conversation') {
        // Start a routeful conversation by set a event name
        receiver.startConversation(userId, 'step_a');
        // Send the first question to user
        senderAPI_1.sender.sendTemplate(userId, [
            {
                title: 'Choose a race',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Human',
                        payload: 'step_a',
                    },
                    {
                        type: 'postback',
                        title: 'Elf',
                        payload: 'step_a',
                    },
                    {
                        type: 'postback',
                        title: 'Orc',
                        payload: 'step_a',
                    },
                ],
            },
        ]);
    }
    else {
        senderAPI_1.sender.sendText(userId, 'invalid message');
    }
});
// Split file to routeful-conversation
routeful_conversation_1.convoB(receiver);
// Start express server
receiver.start(process.env.PORT || 3000);
