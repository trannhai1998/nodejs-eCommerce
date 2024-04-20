import { SuccessResponse } from '../core/success.response';
import CheckoutService from '../services/checkout.service';

class CheckoutController {
	checkoutReview = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successfully get checkout review',
			metadata: await CheckoutService.checkoutReview(req.body),
		}).send(res);
	};
}

export default new CheckoutController();
