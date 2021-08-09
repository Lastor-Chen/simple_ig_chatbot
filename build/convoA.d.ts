/// <reference types="./types" />
import type { IGSender } from '@/lib';
interface UserState {
    id: string;
    step: string;
    data: {
        race?: string;
        job?: string;
        gender?: string;
    };
}
declare const users: UserState[];
declare function convoA(event: MsgerPostbackEvent | MsgerTextEvent, sender: IGSender): Promise<void>;
export { convoA, users };
