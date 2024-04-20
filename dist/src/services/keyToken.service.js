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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const keyToken_model_1 = __importDefault(require("../models/keyToken.model"));
const mongoose_1 = require("mongoose");
class KeyTokenService {
}
_a = KeyTokenService;
KeyTokenService.createKeyToken = ({ userId, publicKey, privateKey, refreshToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { user: userId }, update = {
            publicKey,
            privateKey,
            refreshTokenUsed: [],
            refreshToken,
        }, options = { upsert: true, new: true };
        const tokens = yield keyToken_model_1.default.findOneAndUpdate(filter, update, options);
        return tokens ? tokens === null || tokens === void 0 ? void 0 : tokens.publicKey : null;
    }
    catch (err) {
        return err;
    }
});
KeyTokenService.findKeyTokenByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findOne({
        user: new mongoose_1.Types.ObjectId(userId),
    });
});
KeyTokenService.removeKeyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findByIdAndDelete(id);
});
KeyTokenService.findByRefreshTokenUsed = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default
        .findOne({ refreshTokenUsed: refreshToken })
        .lean();
});
KeyTokenService.deleteKeyById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.deleteOne({
        user: new mongoose_1.Types.ObjectId(userId),
    });
});
KeyTokenService.findByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findOne({ refreshToken });
});
exports.default = KeyTokenService;
