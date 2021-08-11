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
var _IGReceiver_instances, _IGReceiver_verifyToken, _IGReceiver_appSecret, _IGReceiver_webhook, _IGReceiver_configExpress, _IGReceiver_initWebhook, _IGReceiver_postWebhook, _IGReceiver_handleMsgerData;
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const express_1 = __importDefault(require("express"));
class IGReceiver extends events_1.default {
    constructor(options) {
        super();
        _IGReceiver_instances.add(this);
        _IGReceiver_verifyToken.set(this, void 0);
        _IGReceiver_appSecret.set(this, void 0);
        _IGReceiver_webhook.set(this, void 0);
        this.app = express_1.default();
        this.state = new Map();
        if (!options.verifyToken || !options.appSecret) {
            throw new Error('verifyToken or appSecret is required');
        }
        __classPrivateFieldSet(this, _IGReceiver_verifyToken, options.verifyToken, "f");
        __classPrivateFieldSet(this, _IGReceiver_appSecret, options.appSecret, "f");
        __classPrivateFieldSet(this, _IGReceiver_webhook, options.webhook || '/webhook', "f");
        __classPrivateFieldGet(this, _IGReceiver_instances, "m", _IGReceiver_configExpress).call(this);
    }
    /** Start express server, default port is 3000 */
    start(port = 3000) {
        __classPrivateFieldGet(this, _IGReceiver_instances, "m", _IGReceiver_initWebhook).call(this);
        this.app.listen(port, () => {
            console.log(`Chatbot is running`);
            console.log(`Webhook running on localhost:${port}/webhook`);
        });
    }
    startConversation(userId, eventName) {
        this.state.set(userId, { step: eventName });
    }
    /** End the conversation by delete user's state */
    endConversation(userId) {
        if (this.state.has(userId)) {
            return this.state.delete(userId);
        }
        else {
            console.log("Can't found user in conversation");
            return false;
        }
    }
}
_IGReceiver_verifyToken = new WeakMap(), _IGReceiver_appSecret = new WeakMap(), _IGReceiver_webhook = new WeakMap(), _IGReceiver_instances = new WeakSet(), _IGReceiver_configExpress = function _IGReceiver_configExpress() {
    this.app.use(express_1.default.json()); // 解析 request json body
    this.app.use(express_1.default.urlencoded({ extended: true })); // 解析 queryString
}, _IGReceiver_initWebhook = function _IGReceiver_initWebhook() {
    // Verify webhook callback URL
    const webhookPath = __classPrivateFieldGet(this, _IGReceiver_webhook, "f")[0] !== '/' ? `/${__classPrivateFieldGet(this, _IGReceiver_webhook, "f")}` : __classPrivateFieldGet(this, _IGReceiver_webhook, "f");
    this.app.get(webhookPath, (req, res) => {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode !== 'subscribe' || token !== __classPrivateFieldGet(this, _IGReceiver_verifyToken, "f")) {
            console.log('Failed validation. Make sure the validation tokens match');
            return res.sendStatus(403);
        }
        res.status(200).send(challenge);
        console.log('Validation Succeeded');
    });
    // Receive messaging
    this.app.post('/webhook', (req, res) => {
        __classPrivateFieldGet(this, _IGReceiver_instances, "m", _IGReceiver_postWebhook).call(this, req, res);
    });
}, _IGReceiver_postWebhook = function _IGReceiver_postWebhook(req, res) {
    // Must send back a 200 within 20 seconds or the request will time out.
    res.sendStatus(200);
    const body = req.body;
    if (body.object === 'instagram') {
        __classPrivateFieldGet(this, _IGReceiver_instances, "m", _IGReceiver_handleMsgerData).call(this, body);
    }
    else {
        console.log("Received a webhook, but it's not Instagram Messaging");
    }
}, _IGReceiver_handleMsgerData = function _IGReceiver_handleMsgerData(body) {
    // Iterate over each entry. There may be multiple if batched.
    body.entry.forEach((entry) => {
        // Iterate over each messaging event
        entry.messaging.forEach((event) => {
            if (event.message?.is_echo)
                return void 0;
            const sid = event.sender.id;
            this.emit('beforeEvent', event, sid);
            if (this.state.has(sid)) {
                // Intercept the event to continue a conversation
                const userState = this.state.get(sid);
                this.emit(userState.step, event, userState, sid);
            }
            else if ('message' in event) {
                if ('quick_reply' in event.message) {
                    this.emit('quickReply', event, sid);
                }
                else if ('attachments' in event.message) {
                    this.emit('attachments', event, sid);
                }
                else if ('text' in event.message) {
                    this.emit('text', event, sid);
                }
            }
            else if ('postback' in event) {
                this.emit('postback', event, sid);
            }
            else {
                console.log('Received a unhandled webhook event', event);
            }
        });
    });
};
exports.default = IGReceiver;
