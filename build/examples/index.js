"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const receiverAPI_1 = require("@/examples/apis/receiverAPI");
const senderAPI_1 = require("@/examples/apis/senderAPI");
const basic_send_1 = require("@/examples/basic_send");
const manual_conversation_1 = require("@/examples/manual_conversation");
const message_1 = require("@/examples/assets/message");
// Set Instagram Ice Breakers
senderAPI_1.sender.setIceBreakers([
    {
        question: 'Get Started',
        payload: 'get_started',
    },
]);
// Invoke express app
receiverAPI_1.receiver.app.use((req, res, next) => {
    // log all request path for dev
    console.log(`\n${req.method} ${req.path}`);
    next();
});
receiverAPI_1.receiver.on('beforeEvent', (event) => {
    console.log('Webhook Event', event);
});
receiverAPI_1.receiver.on('text', async (event, userId) => {
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo) {
        // Intercept the event to continue manual_conversation
        manual_conversation_1.convoA(event);
    }
    else {
        senderAPI_1.sender.sendTemplate(userId, message_1.opening);
    }
});
receiverAPI_1.receiver.on('attachments', async (event, userId) => {
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo) {
        // Intercept the event to continue manual_conversation
        manual_conversation_1.convoA(event);
    }
    else {
        senderAPI_1.sender.sendTemplate(userId, message_1.opening);
    }
});
receiverAPI_1.receiver.on('postback', (event, userId) => {
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
        // Start a routeful conversation by set user's conversation step name
        // The step name will be used as event name
        const nextStep = 'step_a';
        receiverAPI_1.receiver.gotoStep(userId, nextStep);
        // Send the first question to user.
        // Use payload as flag. Help us to verify the conversation step
        senderAPI_1.sender.sendTemplate(userId, [
            {
                title: 'Choose a race',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Human',
                        payload: nextStep,
                    },
                    {
                        type: 'postback',
                        title: 'Elf',
                        payload: nextStep,
                    },
                    {
                        type: 'postback',
                        title: 'Orc',
                        payload: nextStep,
                    },
                ],
            },
        ]);
    }
    else {
        senderAPI_1.sender.sendText(userId, 'invalid message');
    }
});
receiverAPI_1.receiver.on('quickReply', (event, userId) => {
    const hasConvo = manual_conversation_1.users.some((user) => user.id === userId);
    if (hasConvo) {
        // Intercept the event to continue manual_conversation
        manual_conversation_1.convoA(event);
    }
});
// Load split listener file
require('@/examples/routeful_conversation');
// Start express server
receiverAPI_1.receiver.start(process.env.PORT || 3000);
