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
exports.reservationInventory = exports.insertInventory = void 0;
const utils_1 = require("../../utils");
const inventory_model_1 = __importDefault(require("../inventory.model"));
const insertInventory = ({ productId, shopId, stock, location = 'unknown', }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield inventory_model_1.default.create({
        inventory_productId: productId,
        inventory_shopId: shopId,
        inventory_stock: stock,
        inventory_location: location,
    });
});
exports.insertInventory = insertInventory;
const reservationInventory = ({ productId, quantity, cartId }) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        inventory_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
        inventory_stock: { $gte: quantity },
    };
    const updateSet = {
        $inc: {
            inventory_stock: -quantity,
        },
        $push: {
            inventory_reservations: {
                quantity,
                cartId,
                createOn: new Date(),
            },
        },
    };
    const options = { upsert: true, new: true };
    return yield inventory_model_1.default.updateOne(query, updateSet, options);
});
exports.reservationInventory = reservationInventory;
