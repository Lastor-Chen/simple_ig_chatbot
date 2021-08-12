"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiver = void 0;
const lib_1 = require("@/lib");
exports.receiver = new lib_1.IGReceiver({
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET,
});
