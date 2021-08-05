"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGSender = exports.IGReceiver = void 0;
/// <reference types="./types" />
const IGReceiver_1 = __importDefault(require("./IGReceiver"));
exports.IGReceiver = IGReceiver_1.default;
const IGSender_1 = __importDefault(require("./IGSender"));
exports.IGSender = IGSender_1.default;
