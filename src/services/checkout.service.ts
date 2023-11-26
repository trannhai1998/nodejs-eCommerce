import { BadRequestError, NotFoundError } from '../core/error.response';
import CartModel from '../models/cart.model';
import OrderModel from '../models/order.model';
import { findCartById } from '../models/repositories/cart.repo';
import { checkProductByServer } from '../models/repositories/product.repo';
import DiscountService from './discount.service';
import { acquireLock, releaseLock } from './redis.service';

class CheckoutService {
	/*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: {
                        price,
                        quantity,
                        productId
                    }
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            "shopId":
                            "discountId",nvb m    
                            "codeId":
                        }
                    ],
                    item_products: {
                        price,
                        quantity,
                        productId
                    }
                }
            ]
        }
    */
	static async checkoutReview({ cartId, userId, shop_order_ids }) {
		// Check cartId exist
		const foundCart = await findCartById(cartId);
		if (!foundCart) {
			throw new NotFoundError('Cart not existed!');
		}

		const checkout_order = {
			totalPrice: 0,
			feeShip: 0,
			totalDiscount: 0,
			totalCheckout: 0,
		};
		const shop_order_ids_new: any = [];
		// Calculate total bill
		for (let i = 0; i < shop_order_ids?.length; i++) {
			const {
				shopId,
				shop_discounts = [],
				item_products = [],
			} = shop_order_ids[i];
			// Check product available
			const checkProductServer = await checkProductByServer(
				item_products,
			);
			if (!checkProductServer[0]) {
				throw new BadRequestError('order wrong!!!');
			}

			// Total Checkout
			const checkoutPrice = checkProductServer.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			// Total Checkout Before Confirm
			checkout_order.totalPrice = checkoutPrice;

			const itemCheckout = {
				shopId,
				shop_discounts,
				priceRaw: checkoutPrice,
				priceApplyDiscount: checkoutPrice,
				item_products: checkProductServer,
			};

			// if shop_discounts existed and > 0, Check it can apply
			if (shop_discounts?.length > 0) {
				console.log(shop_discounts);
				// If only have 1 discount
				// get amount discount
				const {
					discount = 0,
					totalOrder,
					totalPrice = 0,
				} = await DiscountService.getDiscountAmount({
					codeId: shop_discounts[0].codeId,
					userId,
					shopId,
					products: checkProductServer,
				});
				checkout_order.totalDiscount += discount;

				if (discount > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - discount;
				}
			}
			// Total Discount
			checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
			shop_order_ids_new.push(itemCheckout);
		}

		return {
			shop_order_ids,
			shop_order_ids_new,
			checkout_order,
		};
	}

	static async orderByUser({
		shop_order_ids,
		cartId,
		userId,
		user_address = {},
		user_payment = {},
	}) {
		const { shop_order_ids_new, checkout_order } =
			await CheckoutService.checkoutReview({
				cartId,
				userId,
				shop_order_ids,
			});
		// Continue check if out stocking
		// get new array Products
		const products = shop_order_ids_new.flatMap(
			(order) => order?.item_products,
		);
		console.log('Products:::', products);
		const acquireProduct: boolean[] = [];
		for (let i = 0; i < products?.length; i++) {
			const { productId, quantity } = products[i];
			const keyLock = await acquireLock(productId, quantity, cartId);
			acquireProduct.push(keyLock ? true : false);
			if (keyLock) {
				await releaseLock(keyLock);
			}

			// Check if 1 product out of stock.
			if (acquireProduct.some((e) => !e)) {
				throw new BadRequestError(
					'Some Product updated, please go back and confirm your order again!',
				);
			}

			const newOrder = await OrderModel.create({
				order_userId: userId,
				order_checkout: checkout_order,
				order_shipping: user_address,
				order_payment: user_payment,
				order_products: shop_order_ids_new,
			});
			// Case 1: If insert successfully => remove product in this cart.
			if (newOrder) {
				// Remove product in this cart.
			}

			return newOrder;
		}
	}

	/*
        1> Query Orders [Users]
    */
	static async getOrdersByUser() {}

	/*
        2> Query Orders Using Id [Users]
    */
	static async getOneOrderByUser() {}

	/*
        3> Cancel Order [Users]
    */
	static async cancelOrderByUser() {}

	/*
        4> Update Order Status  [Shop | Admin]
        Why Admin ? For update status order to delivering
    */
	static async updateOrderStatusByShop() {}
}

export default CheckoutService;
