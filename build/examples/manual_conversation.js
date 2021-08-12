"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.convoA = void 0;
const senderAPI_1 = require("@/examples/apis/senderAPI");
const message_1 = require("@/examples/assets/message");
const users = [];
exports.users = users;
const errMsg = 'Please choose a button from current question';
async function convoA(event) {
    // Limit conversation is a postback event
    const sid = event.sender.id;
    if (!('postback' in event))
        return senderAPI_1.sender.sendText(sid, errMsg);
    // Check custom conversation payload flag
    const [type, step] = event.postback.payload.split(':');
    if (type === 'manual_conversation' && !step) {
        // Create a new conversation
        users.push({ id: sid, step: 'step_a' });
        return senderAPI_1.sender.sendTemplate(sid, [
            {
                title: 'Choose a race',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Human',
                        payload: 'convo:step_a',
                    },
                    {
                        type: 'postback',
                        title: 'Elf',
                        payload: 'convo:step_a',
                    },
                    {
                        type: 'postback',
                        title: 'Orc',
                        payload: 'convo:step_a',
                    },
                ],
            },
        ]);
    }
    // Check if a conversation exist with the user
    const user = users.find((user) => user.id === sid);
    if (!user)
        return senderAPI_1.sender.sendTemplate(sid, message_1.opening);
    // Conversation flow
    if (step !== user.step || type !== 'convo') {
        return senderAPI_1.sender.sendText(sid, errMsg);
    }
    else if (step === 'step_a') {
        // Update user state
        user.step = 'step_b';
        user.race = event.postback.title;
        senderAPI_1.sender.sendTemplate(sid, [
            {
                title: 'Choose a job',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Warrior',
                        payload: 'convo:step_b',
                    },
                    {
                        type: 'postback',
                        title: 'Sorcerer',
                        payload: 'convo:step_b',
                    },
                    {
                        type: 'postback',
                        title: 'Healer',
                        payload: 'convo:step_b',
                    },
                ],
            },
        ]);
    }
    else if (step === 'step_b') {
        // Update user state
        user.step = 'step_c';
        user.job = event.postback.title;
        senderAPI_1.sender.sendTemplate(sid, [
            {
                title: 'Choose a gender',
                buttons: [
                    {
                        type: 'postback',
                        title: 'male',
                        payload: 'convo:step_c',
                    },
                    {
                        type: 'postback',
                        title: 'female',
                        payload: 'convo:step_c',
                    },
                ],
            },
        ]);
    }
    else if (step === 'step_c') {
        // Update
        user.step = '';
        user.gender = event.postback.title;
        const msgs = [
            'You chose,',
            `  race: ${user.race}`,
            `  job: ${user.job}`,
            `  gender: ${user.gender}`,
        ];
        await senderAPI_1.sender.sendText(sid, msgs.join('\n'));
        senderAPI_1.sender.sendText(sid, 'This conversation is over');
        // Remove user state to end the conversation
        const targetIdx = users.findIndex((item) => item.id === user.id);
        users.splice(targetIdx, 1);
    }
}
exports.convoA = convoA;
