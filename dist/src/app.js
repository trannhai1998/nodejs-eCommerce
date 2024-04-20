"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routers_1 = __importDefault(require("./routers"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const check_connect_1 = require("./helpers/check.connect");
const app = (0, express_1.default)();
// Init Middleware
app.use((0, morgan_1.default)('dev')); // Show info request (IP, status, request by, request where - Postman, chrome....)
app.use((0, helmet_1.default)()); // Protection (curl http://localhost:3000 --include)
app.use((0, compression_1.default)()); // Zip Faster payload (small size)
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
// Test pub sub redis
// require('./tests/inventory.test');
// const productTest = require('./tests/product.test');
// ProductTestService.purchaseProduct('product:001', 1);
// Init DB
require('./dbs/init.mongodb');
(0, check_connect_1.checkOverload)();
// Init Router
app.use('/', routers_1.default);
// Handling error
// 404
app.use((req, res, next) => {
    const error = new Error('Not found');
    // error.name .status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.status) || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error === null || error === void 0 ? void 0 : error.stack,
        message: error.message || 'Internal Server Error',
    });
});
exports.default = app;
