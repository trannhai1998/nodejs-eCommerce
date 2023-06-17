'use strict';

const {
    clothingModel,
    productModel,
    electronicModel,
    furnitureModel
} = require('../models/product.model');

const { BadRequestError } = require('../core/error.response')

// Define Factory class to create product
class ProductFactory {
    /*
     type: 'Clothing'
     payload
    */

    static productRegistry = {} // key-class

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
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(product_id) {
        return await productModel.create({ ...this, product_id })
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
            product_shop: this.product_shop
        });
        if (!newElectronic) {
            throw new BadRequestError('Create new Furniture error');
        }

        const newProduct = await super.createProduct(this.product_shop);
        return newProduct;
    }
}

// register product types
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
