"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _IGSender_instances, _IGSender_accessToken, _IGSender_initAxios, _IGSender_handleError, _IGSender_formatQuickReplies;
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
/** Instagram Messaging sender API */
class IGSender {
    constructor(accessToken) {
        _IGSender_instances.add(this);
        _IGSender_accessToken.set(this, void 0);
        if (!accessToken)
            throw new Error('accessToken is required');
        __classPrivateFieldSet(this, _IGSender_accessToken, accessToken, "f");
        this.graphAPI = __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_initAxios).call(this);
    }
    /**
     * Send message with text or quick replies. QuickReply payload is English and numbers only.
     * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/send-api#message Send Message API}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
     */
    async sendText(receiver, text, quickReplies) {
        try {
            const body = {
                messaging_type: 'RESPONSE',
                recipient: { id: receiver },
                message: { text: text },
            };
            if (quickReplies?.length) {
                const newQuickReplies = __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_formatQuickReplies).call(this, quickReplies);
                body.message.quick_replies = newQuickReplies;
            }
            const { status } = await this.graphAPI.post('/me/messages', body);
            return status === 200;
        }
        catch (e) {
            return __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
    /**
     * Send attachment. Attachment type is different from Messenger
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
     */
    async sendAttachment(receiver, type, url = '') {
        try {
            let attachment;
            if (type === 'image') {
                attachment = { type, payload: { url } };
            }
            else if (type === 'like_heart') {
                attachment = { type };
            }
            else {
                attachment = { type, payload: { id: url } };
            }
            const data = {
                messaging_type: 'RESPONSE',
                recipient: { id: receiver },
                message: { attachment },
            };
            const { status } = await this.graphAPI.post('/me/messages', data);
            return status === 200;
        }
        catch (e) {
            return __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
    /**
     * Send Template that supports a maximum of 10 elements per message and 3 buttons per element
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template Generic Template}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/send-messages/buttons Buttons}
     */
    async sendTemplate(senderId, elements) {
        try {
            const data = {
                messaging_type: 'RESPONSE',
                recipient: { id: senderId },
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements: elements,
                        },
                    },
                },
            };
            const { status } = await this.graphAPI.post('/me/messages', data);
            return status === 200;
        }
        catch (e) {
            return __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
    /**
     * A maximum of 4 questions can be set
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#setting-ice-breakers Ice Breakers}
     */
    async setIceBreakers(iceBreakers) {
        try {
            const body = {
                platform: 'instagram',
                ice_breakers: iceBreakers,
            };
            const { data } = await this.graphAPI.post('/me/messenger_profile', body, {
                params: { platform: 'instagram' },
            });
            if (data.result !== 'success')
                throw new Error('Set ice breakers failed');
            console.log('Set ice breakers is successful');
            return true;
        }
        catch (e) {
            return __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
    /**
     * Get current Ice Breakers
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#getting-ice-breakers Ice Breakers}
     */
    async getIceBreakers() {
        try {
            const { data } = await this.graphAPI.get('/me/messenger_profile', {
                params: {
                    platform: 'instagram',
                    fields: 'ice_breakers',
                },
            });
            return data;
        }
        catch (e) {
            __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
    /**
     * Get Instagram user's profile information
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile User Profile}
     */
    async getUserProfile(IGSID, fields) {
        try {
            // Remove the same field
            const fieldSet = new Set(fields);
            const { data } = await this.graphAPI.get(`/${IGSID}`, {
                params: {
                    fields: [...fieldSet].join(',') || 'name',
                },
            });
            return data;
        }
        catch (e) {
            __classPrivateFieldGet(this, _IGSender_instances, "m", _IGSender_handleError).call(this, e);
        }
    }
}
_IGSender_accessToken = new WeakMap(), _IGSender_instances = new WeakSet(), _IGSender_initAxios = function _IGSender_initAxios() {
    return axios_1.default.create({
        baseURL: 'https://graph.facebook.com/v11.0',
        params: { access_token: __classPrivateFieldGet(this, _IGSender_accessToken, "f") },
    });
}, _IGSender_handleError = function _IGSender_handleError(err) {
    console.log(err.message);
    if (axios_1.default.isAxiosError(err)) {
        console.log(err.response?.data);
    }
    return false;
}, _IGSender_formatQuickReplies = function _IGSender_formatQuickReplies(quickReplies) {
    return quickReplies.map((reply) => {
        if (typeof reply === 'string') {
            // payload 只允許英數字
            const normalizeString = reply.replace(/[^\w]+/g, '');
            return {
                content_type: 'text',
                title: reply,
                payload: `QR_${normalizeString}`,
            };
        }
        else {
            const normalizeString = reply.title.replace(/[^\w]+/g, '');
            return {
                content_type: 'text',
                payload: `QR_${normalizeString}`,
                ...reply,
            };
        }
    });
};
exports.default = IGSender;
