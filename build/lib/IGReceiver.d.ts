/// <reference types="node" />
/// <reference types="./types" />
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
interface IGReceiverEvent {
    beforeEvent: (event: any, userId: string) => void;
    text: (event: MsgerTextEvent, userId: string) => void;
    quickReply: (event: MsgerQuickReplyEvent, userId: string) => void;
    attachments: (event: MsgerAttachmentsEvent, userId: string) => void;
    postback: (event: MsgerPostbackEvent, userId: string) => void;
}
declare type StepCallback<T = UserState> = (event: MsgerEventType, userId: string, userState: T) => void;
interface IGReceiver {
    on<U extends keyof IGReceiverEvent>(event: U, cb: IGReceiverEvent[U]): this;
    emit<U extends keyof IGReceiverEvent>(eventName: U, ...args: Parameters<IGReceiverEvent[U]>): boolean;
    on<T extends UserState>(step: string, cb: StepCallback<T>): this;
    emit(eventName: string, ...args: Parameters<StepCallback>): boolean;
}
declare class IGReceiver extends Events {
    #private;
    app: import("express-serve-static-core").Express;
    state: Map<string, UserState>;
    constructor(options: IGReceiverOptions);
    /** Start express server, default port is 3000 */
    start(port?: number | string): void;
    /** Set which conversation step is user at */
    gotoStep(userId: string, eventName: string): void;
    /** End the conversation by delete user's state */
    endConversation(userId: string): boolean;
}
export default IGReceiver;
