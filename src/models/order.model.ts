import mongoose, { Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

export enum ORDER_STATUS {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	SHIPPED = 'shipped',
	CANCELLED = 'cancelled',
	DELIVERED = 'delivered',
}

const orderSchema = new mongoose.Schema(
	{
		order_userId: { type: Types.ObjectId, required: true },
		order_checkout: { type: Object, default: {} },
		/*
            order_checkout = {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
        */
		order_shipping: { type: Object, default: {} },
		/*
            street,
            city,
            state,
            country
        */
		order_payment: { type: Object, default: {} },
		order_products: { type: Array, require: true },
		order_trackingNumber: { type: String, default: '#0000125112023' },
		order_status: {
			type: String,
			enum: ORDER_STATUS,
			default: ORDER_STATUS.PENDING,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const OrderModel = mongoose.model(DOCUMENT_NAME, orderSchema);
export default OrderModel;
