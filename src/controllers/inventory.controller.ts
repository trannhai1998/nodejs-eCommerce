import { SuccessResponse } from '../core/success.response';
import InventoryService from '../services/inventory.service';

class InventoryController {
	addStockToInventory = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successfully get checkout review',
			metadata: await InventoryService.addStockToInventory(req.body),
		}).send(res);
	};
}

export default new InventoryController();
