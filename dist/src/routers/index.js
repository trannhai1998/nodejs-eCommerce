"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../auth/checkAuth");
const product_1 = __importDefault(require("./product"));
const access_1 = __importDefault(require("./access"));
const discount_1 = __importDefault(require("./discount"));
const cart_1 = __importDefault(require("./cart"));
const checkout_1 = __importDefault(require("./checkout"));
const inventory_1 = __importDefault(require("./inventory"));
const comment_1 = __importDefault(require("./comment"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.use(middlewares_1.pushToLogDiscord);
// Check Api Key
router.use(checkAuth_1.apiKey);
// Check permission
router.use((0, checkAuth_1.permission)('0000'));
router.use('/v1/api/comment', comment_1.default);
router.use('/v1/api/cart', cart_1.default);
router.use('/v1/api/checkout', checkout_1.default);
router.use('/v1/api/inventory', inventory_1.default);
router.use('/v1/api/discount', discount_1.default);
router.use('/v1/api/product', product_1.default);
router.use('/v1/api', access_1.default);
exports.default = router;
