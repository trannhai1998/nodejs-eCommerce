import mongoose, { Document, Schema, Model } from 'mongoose';

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			maxLength: 150,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive',
		},
		verify: {
			type: Boolean,
			default: false,
		},
		roles: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const Shop = mongoose.model(DOCUMENT_NAME, shopSchema);
export default Shop;
