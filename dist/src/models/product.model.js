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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.furnitureModel = exports.electronicModel = exports.clothingModel = exports.productModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const DOCUMENT_PRODUCT_NAME = 'Product';
const COLLECTION_PRODUCT_NAME = 'Products';
// Declare the Schema of the Mongo model
const ProductSchema = new mongoose_1.default.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: String,
    product_attributes: { type: mongoose_1.Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be lower 5'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false,
    },
}, {
    timestamps: true,
    collection: COLLECTION_PRODUCT_NAME,
});
// create index for search
ProductSchema.index({
    product_name: 'text',
    product_description: 'text',
});
// Document middleware: runs before .save() and .create()...
ProductSchema.pre('save', function (next) {
    this.product_slug = (0, slugify_1.default)(this.product_name, { lower: true });
    next();
});
// Define the product type = "Clothing"
const DOCUMENT_CLOTHING_NAME = 'Clothing';
const COLLECTION_CLOTHING_NAME = 'Clothes';
const clothingSchema = new mongoose_1.Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: COLLECTION_CLOTHING_NAME,
    timestamps: true,
});
// Define the product type = "Electronics"
const DOCUMENT_ELECTRONIC_NAME = 'Electronic';
const COLLECTION_ELECTRONIC_NAME = 'Electronics';
const electronicSchema = new mongoose_1.Schema({
    manufacture: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: COLLECTION_ELECTRONIC_NAME,
    timestamps: true,
});
const DOCUMENT_FURNITURE_NAME = 'Furniture';
const COLLECTION_FURNITURE_NAME = 'Furniture';
const furnitureSchema = new mongoose_1.Schema({
    manufacture: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: COLLECTION_FURNITURE_NAME,
    timestamps: true,
});
//Export the model
exports.productModel = mongoose_1.default.model(DOCUMENT_PRODUCT_NAME, ProductSchema);
exports.clothingModel = mongoose_1.default.model(DOCUMENT_CLOTHING_NAME, clothingSchema);
exports.electronicModel = mongoose_1.default.model(DOCUMENT_ELECTRONIC_NAME, electronicSchema);
exports.furnitureModel = mongoose_1.default.model(DOCUMENT_FURNITURE_NAME, furnitureSchema);
