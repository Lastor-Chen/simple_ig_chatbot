"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = void 0;
const lib_1 = require("@/lib");
const sender = new lib_1.IGSender(process.env.PAGE_ACCESS_TOKEN);
exports.sender = sender;
