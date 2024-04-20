import DiscountModel from '../models/discount.model';
import { SuccessResponse } from '../core/success.response';
import DiscountService from '../services/discount.service';
import CartService from '../services/cart.service';

class CartController {
	/**
	 * @desc add cart for user
	 * @param req
	 * @param res
	 * @param next
	 */
	addToCart = async (req, res, next) => {
		// new
		new SuccessResponse({
			message: 'Create New Cart success!',
			metadata: await CartService.addToCart(req.body),
		}).send(res);
	};

    update = async (req, res, next) => {
		// new
		new SuccessResponse({
			message: 'Update Cart success!',
			metadata: await CartService.addToCartV2(req.body),
		}).send(res);
	};

    delete = async (req, res, next) => {
		// new
		new SuccessResponse({
			message: 'Delete New Cart success!',
			metadata: await CartService.deleteUserCart(req.body),
		}).send(res);
	}; 

    listToCart = async (req, res, next) => {
		// new
		new SuccessResponse({
			message: 'Get List Cart success!',
			metadata: await CartService.getListUserCart(req.query),
		}).send(res);
	}; 
}

export default new CartController();
