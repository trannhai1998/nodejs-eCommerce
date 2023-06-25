'use strict';
const mongoose = require('mongoose');
const { model, Schema } = mongoose; // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
	{
		inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
		inventory_location: { type: String, default: 'unknown' },
		inventory_stock: { type: Number, required: true },
		inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
		inventory_reservations: { type: Array, default: [] },
		/**
		 * cardId: ,
		 * stock: 1,
		 * createdOn:
		 */
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
