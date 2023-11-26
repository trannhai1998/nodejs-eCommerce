'use strict';
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
const shop_model_1 = __importDefault(require("../models/shop.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
const authUtils_1 = require("../auth/authUtils");
const utils_1 = require("../utils");
const error_response_1 = require("../core/error.response");
const shop_service_1 = require("../services/shop.service");
const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
}
_a = AccessService;
AccessService.logout = (keyStore) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Logout');
    const delKey = yield keyToken_service_1.default.removeKeyById(keyStore._id);
    return delKey;
});
/*
    1- Check email in dbs.
    2- match Password.
    3- create access token & refresh token and save.
    4- generate tokens.
    5- get Data return login
*/
AccessService.login = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    //1
    const foundShop = yield (0, shop_service_1.findByEmail)({ email });
    if (!foundShop) {
        throw new error_response_1.BadRequestError('Shop not registered!');
    }
    //2
    const match = yield bcrypt_1.default.compare(password, foundShop.password);
    if (!match) {
        throw new error_response_1.AuthFailureError('Authentication error');
    }
    //3
    // Create privateKey, publicKey.
    const privateKey = crypto_1.default.randomBytes(64).toString('hex');
    const publicKey = crypto_1.default.randomBytes(64).toString('hex');
    const { _id: userId } = foundShop;
    //4- generate tokens.
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId, email }, publicKey, privateKey);
    yield keyToken_service_1.default.createKeyToken({
        privateKey,
        publicKey,
        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken,
        userId,
    });
    return {
        shop: (0, utils_1.getInfoData)({
            fields: ['_id', 'name', 'email'],
            object: foundShop,
        }),
        tokens,
    };
});
AccessService.signUp = ({ name, email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: check email exists?
        const holderShop = yield shop_model_1.default
            .findOne({ email })
            .lean(); // Lean help query faster => tra? ve object js nhe. hon neu ko co lean
        if (holderShop) {
            throw new error_response_1.BadRequestError('Error: Shop already registered!');
        }
        // ma hoa password
        const passwordHash = yield bcrypt_1.default.hash(password, 6);
        const newShop = yield shop_model_1.default.create({
            name,
            email,
            password: passwordHash,
            roles: [ROLE_SHOP.SHOP],
        });
        if (newShop) {
            // Created privateKey, publicKey
            // level advance: amazon...
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { // rsa: bat doi xung
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1', // Public key cryptoGraphy Standards
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1', // Public key cryptoGraphy Standards
            //         format: 'pem'
            //     }
            // })
            const privateKey = crypto_1.default
                .randomBytes(64)
                .toString('hex');
            const publicKey = crypto_1.default
                .randomBytes(64)
                .toString('hex');
            const keyStore = yield keyToken_service_1.default.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });
            if (!keyStore) {
                return {
                    status: 'xxxxx',
                    message: 'Key Store error',
                };
            }
            const tokens = yield (0, authUtils_1.createTokenPair)({ userId: newShop._id, email }, publicKey, privateKey);
            return {
                code: 201,
                metadata: {
                    shop: (0, utils_1.getInfoData)({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    }
    catch (error) {
        console.error(error);
        return {
            code: 'xxx',
            message: error === null || error === void 0 ? void 0 : error.message,
            status: 'error',
        };
    }
});
/**
 *
 * @param {*} refreshToken
 * Check this token used?
 */
AccessService.handlerRefreshTokenV2 = ({ keyStore, user, refreshToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
        yield keyToken_service_1.default.deleteKeyById(userId);
        throw new error_response_1.ForbiddenError('Something wrong happened! Please login again');
    }
    if (keyStore.refreshToken !== refreshToken) {
        throw new error_response_1.AuthFailureError('Shop not Registered');
    }
    const foundShop = yield (0, shop_service_1.findByEmail)({ email });
    if (!foundShop) {
        throw new error_response_1.AuthFailureError('Shop not registered');
    }
    // Create new token
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId, email }, keyStore.publicKey, keyStore.privateKey);
    // Update token
    console.log('Run here', keyStore);
    yield keyStore.updateOne({
        $set: {
            refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken,
        },
        $addToSet: {
            refreshTokenUsed: refreshToken, // Add token used to refreshTokenUsed field
        },
    });
    return {
        user,
        tokens,
    };
});
exports.default = AccessService;
