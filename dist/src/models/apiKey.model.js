"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';
const keyTokenSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d',
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
exports.default = mongoose_1.default.model(DOCUMENT_NAME, keyTokenSchema);
