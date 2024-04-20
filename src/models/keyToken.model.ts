import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new mongoose.Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Shop',
		},
		publicKey: {
			type: String,
			required: true,
		},
		privateKey: {
			type: String,
			required: true,
		},
		refreshTokenUsed: {
			type: [String],
			default: [],
		},
		refreshToken: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const KeyToken = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
export default KeyToken;
