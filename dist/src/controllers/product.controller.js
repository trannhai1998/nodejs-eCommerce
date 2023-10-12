"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_advance_service_1 = __importDefault(require("../services/product.advance.service"));
const success_response_1 = require("../core/success.response");
class AccessController {
    constructor() {
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            new success_response_1.SuccessResponse({
                message: 'Create new prod successfully!',
                metadata: yield product_advance_service_1.default.createProduct((_a = req.body) === null || _a === void 0 ? void 0 : _a.product_type, Object.assign(Object.assign({}, req.body), { product_shop: req.user.userId })),
            }).send(res);
        });
        // QUERY
        this.getAllDraftsForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list Draft Success',
                metadata: yield product_advance_service_1.default.findAllDraftForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.getAllPublishesForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list Publishes Product Success',
                metadata: yield product_advance_service_1.default.findAllPublishForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.getListSearchProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list Search Product Success',
                metadata: yield product_advance_service_1.default.searchProducts(req === null || req === void 0 ? void 0 : req.params),
            }).send(res);
        });
        this.findAllProducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Params::: ', req === null || req === void 0 ? void 0 : req.query);
            new success_response_1.SuccessResponse({
                message: 'Find list All Product Success',
                metadata: yield product_advance_service_1.default.findAllProducts(req === null || req === void 0 ? void 0 : req.query),
            }).send(res);
        });
        this.findProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Params:::', req === null || req === void 0 ? void 0 : req.params);
            new success_response_1.SuccessResponse({
                message: 'Find One Product Success',
                metadata: yield product_advance_service_1.default.findProduct(req === null || req === void 0 ? void 0 : req.params),
            }).send(res);
        });
        // PUT
        this.publishProductByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Publish Product Success',
                metadata: yield product_advance_service_1.default.publishProductByShop({
                    product_shop: req.user.userId,
                    product_id: req.params.id,
                }),
            }).send(res);
        });
        this.unpublishProductByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Unpublish Product Success',
                metadata: yield product_advance_service_1.default.unpublishProductByShop({
                    product_shop: req.user.userId,
                    product_id: req.params.id,
                }),
            }).send(res);
        });
        // PATCH
        this.updateProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d;
            new success_response_1.SuccessResponse({
                message: 'Update Product Success',
                metadata: yield product_advance_service_1.default.updateProduct((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.product_type, (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.productId, Object.assign(Object.assign({}, req === null || req === void 0 ? void 0 : req.body), { product_shop: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.userId })),
            }).send(res);
        });
    }
}
exports.default = new AccessController();
