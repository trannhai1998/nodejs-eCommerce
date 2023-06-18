'use strict';

const {
	productModel,
	electronicModel,
	clothingModel,
	furnitureModel,
} = require('../../models/product.model');
const { Types } = require('mongoose');

const { getSelectData, unGetSelectData } = require('../../utils/index');

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
	const result = await productModel
		.find(
			{
				isDraft: false,
				$text: { $search: regexSearch },
			},
			{
				score: { $meta: 'textScore' },
			},
		)
		.sort({ score: { $meta: 'textScore' } })
		.lean();

	return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const products = await productModel
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();

	return products;
};

const findProduct = async ({ product_id, unSelect }) => {
	return await productModel
		.findById(product_id)
		.select(unGetSelectData(unSelect));
};

// PUT

const publishProductByShop = async ({ product_shop, product_id }) => {
	console.log({ product_shop, product_id });
	const foundShop = await productModel.findOne({
		product_shop: new Types.ObjectId(product_shop),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundShop) return null;

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

	if (!foundShop) return null;

	foundShop.isDraft = true;
	foundShop.isPublished = false;

	const modifiedCount = await foundShop.updateOne(foundShop);
	return modifiedCount;
};

// PATCH
const updateProductById = async (
	productId,
	bodyUpdate,
	model,
	isNew = true,
) => {
	return await model.findByIdAndUpdate(productId, bodyUpdate, {
		new: isNew,
	});
};

module.exports = {
	publishProductByShop,
	unpublishProductByShop,
	// QUERY
	findAllDraftForShop,
	queryProducts,
	searchProductByUser,
	findAllProducts,
	findProduct,
	// PATCH
	updateProductById,
};
