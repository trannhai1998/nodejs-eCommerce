import { convertToObjectIdMongodb } from '../../utils';
import inventoryModel from '../inventory.model';

const insertInventory = async ({
	productId,
	shopId,
	stock,
	location = 'unknown',
}) => {
	return await inventoryModel.create({
		inventory_productId: productId,
		inventory_shopId: shopId,
		inventory_stock: stock,
		inventory_location: location,
	});
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
	const query = {
		inventory_productId: convertToObjectIdMongodb(productId),
		inventory_stock: { $gte: quantity },
	};
	const updateSet = {
		$inc: {
			inventory_stock: -quantity,
		},
		$push: {
			inventory_reservations: {
				quantity,
				cartId,
				createOn: new Date(),
			},
		},
	};
	const options = { upsert: true, new: true };
	return await inventoryModel.updateOne(query, updateSet, options);
};

export { insertInventory, reservationInventory };
