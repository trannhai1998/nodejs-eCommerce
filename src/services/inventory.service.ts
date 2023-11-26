import { BadRequestError, NotFoundError } from '../core/error.response';
import InventoryModel from '../models/inventory.model';
import { getProductById } from '../models/repositories/product.repo';

class InventoryService {
	static async addStockToInventory({
		stock,
		productId,
		shopId,
		location = '306 Tran Phu, Da Nang',
	}) {
		const product = await getProductById(productId);
		if (!product) {
			throw new NotFoundError('Not found product');
		}

		const query = {
			inventory_shopId: shopId,
			inventory_productId: productId,
		};
		const updateSet = {
			$inc: {
				inventory_stock: stock,
			},
			$set: {
				inventory_location: location,
			},
		};
		const options = { upsert: true, new: true };

		return await InventoryModel.findOneAndUpdate(query, updateSet, options);
	}
}

export default InventoryService;
