"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisPubsub_service_1 = __importDefault(require("../services/redisPubsub.service"));
class InventoryServiceTest {
    constructor() {
        redisPubsub_service_1.default.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message);
        });
    }
    static updateInventory({ productId, quantity }) {
        console.log(`Updated inventory ${productId} with quantity ${quantity}`);
    }
}
exports.default = new InventoryServiceTest();
