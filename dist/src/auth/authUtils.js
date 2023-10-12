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
exports.verifyJWT = exports.authenticationV2 = exports.createTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../helpers/asyncHandler");
const error_response_1 = require("../core/error.response");
const keyToken_service_1 = __importDefault(require("../services/keyToken.service"));
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id',
};
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield jsonwebtoken_1.default.sign(payload, publicKey, {
            expiresIn: '2 days',
        });
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            expiresIn: '7 days',
        });
        // Verify
        jsonwebtoken_1.default.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify:: ${err}`);
            }
            else {
                console.log(`decode verify:: ${decode.toString()}`);
            }
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
    }
});
exports.createTokenPair = createTokenPair;
const authenticationV2 = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * 1- Check userId missing???
     * 2- get accessToken
     * 3- verifyToken
     * 4- Check use in dbs
     * 5- check keyStore with this userId
     * 6- Ok all => return next()
     */
    //1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new error_response_1.AuthFailureError('Invalid Request');
    //2
    const keyStore = yield keyToken_service_1.default.findKeyTokenByUserId(userId);
    if (!keyStore)
        throw new error_response_1.NotFoundError('Not Found KeyStore');
    //3
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = jsonwebtoken_1.default.verify(refreshToken, keyStore.privateKey);
            console.log(decodeUser);
            if (userId !== (decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.userId))
                throw new error_response_1.AuthFailureError('Invalid User');
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken)
        throw new error_response_1.AuthFailureError('Invalid Request');
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== (decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.userId))
            throw new error_response_1.AuthFailureError('Invalid User');
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}));
exports.authenticationV2 = authenticationV2;
const verifyJWT = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.verify(token, keySecret);
});
exports.verifyJWT = verifyJWT;
