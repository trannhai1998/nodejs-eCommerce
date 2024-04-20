import {
	clothingModel,
	productModel,
	electronicModel,
	furnitureModel,
} from '../models/product.model';

import { BadRequestError } from '../core/error.response';
import {
	findAllProducts,
	publishProductByShop,
	queryProducts,
	unpublishProductByShop,
	searchProductByUser,
	findProduct,
	updateProductById,
} from '../models/repositories/product.repo';

import { removeUndefinedObject, updateNestedObjectParse } from '../utils/index';

import { insertInventory } from '../models/repositories/inventory.repo';

// Define Factory class to create product
class ProductFactory {
	static productRegistry: { [key: string]: any } = {}; // key-class

	static registerProductType(type: string, classRef: any) {
		ProductFactory.productRegistry[type] = classRef;
	}

	static async createProduct(type: string, payload: any) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) {
			throw new BadRequestError(`Invalid Product Types::: ${type}`);
		}

		return new productClass(payload).createProduct();
	}

	static async updateProduct(type: string, productId: string, payload: any) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) {
			throw new BadRequestError(`Invalid Product Types::: ${type}`);
		}

		return new productClass(payload).updateProduct(productId, payload);
	}

	static async findAllDraftForShop({
		product_shop,
		limit = 50,
		skip = 0,
	}: {
		product_shop: string;
		limit?: number;
		skip?: number;
	}) {
		const query = { product_shop, isDraft: true };

		return await queryProducts({ query, limit, skip });
	}

	static async findAllPublishForShop({
		product_shop,
		limit = 50,
		skip = 0,
	}: {
		product_shop: string;
		limit?: number;
		skip?: number;
	}) {
		const query = { product_shop, isPublished: true };

		return await queryProducts({ query, limit, skip });
	}

	static async searchProducts({ keySearch }: { keySearch: string }) {
		return await searchProductByUser({ keySearch });
	}

	static async findAllProducts({
		limit = 50,
		sort = 'ctime',
		page = 1,
		filter = { isPublished: true },
	}: {
		limit?: number;
		sort?: string;
		page?: number;
		filter?: { [key: string]: any };
	}) {
		const select = ['product_name', 'product_price', 'product_thumb', 'product_shop'];
		return findAllProducts({ limit, sort, page, filter, select });
	}

	static async findProduct({ product_id }: { product_id: string }) {
		return findProduct({ product_id, unSelect: ['_v'] });
	}

	static async publishProductByShop({
		product_shop,
		product_id,
	}: {
		product_shop: string;
		product_id: string;
	}) {
		return await publishProductByShop({ product_shop, product_id });
	}

	static async unpublishProductByShop({
		product_shop,
		product_id,
	}: {
		product_shop: string;
		product_id: string;
	}) {
		return await unpublishProductByShop({ product_shop, product_id });
	}
}

// Define base product class
class Product {
	product_name: string;
	product_thumb: string;
	product_description: string;
	product_price: number;
	product_quantity: number;
	product_type: string;
	product_shop: string;
	product_attributes: any;

	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_type,
		product_shop,
		product_attributes,
	}: {
		product_name: string;
		product_thumb: string;
		product_description: string;
		product_price: number;
		product_quantity: number;
		product_type: string;
		product_shop: string;
		product_attributes: any;
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

	async createProduct(product_id: string) {
		const newProduct = await productModel.create({
			...this,
			product_id,
		});

		if (newProduct) {
			await insertInventory({
				productId: newProduct?._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			});
		}

		return newProduct;
	}

	async updateProduct(productId: string, bodyUpdate: any) {
		return await updateProductById(productId, bodyUpdate, productModel);
	}
}

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

	async updateProduct(productId: string) {
		const updateNested = updateNestedObjectParse(this);
		const objectParams = removeUndefinedObject(updateNested);

		if (objectParams['product_attributes']) {
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

ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

export default ProductFactory;
