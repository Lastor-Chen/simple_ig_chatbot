/// <reference types="./types" />
interface UserState {
    id: string;
    step: string;
    race?: string;
    job?: string;
    gender?: string;
}
declare const users: UserState[];
declare function convoA(event: MsgerPostbackEvent | MsgerTextEvent | MsgerAttachmentsEvent): Promise<boolean | undefined>;
export { convoA, users };
