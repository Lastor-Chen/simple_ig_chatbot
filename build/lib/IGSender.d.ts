/// <reference types="./types" />
import type { AxiosInstance } from 'axios';
/** Instagram Messaging sender API */
declare class IGSender {
    #private;
    graphAPI: AxiosInstance;
    constructor(accessToken: string);
    handleError(err: any): void;
    /**
     * Send message with text or quick replies. QuickReply payload is English and numbers only.
     * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/send-api#message Send Message API}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
     */
    sendText(receiver: string, text: string, quickReplies?: Array<string | QuickReply>): Promise<void>;
    /**
     * Send attachment. Attachment type is different from Messenger
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
     */
    sendAttachment(receiver: string, type: AttachmentType, url: string): Promise<void>;
    /**
     * Send Template that supports a maximum of 10 elements per message and 3 buttons per element
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template Generic Template}
     * @see {@link https://developers.facebook.com/docs/messenger-platform/send-messages/buttons Buttons}
     */
    sendTemplate(senderId: string, elements: TemplateElement[]): Promise<void>;
    /**
     * A maximum of 4 questions can be set
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#setting-ice-breakers Ice Breakers}
     */
    setIceBreakers(iceBreakers: IceBreaker[]): Promise<void>;
    /**
     * Get current Ice Breakers
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#getting-ice-breakers Ice Breakers}
     */
    getIceBreakers(): Promise<IceBreakerRes | undefined>;
    /**
     * Get Instagram user's profile information
     * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile User Profile}
     */
    getUserProfile(IGSID: string, fields?: Array<'name' | 'profile_pci'>): Promise<{
        id: string;
        name?: string | undefined;
        profile_pic?: string | undefined;
    } | undefined>;
}
export default IGSender;
