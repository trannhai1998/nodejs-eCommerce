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
const error_response_1 = require("../core/error.response");
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_repo_1 = require("../models/repositories/cart.repo");
const product_repo_1 = require("../models/repositories/product.repo");
const discount_service_1 = __importDefault(require("./discount.service"));
const redis_service_1 = require("./redis.service");
class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: {
                        price,
                        quantity,
                        productId
                    }
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            "shopId":
                            "discountId",nvb m
                            "codeId":
                        }
                    ],
                    item_products: {
                        price,
                        quantity,
                        productId
                    }
                }
            ]
        }
    */
    static checkoutReview({ cartId, userId, shop_order_ids }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check cartId exist
            const foundCart = yield (0, cart_repo_1.findCartById)(cartId);
            if (!foundCart) {
                throw new error_response_1.NotFoundError('Cart not existed!');
            }
            const checkout_order = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0,
            };
            const shop_order_ids_new = [];
            // Calculate total bill
            for (let i = 0; i < (shop_order_ids === null || shop_order_ids === void 0 ? void 0 : shop_order_ids.length); i++) {
                const { shopId, shop_discounts = [], item_products = [], } = shop_order_ids[i];
                // Check product available
                const checkProductServer = yield (0, product_repo_1.checkProductByServer)(item_products);
                if (!checkProductServer[0]) {
                    throw new error_response_1.BadRequestError('order wrong!!!');
                }
                // Total Checkout
                const checkoutPrice = checkProductServer.reduce((acc, product) => {
                    return acc + product.quantity * product.price;
                }, 0);
                // Total Checkout Before Confirm
                checkout_order.totalPrice = checkoutPrice;
                const itemCheckout = {
                    shopId,
                    shop_discounts,
                    priceRaw: checkoutPrice,
                    priceApplyDiscount: checkoutPrice,
                    item_products: checkProductServer,
                };
                // if shop_discounts existed and > 0, Check it can apply
                if ((shop_discounts === null || shop_discounts === void 0 ? void 0 : shop_discounts.length) > 0) {
                    console.log(shop_discounts);
                    // If only have 1 discount
                    // get amount discount
                    const { discount = 0, totalOrder, totalPrice = 0, } = yield discount_service_1.default.getDiscountAmount({
                        codeId: shop_discounts[0].codeId,
                        userId,
                        shopId,
                        products: checkProductServer,
                    });
                    checkout_order.totalDiscount += discount;
                    if (discount > 0) {
                        itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                    }
                }
                // Total Discount
                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
                shop_order_ids_new.push(itemCheckout);
            }
            return {
                shop_order_ids,
                shop_order_ids_new,
                checkout_order,
            };
        });
    }
    static orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { shop_order_ids_new, checkout_order } = yield CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids,
            });
            // Continue check if out stocking
            // get new array Products
            const products = shop_order_ids_new.flatMap((order) => order === null || order === void 0 ? void 0 : order.item_products);
            console.log('Products:::', products);
            const acquireProduct = [];
            for (let i = 0; i < (products === null || products === void 0 ? void 0 : products.length); i++) {
                const { productId, quantity } = products[i];
                const keyLock = yield (0, redis_service_1.acquireLock)(productId, quantity, cartId);
                acquireProduct.push(keyLock ? true : false);
                if (keyLock) {
                    yield (0, redis_service_1.releaseLock)(keyLock);
                }
                // Check if 1 product out of stock.
                if (acquireProduct.some(e => !e)) {
                    throw new error_response_1.BadRequestError('Some Product updated, please go back and confirm your order again!');
                }
                const newOrder = yield order_model_1.default.create({
                    order_userId: userId,
                    order_checkout: checkout_order,
                    order_shipping: user_address,
                    order_payment: user_payment,
                    order_products: shop_order_ids_new
                });
                // Case 1: If insert successfully => remove product in this cart.
                if (newOrder) {
                    // Remove product in this cart.
                }
                return newOrder;
            }
        });
    }
}
exports.default = CheckoutService;
