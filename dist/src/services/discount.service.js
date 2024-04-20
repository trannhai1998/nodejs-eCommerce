'use strict';
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
const error_response_1 = require("../core/error.response");
const utils_1 = require("../utils");
const product_repo_1 = require("../models/repositories/product.repo");
const discount_repo_1 = require("../models/repositories/discount.repo");
const discount_model_1 = __importDefault(require("../models/discount.model"));
const DISCOUNT_TYPE = {
    ALL: 'all',
    SPECIFIC: 'specific',
};
class DiscountService {
    static createDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_uses, uses_count, users_used, max_value_while_percent, max_users_per_user, } = payload;
            // if (
            // 	new Date() < new Date(start_date) ||
            // 	new Date() > new Date(end_date)
            // ) {
            // 	throw new BadRequestError('Discount code has expired');
            // }
            if (new Date(end_date) <= new Date(start_date)) {
                return new error_response_1.BadRequestError('Start Date must be before end date');
            }
            // create index for discount code
            const foundDiscount = yield this.findDiscountCode({
                discount_code: code,
                discount_shopId: shopId,
            });
            if (foundDiscount && (foundDiscount === null || foundDiscount === void 0 ? void 0 : foundDiscount.discount_is_active)) {
                throw new error_response_1.BadRequestError('Discount existed and active!');
            }
            const newDiscount = yield discount_model_1.default.create({
                discount_code: code,
                discount_start_date: new Date(start_date),
                discount_end_date: new Date(end_date),
                discount_is_active: is_active,
                discount_shopId: shopId,
                discount_min_order_value: min_order_value || 0,
                discount_product_ids: applies_to === 'all' ? [] : product_ids,
                discount_applies_to: applies_to,
                discount_name: name,
                discount_description: description,
                discount_type: type,
                discount_value: value,
                discount_max_uses: max_uses,
                discount_uses_count: uses_count,
                discount_users_used: users_used,
                discount_max_value_while_percent: max_value_while_percent,
                discount_max_users_per_user: max_users_per_user,
            });
            return newDiscount;
        });
    }
    static findDiscountCode({ discount_code, discount_shopId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield discount_model_1.default.findOne({
                discount_code,
                discount_shopId: (0, utils_1.convertToObjectIdMongodb)(discount_shopId),
            }).lean();
        });
    }
    static updateDiscountCode() {
        return __awaiter(this, void 0, void 0, function* () {
            //...
        });
    }
    /**
     * Get All Discount for this product
     */
    static getAllDiscountCodesWithProduct({ code, shopId, limit, page, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // create index for discount_code.
            const foundDiscount = yield this.findDiscountCode({
                discount_code: code,
                discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
            });
            if (!foundDiscount || !foundDiscount.discount_is_active) {
                throw new error_response_1.NotFoundError('discount not exists!');
            }
            const { discount_applies_to, discount_product_ids } = foundDiscount;
            if (discount_applies_to === DISCOUNT_TYPE.ALL) {
                // get all product
                const products = yield (0, product_repo_1.findAllProducts)({
                    filter: {
                        product_shop: (0, utils_1.convertToObjectIdMongodb)(shopId),
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
                return products;
            }
            if (discount_applies_to === DISCOUNT_TYPE.SPECIFIC) {
                // get the product ids
                const products = yield (0, product_repo_1.findAllProducts)({
                    filter: {
                        _id: { $in: discount_product_ids },
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
                return products;
            }
        });
    }
    // Get all discount code of shop
    static getAllDiscountCodesByShop({ limit, page, shopId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const discounts = yield (0, discount_repo_1.findAllDiscountCodesUnselect)({
                limit,
                page,
                filter: {
                    discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
                    discount_is_active: true,
                },
                unselect: ['__v', 'discount_shopId'],
                model: discount_model_1.default,
            });
            return discounts;
        });
    }
    /*
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
    static getDiscountAmount({ codeId, userId, shopId, products }) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExists)({
                discount_code: codeId,
                discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
            });
            if (!foundDiscount)
                throw new error_response_1.NotFoundError(`Discount doesn't existed`);
            const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_max_users_per_user, discount_users_used, discount_type, discount_value, } = foundDiscount;
            if (!discount_is_active)
                throw new error_response_1.NotFoundError('discount expired!');
            if (!discount_max_uses)
                throw new error_response_1.NotFoundError('discount expired!');
            if (new Date() <
                new Date(discount_start_date || new Date() > new Date(discount_end_date))) {
                throw new error_response_1.NotFoundError('Discount code has expired!');
            }
            let totalOrder = 0;
            if (discount_min_order_value > 0) {
                totalOrder = products.reduce((acc, product) => {
                    return acc + product.quantity * product.price;
                }, 0);
                if (totalOrder < discount_min_order_value) {
                    throw new error_response_1.NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`);
                }
            }
            if (discount_max_users_per_user > 0) {
                const userUsedDiscount = discount_users_used.find((user) => user.userId === userId);
                if (userUsedDiscount) {
                    // Already use.
                }
            }
            // Check xem discount nay la fixed_amount
            const amount = discount_type === 'fixed_amount'
                ? discount_value
                : totalOrder * (discount_value / 100);
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount,
            };
        });
    }
    static deleteDiscountCode({ shopId, codeId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield discount_model_1.default.findOneAndDelete({
                discount_code: codeId,
                discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
            });
            return deleted;
        });
    }
    static cancelDiscountCode({ codeId, shopId, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExists)({
                discount_shopId: shopId,
                discount_code: codeId,
            });
            if (!foundDiscount) {
                throw new error_response_1.NotFoundError(`Discount doesn't existed!`);
            }
            const result = yield discount_model_1.default.findByIdAndUpdate(foundDiscount._id, {
                $pull: {
                    discount_users_userId: userId,
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1,
                },
            });
            return result;
        });
    }
}
exports.default = DiscountService;
