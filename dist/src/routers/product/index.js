"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const product_controller_1 = __importDefault(require("../../controllers/product.controller"));
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
// QUERY Without Authenication
router.get('/search/:keySearch', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.getListSearchProduct(req, res)));
router.get('', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.findAllProducts(req, res)));
router.get('/:product_id', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.findProduct(req, res)));
// Authentication
router.use(authUtils_1.authenticationV2);
// QUERY
router.get('/draft/all', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.getAllDraftsForShop(req, res)));
router.get('/published/all', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.getAllPublishesForShop(req, res)));
// PUT
router.post('/new', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.createProduct(req, res)));
router.post('/published/:id', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.publishProductByShop(req, res)));
router.post('/unpublished/:id', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.unpublishProductByShop(req, res)));
// PATCH
router.patch('/update/:productId', (0, asyncHandler_1.asyncHandler)((req, res) => product_controller_1.default.updateProduct(req, res)));
exports.default = router;
