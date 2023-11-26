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
const mongoose_1 = __importStar(require("mongoose"));
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
// Declare the Schema of the Mongo model
const discountSchema = new mongoose_1.default.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },
    discount_users_used: { type: Array, default: [] },
    discount_max_users_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: mongoose_1.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific'],
    },
    discount_product_ids: { type: Array, default: [] },
    discount_max_value_while_percent: { type: Number },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
const DiscountModel = mongoose_1.default.model(DOCUMENT_NAME, discountSchema);
exports.default = DiscountModel;
