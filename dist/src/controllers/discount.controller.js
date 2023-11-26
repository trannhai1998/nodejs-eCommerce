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
const discount_service_1 = __importDefault(require("../services/discount.service"));
class DiscountController {
    constructor() {
        this.createDiscountCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Run here Create new discount');
            new success_response_1.SuccessResponse({
                message: 'Successfully Code Generations',
                metadata: yield discount_service_1.default.createDiscountCode(Object.assign(Object.assign({}, req.body), { shopId: req.user.userId })),
            }).send(res);
        });
        this.getAllDiscountCodeByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Run here');
            new success_response_1.SuccessResponse({
                message: 'Successfully get all discount',
                metadata: yield discount_service_1.default.getAllDiscountCodesByShop(Object.assign(Object.assign({}, req.query), { shopId: req.user.userId })),
            }).send(res);
        });
        this.getDiscountAmount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Get amount ======================');
            new success_response_1.SuccessResponse({
                message: 'Successfully get discount amount',
                metadata: yield discount_service_1.default.getDiscountAmount(Object.assign({}, req.body)),
            }).send(res);
        });
        this.getAllDiscountCodesWithProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Successfully get all discount with product',
                metadata: yield discount_service_1.default.getAllDiscountCodesWithProduct(Object.assign({}, req.query)),
            }).send(res);
        });
    }
}
exports.default = new DiscountController();
