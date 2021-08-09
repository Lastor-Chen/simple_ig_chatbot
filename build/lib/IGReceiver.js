"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const express_1 = __importDefault(require("express"));
class IGReceiver extends events_1.default {
    constructor(options) {
        super();
        this.app = express_1.default();
        if (!options.verifyToken || !options.appSecret) {
            throw new Error('verifyToken or appSecret is required');
        }
        this.verifyToken = options.verifyToken;
        this.appSecret = options.appSecret;
        this.configExpress();
    }
    configExpress() {
        this.app.use(express_1.default.json()); // 解析 request json body
        this.app.use(express_1.default.urlencoded({ extended: true })); // 解析 queryString
    }
    start(port) {
        this.initWebhook();
        this.app.listen(port, () => {
            console.log(`Chatbot is running on localhost:${port}/webhook`);
        });
    }
    initWebhook() {
        // Verify webhook callback URL
        this.app.get('/webhook', (req, res) => {
            const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge, } = req.query;
            if (mode !== 'subscribe' || token !== this.verifyToken) {
                console.log('Failed validation. Make sure the validation tokens match');
                return res.sendStatus(403);
            }
            res.status(200).send(challenge);
            console.log('Validation Succeeded');
        });
        // Receive messaging
        this.app.post('/webhook', (req, res) => {
            this.postWebhook(req, res);
        });
    }
    postWebhook(req, res) {
        const body = req.body;
        if (body.object === 'instagram') {
            // Must send back a 200 within 20 seconds or the request will time out.
            res.sendStatus(200);
            this.handleMsgerData(body);
        }
    }
    handleMsgerData(body) {
        // Iterate over each entry. There may be multiple if batched.
        body.entry.forEach((entry) => {
            // Iterate over each messaging event
            entry.messaging.forEach((event) => {
                if (event.message?.is_echo)
                    return void 0;
                console.log('\nmessaging', entry.messaging);
                if ('message' in event) {
                    if ('quick_reply' in event.message) {
                        return this.emit('quickReply', event);
                    }
                    else if ('attachments' in event.message) {
                        return this.emit('attachments', event);
                    }
                    else if ('text' in event.message) {
                        return this.emit('text', event);
                    }
                }
                else if ('postback' in event) {
                    return this.emit('postback', event);
                }
            });
        });
    }
}
exports.default = IGReceiver;
