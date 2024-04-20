import mongoose, { Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
export enum CART_STATE {
	ACTIVE = 'active',
	COMPLETED = 'completed',
	FAILED = 'failed',
	PENDING = 'pending',
}

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
	{
		cart_state: {
			type: String,
			enum: [
				CART_STATE.ACTIVE,
				CART_STATE.COMPLETED,
				CART_STATE.FAILED,
				CART_STATE.PENDING,
			],
			default: CART_STATE.ACTIVE,
		},
		cart_products: { type: Array, required: true, default: [] },
		/**
		 * productId,
		 * shopId,
		 * quantity,
		 * name
		 * price
		 */
		cart_count_product: { type: Number, default: 0 },
		cart_userId: { type: Types.ObjectId, required: true },
	},
	{
		collection: COLLECTION_NAME,
		timestamps: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
	},
);

//Export the model
const CartModel = mongoose.model(DOCUMENT_NAME, cartSchema);
export default CartModel;
