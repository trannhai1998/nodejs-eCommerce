import { clothingModel, productModel, electronicModel } from '../models/product.model';
import { BadRequestError } from '../core/error.response';

// Define Factory class to create product
class ProductFactory {
    static async createProduct(type: string, payload: any) {
        switch (type) {
            case 'Clothing': {
                return new Clothing(payload).createProduct();
            }
            case 'Electronics': {
                return new Electronic(payload).createProduct();
            }
            default: throw new BadRequestError(`Invalid Product Types:::, ${type}`);
        }
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

    // create new product
    async createProduct(product_id: string) {
        return await productModel.create({ ...this, product_id });
    }
}

// Define sub-class for different product types CLOTHING
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) {
            throw new BadRequestError('Create new Clothing error');
        }

        const newProduct = await super.createProduct(this.product_shop);
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) {
            throw new BadRequestError('Create new Clothing error');
        }

        const newProduct = await super.createProduct(this.product_shop);
        return newProduct;
    }
}

export default ProductFactory;