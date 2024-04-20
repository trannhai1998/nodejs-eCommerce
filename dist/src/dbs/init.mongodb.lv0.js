"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CONNECT_STRING = `mongodb://127.0.0.1:27017/myShop`;
mongoose_1.default
    .connect(CONNECT_STRING)
    .then(() => console.log('Connected Mongodb Success'))
    .catch((err) => console.log('Error Connect!: ', err));
exports.default = mongoose_1.default;
