"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisPubsub_service_1 = __importDefault(require("../services/redisPubsub.service"));
class ProductServiceTest {
    constructor() { }
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity,
        };
        console.log('Run here 2 2 ');
        redisPubsub_service_1.default.publish('purchase_events', JSON.stringify(order));
    }
}
exports.default = new ProductServiceTest();
