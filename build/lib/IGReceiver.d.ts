/// <reference types="./types" />
/// <reference types="node" />
import Events from 'events';
interface IGReceiverOptions {
    verifyToken: string;
    appSecret: string;
    /** Default is "/webhook" */
    webhook?: string;
}
interface UserState {
    /** required in conversation */
    step: string;
    [x: string]: any;
}
interface IGReceiver {
    on(event: 'beforeEvent', cb: (event: any, userId: string) => void): this;
    on(event: 'text', cb: (event: MsgerTextEvent, userId: string) => void): this;
    on(event: 'quickReply', cb: (event: MsgerQuickReplyEvent, userId: string) => void): this;
    on(event: 'attachments', cb: (event: MsgerAttachmentsEvent, userId: string) => void): this;
    on(event: 'postback', cb: (event: MsgerPostbackEvent, userId: string) => void): this;
    on<T extends UserState>(step: string, cb: (event: MsgerEventType, userState: T, userId: string) => void): this;
}
declare class IGReceiver extends Events {
    #private;
    app: import("express-serve-static-core").Express;
    state: Map<string, UserState>;
    constructor(options: IGReceiverOptions);
    /** Start express server, default port is 3000 */
    start(port?: number | string): void;
    startConversation(userId: string, eventName: string): void;
    /** End the conversation by delete user's state */
    endConversation(userId: string): boolean;
}
export default IGReceiver;
