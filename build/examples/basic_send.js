"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicSend = void 0;
const senderAPI_1 = require("@/examples/modules/senderAPI");
async function basicSend(event) {
    const sid = event.sender.id;
    const [_, val] = event.postback.payload.split(':');
    if (!val) {
        senderAPI_1.sender.sendTemplate(sid, [
            {
                title: 'Message',
                subtitle: '純文字訊息, 亦可直接 po 超連結',
                image_url: 'https://via.placeholder.com/150x100',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Text',
                        payload: 'basic_send:text',
                    },
                    {
                        type: 'postback',
                        title: 'Link',
                        payload: 'basic_send:text_link',
                    },
                ],
            },
            {
                title: 'Attachment',
                subtitle: '媒體附件類訊息, 圖片 or 愛心符號',
                image_url: 'https://via.placeholder.com/150x100',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Image',
                        payload: 'basic_send:image',
                    },
                    {
                        type: 'postback',
                        title: 'Like Heart',
                        payload: 'basic_send:like_heart',
                    },
                ],
            },
            {
                title: 'Quick Replies',
                subtitle: '於文字訊息下方出現可快速選擇的按鈕',
                image_url: 'https://via.placeholder.com/150x100',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Quick Replies',
                        payload: 'basic_send:quick_replies',
                    },
                ],
            },
            {
                title: 'Generic Template',
                subtitle: '此類模板即為 Template 訊息, 可包圖片、文字、按鈕，單筆最多 10 組元件, 每個元件最多 3 個按鈕',
                image_url: 'https://via.placeholder.com/150x100',
                buttons: [
                    {
                        type: 'web_url',
                        title: 'Web Link (Google)',
                        url: 'https://www.google.com',
                    },
                    {
                        type: 'postback',
                        title: 'button',
                        payload: 'basic_send:template',
                    },
                ],
            },
        ]);
    }
    else if (val === 'text') {
        const senderMsg = event.postback.title;
        const user = await senderAPI_1.sender.getUserProfile(event.sender.id);
        senderAPI_1.sender.sendText(sid, `文字訊息, 可代入 user 名稱:\n${user?.name} chose: ${senderMsg}`);
    }
    else if (val === 'text_link') {
        senderAPI_1.sender.sendText(sid, 'https://www.google.com');
    }
    else if (val === 'image') {
        senderAPI_1.sender.sendAttachment(sid, 'image', 'https://i.gyazo.com/5f23b5bfdf8f11078275bc0a954471c2.png');
    }
    else if (val === 'like_heart') {
        senderAPI_1.sender.sendAttachment(sid, 'like_heart');
    }
    else if (val === 'quick_replies') {
        senderAPI_1.sender.sendText(sid, '快速回覆 Quick Replies', [
            '按鈕A',
            { title: '按鈕B', payload: 'null' },
            { title: '按鈕C', payload: 'null' },
        ]);
    }
    else if (val === 'template') {
        await senderAPI_1.sender.sendText(sid, 'Template 訊息\n可包圖片、文字、按鈕，單筆最多 10 組');
        senderAPI_1.sender.sendTemplate(sid, [
            {
                title: 'Generic Template',
                subtitle: '此類模板即為 Template 訊息, 可包圖片、文字、按鈕，單筆最多 10 組元件, 每個元件最多 3 個按鈕',
                image_url: 'https://via.placeholder.com/150x100',
                buttons: [
                    {
                        type: 'web_url',
                        title: 'Web Link (Google)',
                        url: 'https://www.google.com',
                    },
                    {
                        type: 'postback',
                        title: 'button',
                        payload: 'null',
                    },
                ],
            },
        ]);
    }
}
exports.basicSend = basicSend;
