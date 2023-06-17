'use strict'
const mongoose = require('mongoose');
const { model, Schema } = mongoose // Erase if already required

const DOCUMENT_PRODUCT_NAME = 'Product'
const COLLECTION_PRODUCT_NAME = 'Products'

// Declare the Schema of the Mongo model
const ProductSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: String, // {type: Schema.Types.ObjectId, ref: 'User'},
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_PRODUCT_NAME
});

// Define the product type = "Clothing"
const DOCUMENT_CLOTHING_NAME = 'Clothing'
const COLLECTION_CLOTHING_NAME = 'Clothes'
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,

}, {
    collection: COLLECTION_CLOTHING_NAME,
    timestamps: true,
})

// Define the product type = "Electronics"
const DOCUMENT_ELECTRONIC_NAME = 'Electronic'
const COLLECTION_ELECTRONIC_NAME = 'Electronics'
const electronicSchema = new Schema({
    manufacture: { type: String, require: true },
    model: String,
    color: String,

}, {
    collection: COLLECTION_ELECTRONIC_NAME,
    timestamps: true,
})

//Export the model
module.exports = {
    productModel: mongoose.model(DOCUMENT_PRODUCT_NAME, ProductSchema),
    clothingModel: mongoose.model(DOCUMENT_CLOTHING_NAME, clothingSchema),
    electronicModel: mongoose.model(DOCUMENT_ELECTRONIC_NAME, electronicSchema),
}