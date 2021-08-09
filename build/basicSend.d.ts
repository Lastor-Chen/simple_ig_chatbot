/// <reference types="./types" />
import type { IGSender } from "@/lib";
export declare function basicSend(event: MsgerPostbackEvent, sender: IGSender): Promise<void>;
