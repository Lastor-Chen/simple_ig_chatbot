"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = void 0;
const lib_1 = require("@/lib");
exports.sender = new lib_1.IGSender(process.env.PAGE_ACCESS_TOKEN);
