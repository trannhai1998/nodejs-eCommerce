"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const cart_controller_1 = __importDefault(require("../../controllers/cart.controller"));
const router = express_1.default.Router();
// QUERY Without Authentication
router.post('', (0, asyncHandler_1.asyncHandler)(cart_controller_1.default.addToCart));
router.get('', (0, asyncHandler_1.asyncHandler)(cart_controller_1.default.listToCart));
router.delete('', (0, asyncHandler_1.asyncHandler)(cart_controller_1.default.delete));
router.post('/update', (0, asyncHandler_1.asyncHandler)(cart_controller_1.default.update));
exports.default = router;
