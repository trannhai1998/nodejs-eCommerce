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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CART_STATE = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
var CART_STATE;
(function (CART_STATE) {
    CART_STATE["ACTIVE"] = "active";
    CART_STATE["COMPLETED"] = "completed";
    CART_STATE["FAILED"] = "failed";
    CART_STATE["PENDING"] = "pending";
})(CART_STATE || (exports.CART_STATE = CART_STATE = {}));
// Declare the Schema of the Mongo model
const cartSchema = new mongoose_1.default.Schema({
    cart_state: {
        type: String,
        enum: [
            CART_STATE.ACTIVE,
            CART_STATE.COMPLETED,
            CART_STATE.FAILED,
            CART_STATE.PENDING,
        ],
        default: CART_STATE.ACTIVE,
    },
    cart_products: { type: Array, required: true, default: [] },
    /**
     * productId,
     * shopId,
     * quantity,
     * name
     * price
     */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: mongoose_1.Types.ObjectId, required: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn',
    },
});
//Export the model
const CartModel = mongoose_1.default.model(DOCUMENT_NAME, cartSchema);
exports.default = CartModel;
