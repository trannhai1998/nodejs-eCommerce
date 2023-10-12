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
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model.js');
const { convertToObjectIdMongodb } = require('../utils');
const { findAllProducts } = require('../models/repositories/product.repo');
const { findAllDiscountCodesUnselect, } = require('../models/repositories/discount.repo');
/**
 * Discount Service
 * 1- Generator Discount Code [Shop | Admin]
 * 2- get Discount amount [User]
 * 3- Get all discount codes [User | Shop]
 * 4- Verify discount code [user]
 * 5- Delete discount Code [Admin | Shop]
 * 6- Cancel discount code [users]
 */
const DISCOUNT_TYPE = {
    ALL: 'all',
    SPECIFIC: 'specific',
};
class DiscountService {
    static createDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount_code, discount_start_date, discount_end_date, discount_is_active, discount_shopId, discount_min_order_value, discount_product_ids, discount_applies_to, discount_name, discount_description, discount_type, discount_value, discount_max_uses, discount_uses_count, discount_users_used, discount_max_value_while_percent, discount_max_users_per_user, } = payload;
            if (new Date() < new Date(discount_start_date) ||
                new Date() > new Date(discount_end_date)) {
                throw new BadRequestError('Discount code has expired');
            }
            if (new Date(discount_end_date) <= new Date(discount_start_date)) {
                return BadRequestError('Start Date must be before end date');
            }
            // create index for discount code
            const foundDiscount = yield this.findDiscountCode({
                discount_code,
                discount_shopId,
            });
            if (foundDiscount && (foundDiscount === null || foundDiscount === void 0 ? void 0 : foundDiscount.discount_is_active)) {
                throw new BadRequestError('Discount existed and active!');
            }
            const newDiscount = yield discountModel.create({
                discount_code,
                discount_start_date: new Date(discount_start_date),
                discount_end_date: new Date(discount_end_date),
                discount_is_active,
                discount_shopId,
                discount_min_order_value: discount_min_order_value || 0,
                discount_product_ids: discount_applies_to === 'all' ? [] : discount_product_ids,
                discount_applies_to,
                discount_name,
                discount_description,
                discount_type,
                discount_value,
                discount_max_uses,
                discount_uses_count,
                discount_users_used,
                discount_max_value_while_percent,
                discount_max_users_per_user,
            });
            return newDiscount;
        });
    }
    static findDiscountCode({ discount_code, discount_shopId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield discountModel
                .findOne({
                discount_code,
                discount_shopId: convertToObjectIdMongodb(discount_shopId),
            })
                .lean();
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
    static getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // create index for discount_code.
            const foundDiscount = yield this.findDiscountCode({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            });
            if (!foundDiscount || foundDiscount.discount_is_active) {
                throw new NotFoundError('discount not exists!');
            }
            const { discount_applies_to, discount_product_ids } = foundDiscount;
            if (discount_applies_to === DISCOUNT_TYPE.ALL) {
                // get all product
                const products = yield findAllProducts({
                    filter: {
                        product_shop: convertToObjectIdMongodb(shopId),
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
            }
            if (discount_applies_to === DISCOUNT_TYPE.SPECIFIC) {
                // get the product ids
                const products = yield findAllProducts({
                    filter: {
                        _id: { $in: discount_product_ids },
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
            }
        });
    }
    // Get all discount code of shop
    static getAllDiscountCodesByShop({ limit, page, shopId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const discounts = yield findAllDiscountCodesUnselect({
                limit,
                page,
                filter: {
                    discount_shopId: convertToObjectIdMongodb(shopId),
                    discount_is_active: true,
                },
                unselect: ['__v', 'discount_shopId'],
                model: discountModel,
            });
            return discounts;
        });
    }
}
