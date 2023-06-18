'use strict';

const {
    productModel,
    electronicModel,
    clothingModel,
    furnitureModel,
} = require('../../models/product.model');
const { Types } = require('mongoose');

// QUERY
const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await productModel
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

const queryProducts = async ({ query, limit, skip }) => {
    return await productModel
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch, 'i');
    const result = await productModel.find({
        isDraft: false,
        $text: { $search: regexSearch }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return result;
}

// PUT

const publishProductByShop = async ({ product_shop, product_id }) => {
    console.log({ product_shop, product_id })
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    console.log('modifiedCount:::', modifiedCount);
    return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const modifiedCount = await foundShop.updateOne(foundShop);
    return modifiedCount;
};

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    unpublishProductByShop,
    queryProducts,
    searchProductByUser
};
