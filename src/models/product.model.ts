import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_PRODUCT_NAME = 'Product';
const COLLECTION_PRODUCT_NAME = 'Products';

// Declare the Schema of the Mongo model
const ProductSchema = new mongoose.Schema(
	{
		product_name: { type: String, required: true },
		product_thumb: { type: String, required: true },
		product_description: String,
		product_slug: String,
		product_price: { type: Number, required: true },
		product_quantity: { type: Number, required: true },
		product_type: {
			type: String,
			required: true,
			enum: ['Electronics', 'Clothing', 'Furniture'],
		},
		product_shop: String,
		product_attributes: { type: Schema.Types.Mixed, required: true },
		product_ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be lower 5'],
			set: (val: number) => Math.round(val * 10) / 10,
		},
		product_variations: { type: Array, default: [] },
		isDraft: {
			type: Boolean,
			default: true,
			index: true,
			select: false,
		},
		isPublished: {
			type: Boolean,
			default: false,
			index: true,
			select: false,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_PRODUCT_NAME,
	},
);

// create index for search
ProductSchema.index({
	product_name: 'text',
	product_description: 'text',
});

// Document middleware: runs before .save() and .create()...
ProductSchema.pre('save', function (next?) {
	this.product_slug = slugify(this.product_name, { lower: true });
	next();
});

// Define the product type = "Clothing"
const DOCUMENT_CLOTHING_NAME = 'Clothing';
const COLLECTION_CLOTHING_NAME = 'Clothes';

const clothingSchema = new Schema(
	{
		brand: { type: String, require: true },
		size: String,
		material: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
	},
	{
		collection: COLLECTION_CLOTHING_NAME,
		timestamps: true,
	},
);

// Define the product type = "Electronics"
const DOCUMENT_ELECTRONIC_NAME: string = 'Electronic';
const COLLECTION_ELECTRONIC_NAME: string = 'Electronics';

interface ElectronicAttributes {
	manufacture: string;
	model?: string;
	color?: string;
	product_shop?: string;
}

interface ElectronicDocument extends Document, ElectronicAttributes {
	createdAt: Date;
	updatedAt: Date;
}

const electronicSchema = new Schema(
	{
		manufacture: { type: String, require: true },
		model: String,
		color: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
	},
	{
		collection: COLLECTION_ELECTRONIC_NAME,
		timestamps: true,
	},
);

const DOCUMENT_FURNITURE_NAME: string = 'Furniture';
const COLLECTION_FURNITURE_NAME: string = 'Furniture';

interface FurnitureAttributes {
	manufacture: string;
	model?: string;
	color?: string;
	product_shop?: string;
}

interface FurnitureDocument extends Document, FurnitureAttributes {
	createdAt: Date;
	updatedAt: Date;
}

const furnitureSchema: Schema<FurnitureDocument> = new Schema(
	{
		manufacture: { type: String, require: true },
		model: String,
		color: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
	},
	{
		collection: COLLECTION_FURNITURE_NAME,
		timestamps: true,
	},
);

//Export the model
export const productModel = mongoose.model(
	DOCUMENT_PRODUCT_NAME,
	ProductSchema,
);
export const clothingModel = mongoose.model(
	DOCUMENT_CLOTHING_NAME,
	clothingSchema,
);
export const electronicModel = mongoose.model(
	DOCUMENT_ELECTRONIC_NAME,
	electronicSchema,
);
export const furnitureModel = mongoose.model(
	DOCUMENT_FURNITURE_NAME,
	furnitureSchema,
);
