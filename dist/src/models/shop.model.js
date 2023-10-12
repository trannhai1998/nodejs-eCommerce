"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';
const shopSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
const Shop = mongoose_1.default.model(DOCUMENT_NAME, shopSchema);
exports.default = Shop;
