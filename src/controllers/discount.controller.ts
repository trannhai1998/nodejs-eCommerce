import DiscountModel from '../models/discount.model';
import { SuccessResponse } from '../core/success.response';
import DiscountService from '../services/discount.service';

class DiscountController {
	createDiscountCode = async (req, res, next) => {
        console.log('Run here Create new discount');
		new SuccessResponse({
			message: 'Successfully Code Generations',
			metadata: await DiscountService.createDiscountCode({
				...req.body,
				shopId: req.user.userId,
			}),
		}).send(res);
	};

	getAllDiscountCodeByShop = async (req, res, next) => {
        console.log('Run here');
		new SuccessResponse({
			message: 'Successfully get all discount',
			metadata: await DiscountService.getAllDiscountCodesByShop({
				...req.query,
				shopId: req.user.userId,
			}),
		}).send(res);
	};

	getDiscountAmount = async (req, res, next) => {
        console.log('Get amount ======================')
		new SuccessResponse({
			message: 'Successfully get discount amount',
			metadata: await DiscountService.getDiscountAmount({
				...req.body,
			}),
		}).send(res);
	};

	getAllDiscountCodesWithProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successfully get all discount with product',
			metadata: await DiscountService.getAllDiscountCodesWithProduct({
				...req.query,
			}),
		}).send(res);
	};
}

export default new DiscountController();
