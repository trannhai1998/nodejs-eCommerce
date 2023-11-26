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
const error_response_1 = require("../core/error.response");
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const product_repo_1 = require("../models/repositories/product.repo");
class InventoryService {
    static addStockToInventory({ stock, productId, shopId, location = '306 Tran Phu, Da Nang', }) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield (0, product_repo_1.getProductById)(productId);
            if (!product) {
                throw new error_response_1.NotFoundError('Not found product');
            }
            const query = {
                inventory_shopId: shopId,
                inventory_productId: productId,
            };
            const updateSet = {
                $inc: {
                    inventory_stock: stock,
                },
                $set: {
                    inventory_location: location,
                },
            };
            const options = { upsert: true, new: true };
            return yield inventory_model_1.default.findOneAndUpdate(query, updateSet, options);
        });
    }
}
exports.default = InventoryService;
