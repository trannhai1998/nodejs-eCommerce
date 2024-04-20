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
const product_repo_1 = require("../models/repositories/product.repo");
const index_1 = require("../utils/index");
const inventory_repo_1 = require("../models/repositories/inventory.repo");
// Define Factory class to create product
class ProductFactory {
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass) {
                throw new error_response_1.BadRequestError(`Invalid Product Types::: ${type}`);
            }
            return new productClass(payload).createProduct();
        });
    }
    static updateProduct(type, productId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass) {
                throw new error_response_1.BadRequestError(`Invalid Product Types::: ${type}`);
            }
            return new productClass(payload).updateProduct(productId, payload);
        });
    }
    static findAllDraftForShop({ product_shop, limit = 50, skip = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { product_shop, isDraft: true };
            return yield (0, product_repo_1.queryProducts)({ query, limit, skip });
        });
    }
    static findAllPublishForShop({ product_shop, limit = 50, skip = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { product_shop, isPublished: true };
            return yield (0, product_repo_1.queryProducts)({ query, limit, skip });
        });
    }
    static searchProducts({ keySearch }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.searchProductByUser)({ keySearch });
        });
    }
    static findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const select = ['product_name', 'product_price', 'product_thumb', 'product_shop'];
            return (0, product_repo_1.findAllProducts)({ limit, sort, page, filter, select });
        });
    }
    static findProduct({ product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, product_repo_1.findProduct)({ product_id, unSelect: ['_v'] });
        });
    }
    static publishProductByShop({ product_shop, product_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.publishProductByShop)({ product_shop, product_id });
        });
    }
    static unpublishProductByShop({ product_shop, product_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.unpublishProductByShop)({ product_shop, product_id });
        });
    }
}
ProductFactory.productRegistry = {}; // key-class
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
    createProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield product_model_1.productModel.create(Object.assign(Object.assign({}, this), { product_id }));
            if (newProduct) {
                yield (0, inventory_repo_1.insertInventory)({
                    productId: newProduct === null || newProduct === void 0 ? void 0 : newProduct._id,
                    shopId: this.product_shop,
                    stock: this.product_quantity,
                });
            }
            return newProduct;
        });
    }
    updateProduct(productId, bodyUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.updateProductById)(productId, bodyUpdate, product_model_1.productModel);
        });
    }
}
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
    updateProduct(productId) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const updateNested = (0, index_1.updateNestedObjectParse)(this);
            const objectParams = (0, index_1.removeUndefinedObject)(updateNested);
            if (objectParams['product_attributes']) {
                yield (0, product_repo_1.updateProductById)(productId, objectParams, product_model_1.clothingModel);
            }
            const updateProduct = yield _super.updateProduct.call(this, productId, objectParams);
            return updateProduct;
        });
    }
}
class Electronics extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.electronicModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newElectronic) {
                throw new error_response_1.BadRequestError('Create new Electronic error');
            }
            const newProduct = yield _super.createProduct.call(this, this.product_shop);
            return newProduct;
        });
    }
}
class Furniture extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.furnitureModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newElectronic) {
                throw new error_response_1.BadRequestError('Create new Furniture error');
            }
            const newProduct = yield _super.createProduct.call(this, this.product_shop);
            return newProduct;
        });
    }
}
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);
exports.default = ProductFactory;
