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
const success_response_1 = require("../core/success.response");
const cart_service_1 = __importDefault(require("../services/cart.service"));
class CartController {
    constructor() {
        /**
         * @desc add cart for user
         * @param req
         * @param res
         * @param next
         */
        this.addToCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // new
            new success_response_1.SuccessResponse({
                message: 'Create New Cart success!',
                metadata: yield cart_service_1.default.addToCart(req.body),
            }).send(res);
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // new
            new success_response_1.SuccessResponse({
                message: 'Update Cart success!',
                metadata: yield cart_service_1.default.addToCartV2(req.body),
            }).send(res);
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // new
            new success_response_1.SuccessResponse({
                message: 'Delete New Cart success!',
                metadata: yield cart_service_1.default.deleteUserCart(req.body),
            }).send(res);
        });
        this.listToCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // new
            new success_response_1.SuccessResponse({
                message: 'Get List Cart success!',
                metadata: yield cart_service_1.default.getListUserCart(req.query),
            }).send(res);
        });
    }
}
exports.default = new CartController();
