"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushToLogDiscord = void 0;
const discord_log_v2_js_1 = __importDefault(require("../loggers/discord.log.v2.js"));
const pushToLogDiscord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        discord_log_v2_js_1.default.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req === null || req === void 0 ? void 0 : req.body,
            message: `${req.get('host')}${req.originalUrl}`,
        });
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.pushToLogDiscord = pushToLogDiscord;
