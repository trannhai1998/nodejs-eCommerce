import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new mongoose.Schema(
	{
		inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
		inventory_location: { type: String, default: 'unknown' },
		inventory_stock: { type: Number, required: true },
		inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
		inventory_reservations: { type: Array, default: [] },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const Inventory = mongoose.model(DOCUMENT_NAME, inventorySchema);
export default Inventory;
