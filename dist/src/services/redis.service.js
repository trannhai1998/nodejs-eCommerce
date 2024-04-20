"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseLock = exports.acquireLock = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const inventory_repo_1 = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();
const pExpire = (0, util_1.promisify)(redisClient.pExpire).bind(redisClient);
const setNXAsync = (0, util_1.promisify)(redisClient.setNX).bind(redisClient);
// Khoá Lạc Quan
const acquireLock = (productId, quantity, cartId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 second => lock.
    for (let index = 0; index < retryTimes; index++) {
        // Create 1 key, Who take it will go to order
        const result = yield setNXAsync(key, expireTime);
        console.log(`result:::`, result);
        if (result === 1) {
            // thao tac vs inventory
            const isReservation = yield (0, inventory_repo_1.reservationInventory)({
                productId,
                quantity,
                cartId,
            });
            if (!!isReservation.modifiedCount) {
                yield pExpire(key, expireTime);
                return key;
            }
            return null;
        }
        else {
            yield new Promise((resolve) => {
                setTimeout(resolve, 50);
            });
        }
    }
});
exports.acquireLock = acquireLock;
const releaseLock = (keyLock) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteAsyncKey = (0, util_1.promisify)(redisClient.del).bind(redisClient);
    return yield deleteAsyncKey(keyLock);
});
exports.releaseLock = releaseLock;
