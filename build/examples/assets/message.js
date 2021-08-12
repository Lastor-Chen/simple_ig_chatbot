"use strict";
// Reusable messages
Object.defineProperty(exports, "__esModule", { value: true });
exports.opening = void 0;
exports.opening = [
    {
        title: 'Please choose one to demo Instagram Messaging API',
        buttons: [
            {
                type: 'postback',
                title: 'Basic Sending',
                payload: 'basic_send',
            },
            {
                type: 'postback',
                title: 'Manual Conversation',
                payload: 'manual_conversation',
            },
            {
                type: 'postback',
                title: 'Routeful Conversation',
                payload: 'routeful_conversation',
            },
        ],
    },
];
