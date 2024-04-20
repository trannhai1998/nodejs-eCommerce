import { convertToObjectIdMongodb } from '../../utils';
import CartModel, { CART_STATE } from '../cart.model';

export const findCartById = async (id) => {
	return await CartModel.findOne({
		_id: convertToObjectIdMongodb(id),
		cart_state: CART_STATE.ACTIVE,
	});
};
