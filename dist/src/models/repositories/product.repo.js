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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProductByServer = exports.getProductById = exports.updateProductById = exports.findProduct = exports.findAllProducts = exports.searchProductByUser = exports.queryProducts = exports.findAllDraftForShop = exports.unpublishProductByShop = exports.publishProductByShop = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product.model");
const index_1 = require("../../utils/index");
const findAllDraftForShop = ({ query, limit, skip }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield product_model_1.productModel
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
});
exports.findAllDraftForShop = findAllDraftForShop;
const queryProducts = ({ query, limit, skip }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield product_model_1.productModel
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
});
exports.queryProducts = queryProducts;
const searchProductByUser = ({ keySearch }) => __awaiter(void 0, void 0, void 0, function* () {
    // const regexSearch = new RegExp(keySearch, 'i');
    const result = yield product_model_1.productModel
        .find({
        isDraft: false,
        $text: { $search: keySearch },
    }, {
        score: { $meta: 'textScore' },
    })
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    return result;
});
exports.searchProductByUser = searchProductByUser;
const findAllProducts = ({ limit, sort, page, filter, select }) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const products = yield product_model_1.productModel
        .find(filter)
        .sort(sort === 'ctime' ? { _id: -1 } : { _id: 1 })
        .skip(skip)
        .limit(limit)
        .select((0, index_1.getSelectData)(select))
        .lean();
    return products;
});
exports.findAllProducts = findAllProducts;
const findProduct = ({ product_id, unSelect }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield product_model_1.productModel
        .findById(product_id)
        .select((0, index_1.unGetSelectData)(unSelect));
});
exports.findProduct = findProduct;
const publishProductByShop = ({ product_shop, product_id }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ product_shop, product_id });
    const foundShop = yield product_model_1.productModel.findOne({
        product_shop: new mongoose_1.Types.ObjectId(product_shop),
        _id: new mongoose_1.Types.ObjectId(product_id),
    });
    if (!foundShop)
        return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = yield foundShop.updateOne(foundShop);
    console.log('modifiedCount:::', modifiedCount);
    return modifiedCount;
});
exports.publishProductByShop = publishProductByShop;
const unpublishProductByShop = ({ product_shop, product_id }) => __awaiter(void 0, void 0, void 0, function* () {
    const foundShop = yield product_model_1.productModel.findOne({
        product_shop: new mongoose_1.Types.ObjectId(product_shop),
        _id: new mongoose_1.Types.ObjectId(product_id),
    });
    if (!foundShop)
        return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const modifiedCount = yield foundShop.updateOne(foundShop);
    return modifiedCount;
});
exports.unpublishProductByShop = unpublishProductByShop;
const updateProductById = (productId, bodyUpdate, model, isNew = true) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew,
    });
});
exports.updateProductById = updateProductById;
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return product_model_1.productModel
        .findOne({ _id: (0, index_1.convertToObjectIdMongodb)(productId) })
        .lean();
});
exports.getProductById = getProductById;
const checkProductByServer = (products) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const foundProduct = yield getProductById(product.productId);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct._id,
            };
        }
    })));
});
exports.checkProductByServer = checkProductByServer;
