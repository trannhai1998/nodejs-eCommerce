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
exports.ORDER_STATUS = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "pending";
    ORDER_STATUS["CONFIRMED"] = "confirmed";
    ORDER_STATUS["SHIPPED"] = "shipped";
    ORDER_STATUS["CANCELLED"] = "cancelled";
    ORDER_STATUS["DELIVERED"] = "delivered";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
const orderSchema = new mongoose_1.default.Schema({
    order_userId: { type: mongoose_1.Types.ObjectId, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: { type: Object, default: {} },
    /*
        street,
        city,
        state,
        country
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: '#0000125112023' },
    order_status: {
        type: String,
        enum: ORDER_STATUS,
        default: ORDER_STATUS.PENDING,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
const OrderModel = mongoose_1.default.model(DOCUMENT_NAME, orderSchema);
exports.default = OrderModel;
