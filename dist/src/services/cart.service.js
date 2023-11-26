"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_model_1 = __importStar(require("../models/cart.model"));
const error_response_1 = require("../core/error.response");
const product_repo_1 = require("../models/repositories/product.repo");
const utils_1 = require("../utils");
class CartService {
    // Repo
    // Create Cart
    static createUserCart({ userId, product }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { cart_userId: userId, cart_state: cart_model_1.CART_STATE.ACTIVE };
            const updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                },
            };
            const options = { upsert: true, new: true };
            return yield cart_model_1.default.findOneAndUpdate(query, updateOrInsert, options);
        });
    }
    // Reduce product quantity by one (user)
    static updateUserCartQuantity({ userId, product }) {
        return __awaiter(this, void 0, void 0, function* () {
            // const query = { cart_userId: userId, cart_state: CART_STATE.ACTIVE };
            // const updateOrInsert = {
            // 	$addToSet: {
            // 		cart_products: product,
            // 	},
            // };
            // const options = { upsert: true, new: true };
            const { productId, quantity } = product;
            const existProductId = yield cart_model_1.default.findOneAndUpdate({
                cart_userId: (0, utils_1.convertToObjectIdMongodb)(userId),
                'cart_products.productId': productId,
                cart_state: cart_model_1.CART_STATE.ACTIVE,
            }, {
                $inc: {
                    'cart_products.$.quantity': quantity,
                },
            }, {
                upsert: true,
                new: true,
            });
            if (!existProductId) {
                const newUpdateCart = yield cart_model_1.default.findOneAndUpdate({
                    cart_userId: (0, utils_1.convertToObjectIdMongodb)(userId),
                    cart_state: cart_model_1.CART_STATE.ACTIVE,
                }, {
                    $addToSet: {
                        cart_products: product,
                    },
                }, { upsert: true, new: true });
                return newUpdateCart;
            }
            return existProductId;
        });
    }
    // End Repo
    /// Add Product to cart (user)
    static addToCart({ userId, product = {} }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Check cart existed
            const userCart = yield cart_model_1.default.findOne({
                cart_userId: (0, utils_1.convertToObjectIdMongodb)(userId),
            });
            if (!userCart) {
                // Create cart for User
                return yield CartService.createUserCart({ userId, product });
            }
            // If cart existed but don't have any products
            if (!((_a = userCart.cart_products) === null || _a === void 0 ? void 0 : _a.length)) {
                userCart.cart_products = [product];
                return yield userCart.save();
            }
            // If cart existed and have duplicate product
            return yield CartService.updateUserCartQuantity({ userId, product });
        });
    }
    // Update Cart
    /*
        Shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
    // Increase product quantity by One (user)
    static addToCartV2({ userId, shop_order_ids }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity, old_quantity } = (_a = shop_order_ids[0]) === null || _a === void 0 ? void 0 : _a.item_products[0];
            // Check product
            const foundProduct = yield (0, product_repo_1.getProductById)(productId);
            if (!foundProduct)
                throw new error_response_1.NotFoundError('Product not existed!');
            // compare
            if (((_b = foundProduct.product_shop) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_c = shop_order_ids[0]) === null || _c === void 0 ? void 0 : _c.shopId)) {
                throw new error_response_1.NotFoundError('Product do not belong to the shop');
            }
            if (quantity === 0) {
                // Delete Cart
            }
            return yield this.updateUserCartQuantity({
                userId,
                product: {
                    productId,
                    quantity: quantity - old_quantity,
                },
            });
        });
    }
    // Delete cart (user)
    static deleteUserCart({ userId, productId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_model_1.default.updateOne({
                cart_userId: (0, utils_1.convertToObjectIdMongodb)(userId),
                cart_state: cart_model_1.CART_STATE.ACTIVE,
            }, {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            });
        });
    }
    static getListUserCart({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_model_1.default.findOne({
                cart_userId: (0, utils_1.convertToObjectIdMongodb)(userId),
            }).lean();
        });
    }
}
exports.default = CartService;
