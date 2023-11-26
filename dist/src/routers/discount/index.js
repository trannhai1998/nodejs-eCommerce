"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const discount_controller_1 = __importDefault(require("../../controllers/discount.controller"));
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
// QUERY Without Authentication
router.post('/amount', (0, asyncHandler_1.asyncHandler)(discount_controller_1.default.getDiscountAmount));
router.get('/list_product_code', (0, asyncHandler_1.asyncHandler)(discount_controller_1.default.getAllDiscountCodesWithProduct));
// Authentication
router.use(authUtils_1.authenticationV2);
router.post('', (0, asyncHandler_1.asyncHandler)(discount_controller_1.default.createDiscountCode));
router.get('', (0, asyncHandler_1.asyncHandler)(discount_controller_1.default.getAllDiscountCodeByShop));
exports.default = router;
