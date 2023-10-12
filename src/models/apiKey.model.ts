import mongoose from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const keyTokenSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			required: true,
			enum: ['0000', '1111', '2222'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: '30d',
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);
