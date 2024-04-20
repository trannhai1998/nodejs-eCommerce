import CartModel, { CART_STATE } from '../models/cart.model';
import {
	BadRequestError,
	ConflictRequestError,
	AuthFailureError,
	ForbiddenError,
	NotFoundError,
} from '../core/error.response';
import { getProductById } from '../models/repositories/product.repo';
import { convertToObjectIdMongodb } from '../utils';

class CartService {
	// Repo
	// Create Cart
	static async createUserCart({ userId, product }) {
		const query = { cart_userId: userId, cart_state: CART_STATE.ACTIVE };
		const updateOrInsert = {
			$addToSet: {
				cart_products: product,
			},
		};
		const options = { upsert: true, new: true };
		return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
	}

	// Reduce product quantity by one (user)
	static async updateUserCartQuantity({ userId, product }) {
		// const query = { cart_userId: userId, cart_state: CART_STATE.ACTIVE };
		// const updateOrInsert = {
		// 	$addToSet: {
		// 		cart_products: product,
		// 	},
		// };
		// const options = { upsert: true, new: true };
		const { productId, quantity } = product;

		const existProductId = await CartModel.findOneAndUpdate(
			{
				cart_userId: convertToObjectIdMongodb(userId),
				'cart_products.productId': productId,
				cart_state: CART_STATE.ACTIVE,
			},
			{
				$inc: {
					'cart_products.$.quantity': quantity,
				},
			},
			{
				upsert: true,
				new: true,
			},
		);

		if (!existProductId) {
			const newUpdateCart = await CartModel.findOneAndUpdate(
				{
					cart_userId: convertToObjectIdMongodb(userId),
					cart_state: CART_STATE.ACTIVE,
				},
				{
					$addToSet: {
						cart_products: product,
					},
				},
				{ upsert: true, new: true },
			);
			return newUpdateCart;
		}
		return existProductId;
	}
	// End Repo
	/// Add Product to cart (user)
	static async addToCart({ userId, product = {} }) {
		// Check cart existed
		const userCart = await CartModel.findOne({
			cart_userId: convertToObjectIdMongodb(userId),
		});

		if (!userCart) {
			// Create cart for User
			return await CartService.createUserCart({ userId, product });
		}
		// If cart existed but don't have any products
		if (!userCart.cart_products?.length) {
			userCart.cart_products = [product];
			return await userCart.save();
		}
		// If cart existed and have duplicate product

		return await CartService.updateUserCartQuantity({ userId, product });
	}
	// Update Cart
	/*
        Shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
	// Increase product quantity by One (user)
	static async addToCartV2({ userId, shop_order_ids }) {
		const { productId, quantity, old_quantity } =
			shop_order_ids[0]?.item_products[0];
		// Check product
		const foundProduct = await getProductById(productId);

		if (!foundProduct) throw new NotFoundError('Product not existed!');
		// compare
		if (
			foundProduct.product_shop?.toString() !== shop_order_ids[0]?.shopId
		) {
			throw new NotFoundError('Product do not belong to the shop');
		}

		if (quantity === 0) {
			// Delete Cart
		}

		return await this.updateUserCartQuantity({
			userId,
			product: {
				productId,
				quantity: quantity - old_quantity,
			},
		});
	}

	// Delete cart (user)
	static async deleteUserCart({ userId, productId }) {
		return await CartModel.updateOne(
			{
				cart_userId: convertToObjectIdMongodb(userId),
				cart_state: CART_STATE.ACTIVE,
			},
			{
				$pull: {
					cart_products: {
						productId,
					},
				},
			},
		);
	}

	static async getListUserCart({ userId }) {
		return await CartModel.findOne({
			cart_userId: convertToObjectIdMongodb(userId),
		}).lean();
	}
}

export default CartService;
