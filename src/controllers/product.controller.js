'use strict';
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.advance.service');

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
	createProduct = async (req, res, next) => {
		console.log(req?.user);
		new SuccessResponse({
			message: 'Create new product successfully!',
			metadata: await ProductServiceV2.createProduct(
				req.body?.product_type,
				{
					...req.body,
					product_shop: req.user.userId,
				},
			),
		}).send(res);
	};

	// QUERY
	getAllDraftsForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list Draft Success',
			metadata: await ProductServiceV2.findAllDraftForShop({
				product_shop: req.user.userId,
			}),
		}).send(res);
	};

	getAllPublishesForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list Publishes Product Success',
			metadata: await ProductServiceV2.findAllPublishForShop({
				product_shop: req.user.userId,
			}),
		}).send(res);
	};

	getListSearchProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list Search Product Success',
			metadata: await ProductServiceV2.searchProducts(req?.params),
		}).send(res);
	};

	findAllProducts = async (req, res, next) => {
		console.log('Params::: ', req?.query);
		new SuccessResponse({
			message: 'Find list All Product Success',
			metadata: await ProductServiceV2.findAllProducts(req?.query),
		}).send(res);
	};

	findProduct = async (req, res, next) => {
		console.log('Params:::', req?.params);
		new SuccessResponse({
			message: 'Find One Product Success',
			metadata: await ProductServiceV2.findProduct(req?.params),
		}).send(res);
	};

	// PUT
	publishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Publish Product Success',
			metadata: await ProductServiceV2.publishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			}),
		}).send(res);
	};

	unpublishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Unpublish Product Success',
			metadata: await ProductServiceV2.unpublishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			}),
		}).send(res);
	};

	// PATCH
	updateProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update Product Success',
			metadata: await ProductServiceV2.updateProduct(
				req?.body?.product_type,
				req?.params?.productId,
				{
					...req?.body,
					product_shop: req?.user?.userId,
				},
			),
		}).send(res);
	};
}

module.exports = new AccessController();
