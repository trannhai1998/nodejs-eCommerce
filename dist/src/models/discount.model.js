'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const { model, Schema, Types } = mongoose; // Erase if already required
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
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
    discount_shopId: { type: Types.ObjectId, ref: 'Shop' },
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
const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema);
exports.default = DiscountModel;
