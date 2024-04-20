"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const access_controller_1 = __importDefault(require("../../controllers/access.controller"));
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
// signUp
router.post('/shop/signup', (0, asyncHandler_1.asyncHandler)(access_controller_1.default.signUp));
router.post('/shop/login', (0, asyncHandler_1.asyncHandler)(access_controller_1.default.login));
// Authentication
router.use(authUtils_1.authenticationV2);
router.post('/shop/logout', (0, asyncHandler_1.asyncHandler)(access_controller_1.default.logout));
router.post('/shop/handlerRefreshToken', (0, asyncHandler_1.asyncHandler)(access_controller_1.default.handlerRefreshToken));
exports.default = router;
