"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.PORT || 3200;
const server = app_1.default.listen(PORT, () => {
    console.log('WSV Node start with port', PORT);
});
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit Server Express');
    });
    // notify.send(...ping)
});
process.on('unhandledRejection', (error, promise) => {
    console.log(`Logged Error: ${error}`);
    server.close(() => process.exit(1));
});
