'use strict';

const {
	clothingModel,
	productModel,
	electronicModel,
	furnitureModel,
} = require('../models/product.model');

const { BadRequestError } = require('../core/error.response');
const {
	findAllProducts,
	publishProductByShop,
	queryProducts,
	unpublishProductByShop,
	searchProductByUser,
	findProduct,
	updateProductById,
} = require('../models/repositories/product.repo');

const {
	removeUndefinedObject,
	updateNestedObjectParse,
} = require('../utils/index');

const { insertInventory } = require('../models/repositories/inventory.repo');

// Define Factory class to create product
class ProductFactory {
	/*
     type: 'Clothing'
     payload
    */

	static productRegistry = {}; // key-class

	static registerProductType(type, classRef) {
		ProductFactory.productRegistry[type] = classRef;
	}

	static async createProduct(type, payload) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) {
			throw new BadRequestError('Invalid Product Types:::', type);
		}

		return new productClass(payload).createProduct();

		// switch (type) {
		//     case 'Clothing': {
		//         return new Clothing(payload).createProduct()
		//     }
		//     case 'Electronics': {
		//         return new Electronic(payload).createProduct()
		//     }

		//     default: throw new BadRequestError('Invalid Product Types:::', type);
		// }
	}

	// PATCH
	static async updateProduct(type, productId, payload) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) {
			throw new BadRequestError('Invalid Product Types:::', type);
		}

		return new productClass(payload).updateProduct(productId, payload);
	}

	// QUERY
	static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isDraft: true };

		return await queryProducts({ query, limit, skip });
	}

	static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isPublished: true };

		return await queryProducts({ query, limit, skip });
	}

	static async searchProducts({ keySearch }) {
		return await searchProductByUser({ keySearch });
	}

	static async findAllProducts({
		limit = 50,
		sort = 'ctime',
		page = 1,
		filter = { isPublished: true },
	}) {
		const select = ['product_name', 'product_price', 'product_thumb'];
		return findAllProducts({ limit, sort, page, filter, select });
	}

	static async findProduct({ product_id }) {
		return findProduct({ product_id, unSelect: ['_v'] });
	}

	// PUT
	static async publishProductByShop({ product_shop, product_id }) {
		return await publishProductByShop({ product_shop, product_id });
	}

	static async unpublishProductByShop({ product_shop, product_id }) {
		return await unpublishProductByShop({ product_shop, product_id });
	}
}

// Define base product class
class Product {
	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_type,
		product_shop,
		product_attributes,
	}) {
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
	async createProduct(product_id) {
		const newProduct = await productModel.create({ ...this, product_id });

		if (newProduct) {
			// Add product_stock in inventory collection
			await insertInventory({
				productId: newProduct?._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			});
		}

        return newProduct;
	}

	// Update Product
	async updateProduct(productId, bodyUpdate) {
		return await updateProductById(productId, bodyUpdate, productModel);
	}
}

// Define sub-class for different product types CLOTHING

class Clothing extends Product {
	async createProduct() {
		const newClothing = await clothingModel.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newClothing) {
			throw new BadRequestError('Create new Clothing error');
		}

		const newProduct = await super.createProduct(this.product_shop);
		return newProduct;
	}

	async updateProduct(productId) {
		/**
		 * {
		 *    a: undefined
		 *    b: null
		 *  ==> need remove this first.
		 * }
		 */
		// 1. remove attr has null undefined
		const updateNested = updateNestedObjectParse(this);
		const objectParams = removeUndefinedObject(updateNested);
		// 2. check where to update
		if (objectParams.product_attributes) {
			// update Child
			await updateProductById(productId, objectParams, clothingModel);
		}

		const updateProduct = await super.updateProduct(
			productId,
			objectParams,
		);

		return updateProduct;
	}
}

class Electronics extends Product {
	async createProduct() {
		const newElectronic = await electronicModel.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newElectronic) {
			throw new BadRequestError('Create new Electronic error');
		}

		const newProduct = await super.createProduct(this.product_shop);
		return newProduct;
	}
}

class Furniture extends Product {
	async createProduct() {
		const newElectronic = await furnitureModel.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newElectronic) {
			throw new BadRequestError('Create new Furniture error');
		}

		const newProduct = await super.createProduct(this.product_shop);
		return newProduct;
	}
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
