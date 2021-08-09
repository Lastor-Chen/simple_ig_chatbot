"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.convoA = void 0;
const messages_1 = require("@/services/messages");
const users = [];
exports.users = users;
const errMsg = '錯誤輸入，請重新選擇';
// 連續對話, 測試A
async function convoA(event, sender) {
    const sid = event.sender.id;
    if (!('postback' in event))
        return sender.sendText(sid, errMsg);
    const [_, val] = event.postback.payload.split(':');
    // 建立新對話
    if (!val) {
        users.push({ id: sid, step: 'step_a', data: {} });
        console.log('start conversation');
        return sender.sendTemplate(sid, [
            {
                title: '請選擇種族',
                buttons: [
                    {
                        type: 'postback',
                        title: '人類',
                        payload: 'convo:step_a',
                    },
                    {
                        type: 'postback',
                        title: '精靈',
                        payload: 'convo:step_a',
                    },
                    {
                        type: 'postback',
                        title: '半獸人',
                        payload: 'convo:step_a',
                    },
                ],
            },
        ]);
    }
    // 檢查 user 是否在連續對話中
    const user = users.find((user) => user.id === sid);
    if (!user) {
        await sender.sendText(sid, '對話已結束, 請重新選擇');
        return sender.sendTemplate(sid, messages_1.opening);
    }
    // 對話階段
    if (val === 'step_a') {
        if (user.step !== val) {
            return sender.sendText(sid, errMsg);
        }
        // 更新狀態
        user.step = 'step_b';
        user.data.race = event.postback.title;
        sender.sendTemplate(sid, [
            {
                title: '請選擇職業',
                buttons: [
                    {
                        type: 'postback',
                        title: '戰士',
                        payload: 'convo:step_b',
                    },
                    {
                        type: 'postback',
                        title: '法師',
                        payload: 'convo:step_b',
                    },
                    {
                        type: 'postback',
                        title: '牧師',
                        payload: 'convo:step_b',
                    },
                ],
            },
        ]);
    }
    else if (val === 'step_b') {
        if (user.step !== val) {
            return sender.sendText(sid, errMsg);
        }
        // 更新狀態
        user.step = 'step_c';
        user.data.job = event.postback.title;
        sender.sendTemplate(sid, [
            {
                title: '請選擇性別',
                buttons: [
                    {
                        type: 'postback',
                        title: '男',
                        payload: 'convo:step_c',
                    },
                    {
                        type: 'postback',
                        title: '女',
                        payload: 'convo:step_c',
                    },
                ],
            },
        ]);
    }
    else if (val === 'step_c') {
        if (user.step !== val) {
            return sender.sendText(sid, errMsg);
        }
        // 更新狀態
        user.step = '';
        user.data.gender = event.postback.title;
        const msgs = ['您選擇了:', `種族: ${user.data.race}`, `職業: ${user.data.job}`, `性別: ${user.data.gender}`];
        sender.sendText(sid, msgs.join('\n'));
        // 對話結束, 移除紀錄
        const targetIdx = users.findIndex((item) => item.id === user.id);
        users.splice(targetIdx, 1);
        console.log('remove user');
    }
}
exports.convoA = convoA;
