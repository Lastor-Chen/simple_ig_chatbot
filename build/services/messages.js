"use strict";
// 複用訊息
Object.defineProperty(exports, "__esModule", { value: true });
exports.opening = void 0;
exports.opening = [
    {
        title: '請選擇',
        buttons: [
            {
                type: 'postback',
                title: '常用訊息範例',
                payload: 'basic_send',
            },
            {
                type: 'postback',
                title: '連續對話A',
                payload: 'convo',
            },
        ],
    },
];
