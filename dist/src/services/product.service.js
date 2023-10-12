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
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("../models/product.model");
const error_response_1 = require("../core/error.response");
// Define Factory class to create product
class ProductFactory {
    static createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case 'Clothing': {
                    return new Clothing(payload).createProduct();
                }
                case 'Electronics': {
                    return new Electronic(payload).createProduct();
                }
                default: throw new error_response_1.BadRequestError(`Invalid Product Types:::, ${type}`);
            }
        });
    }
}
// Define base product class
class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes, }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    // create new product
    createProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.productModel.create(Object.assign(Object.assign({}, this), { product_id }));
        });
    }
}
// Define sub-class for different product types CLOTHING
class Clothing extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newClothing = yield product_model_1.clothingModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newClothing) {
                throw new error_response_1.BadRequestError('Create new Clothing error');
            }
            const newProduct = yield _super.createProduct.call(this, this.product_shop);
            return newProduct;
        });
    }
}
class Electronic extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.electronicModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newElectronic) {
                throw new error_response_1.BadRequestError('Create new Clothing error');
            }
            const newProduct = yield _super.createProduct.call(this, this.product_shop);
            return newProduct;
        });
    }
}
exports.default = ProductFactory;
