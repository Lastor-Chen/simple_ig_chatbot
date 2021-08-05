/// <reference types="./types" />
/// <reference types="node" />
import Events from 'events';
import type { Request, Response } from 'express';
interface IGReceiverOptions {
    verifyToken: string;
    appSecret: string;
}
interface IGReceiver {
    on(event: 'text', cb: (event: MsgerTextEvent) => void): this;
    on(event: 'quickReply', cb: (event: MsgerQuickReplyEvent) => void): this;
    on(event: 'attachments', cb: (event: MsgerAttachmentsEvent) => void): this;
    on(event: 'postback', cb: (event: MsgerPostbackEvent) => void): this;
}
declare class IGReceiver extends Events {
    verifyToken: string;
    appSecret: string;
    app: import("express-serve-static-core").Express;
    constructor(options: IGReceiverOptions);
    configExpress(): void;
    start(port: number | string): void;
    initWebhook(): void;
    postWebhook(req: Request, res: Response): void;
    handleMsgerData(body: MsgerBody): void;
}
export default IGReceiver;
