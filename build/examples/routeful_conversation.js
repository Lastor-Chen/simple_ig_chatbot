"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const receiverAPI_1 = require("@/examples/apis/receiverAPI");
const senderAPI_1 = require("@/examples/apis/senderAPI");
receiverAPI_1.receiver.on('step_a', (event, userId, userState) => {
    const nextStep = 'step_b';
    // Webhook event is expected to be "postback" or other
    // Verify the payload whether match conversation step name
    if ('postback' in event && event.postback.payload === 'step_a') {
        // Record data
        userState.race = event.postback.title;
        receiverAPI_1.receiver.gotoStep(userId, nextStep);
        // Send next question
        senderAPI_1.sender.sendTemplate(userId, [
            {
                title: 'Choose a job',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Warrior',
                        payload: nextStep,
                    },
                    {
                        type: 'postback',
                        title: 'Sorcerer',
                        payload: nextStep,
                    },
                    {
                        type: 'postback',
                        title: 'Healer',
                        payload: nextStep,
                    },
                ],
            },
        ]);
    }
    else {
        handleUnexpected(userId, event);
    }
});
receiverAPI_1.receiver.on('step_b', (event, userId, userState) => {
    const nextStep = 'step_fin';
    if ('postback' in event && event.postback.payload === 'step_b') {
        // Recode data
        userState.job = event.postback.title;
        receiverAPI_1.receiver.gotoStep(userId, nextStep);
        // Send next question
        senderAPI_1.sender.sendTemplate(userId, [
            {
                title: 'Choose a gender',
                buttons: [
                    {
                        type: 'postback',
                        title: 'male',
                        payload: nextStep,
                    },
                    {
                        type: 'postback',
                        title: 'female',
                        payload: nextStep,
                    },
                ],
            },
        ]);
    }
    else {
        handleUnexpected(userId, event);
    }
});
receiverAPI_1.receiver.on('step_fin', async (event, userId, userState) => {
    if ('postback' in event && event.postback.payload === 'step_fin') {
        // Recode data
        userState.gender = event.postback.title;
        const msgs = [
            'You chose,',
            `  race: ${userState.race}`,
            `  job: ${userState.job}`,
            `  gender: ${userState.gender}`,
        ];
        await senderAPI_1.sender.sendText(userId, msgs.join('\n'));
        endConversation(userId);
    }
    else {
        handleUnexpected(userId, event);
    }
});
function endConversation(userId) {
    // Delete userState to end this conversation
    receiverAPI_1.receiver.endConversation(userId);
    senderAPI_1.sender.sendText(userId, 'This conversation is over. You can input any text to restart');
}
async function handleUnexpected(userId, event) {
    const payload = event.message?.quick_reply?.payload;
    if (payload === 'restart') {
        endConversation(userId);
    }
    else {
        await senderAPI_1.sender.sendText(userId, 'Please choose a button from current question');
        senderAPI_1.sender.sendText(userId, 'Or you can restart the conversation.', [{ title: 'restart', payload: 'restart' }]);
    }
}
