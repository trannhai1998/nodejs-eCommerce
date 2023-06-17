'use strict';

const {
    clothingModel,
    productModel,
    electronicModel,
} = require('../models/product.model');

const { BadRequestError } = require('../core/error.response')

// Define Factory class to create product
class ProductFactory {
    /*
     type: 'Clothing'
    */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing': {
                return new Clothing(payload)
            }
            case 'Electronics': {
                return new Electronic(payload)
            }

            default: throw new BadRequestError('Invalid Product Types:::', type);
        }
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
    async createProduct() {
        return await productModel.create(this)
    }
}

// Define sub-class for different product types CLOTHING

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create(this.product_attributes);
        if (!newClothing) {
            throw new BadRequestError('Create new Clothing error');
        }

        const newProduct = await super.createProduct();
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create(this.product_attributes);
        if (!newElectronic) {
            throw new BadRequestError('Create new Clothing error');
        }

        const newProduct = await super.createProduct();
        return newProduct;
    }
}
module.exports = ProductFactory;
