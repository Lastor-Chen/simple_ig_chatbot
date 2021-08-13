/// <reference types="./types" />
interface UserState {
    id: string;
    step: string;
    race?: string;
    job?: string;
    gender?: string;
}
declare const users: UserState[];
declare function convoA(event: MsgerEvent): Promise<boolean | void>;
export { convoA, users };
