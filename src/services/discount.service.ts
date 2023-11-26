'use strict';

import { BadRequestError, NotFoundError } from '../core/error.response';
import { convertToObjectIdMongodb } from '../utils';
import { findAllProducts } from '../models/repositories/product.repo';
import {
	checkDiscountExists,
	findAllDiscountCodesUnselect,
} from '../models/repositories/discount.repo';
import { ObjectId } from 'mongoose';
import DiscountModel from '../models/discount.model';

/**
 * Discount Service
 * 1- Generator Discount Code [Shop | Admin]
 * 2- get Discount amount [User]
 * 3- Get all discount codes [User | Shop]
 * 4- Verify discount code [user]
 * 5- Delete discount Code [Admin | Shop]
 * 6- Cancel discount code [users]
 */

interface DiscountCode {
	discount_code: string;
	discount_shopId: any;
}

interface GetAllDiscountCodesWithProductParams {
	code: string;
	shopId: string;
	userId: string;
	limit: number;
	page: number;
}

interface GetAllDiscountCodesByShopParams {
	limit: number;
	page: number;
	shopId: string;
}

const DISCOUNT_TYPE = {
	ALL: 'all',
	SPECIFIC: 'specific',
};

class DiscountService {
	static async createDiscountCode(payload) {
		const {
			code,
			start_date,
			end_date,
			is_active,
			shopId,
			min_order_value,
			product_ids,
			applies_to,
			name,
			description,
			type,
			value,
			max_uses,
			uses_count,
			users_used,
			max_value_while_percent,
			max_users_per_user,
		} = payload;

		// if (
		// 	new Date() < new Date(start_date) ||
		// 	new Date() > new Date(end_date)
		// ) {
		// 	throw new BadRequestError('Discount code has expired');
		// }

		if (new Date(end_date) <= new Date(start_date)) {
			return new BadRequestError('Start Date must be before end date');
		}

		// create index for discount code
		const foundDiscount = await this.findDiscountCode({
			discount_code: code,
			discount_shopId: shopId,
		});

		if (foundDiscount && foundDiscount?.discount_is_active) {
			throw new BadRequestError('Discount existed and active!');
		}

		const newDiscount = await DiscountModel.create({
			discount_code: code,
			discount_start_date: new Date(start_date),
			discount_end_date: new Date(end_date),
			discount_is_active: is_active,
			discount_shopId: shopId,
			discount_min_order_value: min_order_value || 0,
			discount_product_ids: applies_to === 'all' ? [] : product_ids,
			discount_applies_to: applies_to,
			discount_name: name,
			discount_description: description,
			discount_type: type,
			discount_value: value,
			discount_max_uses: max_uses,
			discount_uses_count: uses_count,
			discount_users_used: users_used,
			discount_max_value_while_percent: max_value_while_percent,
			discount_max_users_per_user: max_users_per_user,
		});

		return newDiscount;
	}

	static async findDiscountCode({
		discount_code,
		discount_shopId,
	}: DiscountCode) {
		return await DiscountModel.findOne({
			discount_code,
			discount_shopId: convertToObjectIdMongodb(discount_shopId),
		}).lean();
	}

	static async updateDiscountCode() {
		//...
	}

	/**
	 * Get All Discount for this product
	 */
	static async getAllDiscountCodesWithProduct({
		code,
		shopId,
		limit,
		page,
	}: GetAllDiscountCodesWithProductParams) {
		// create index for discount_code.
		const foundDiscount = await this.findDiscountCode({
			discount_code: code,
			discount_shopId: convertToObjectIdMongodb(shopId),
		});

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundError('discount not exists!');
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;

		if (discount_applies_to === DISCOUNT_TYPE.ALL) {
			// get all product
			const products = await findAllProducts({
				filter: {
					product_shop: convertToObjectIdMongodb(shopId),
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			});

			return products;
		}

		if (discount_applies_to === DISCOUNT_TYPE.SPECIFIC) {
			// get the product ids
			const products = await findAllProducts({
				filter: {
					_id: { $in: discount_product_ids },
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			});

			return products;
		}
	}

	// Get all discount code of shop
	static async getAllDiscountCodesByShop({
		limit,
		page,
		shopId,
	}: GetAllDiscountCodesByShopParams) {
		const discounts = await findAllDiscountCodesUnselect({
			limit,
			page,
			filter: {
				discount_shopId: convertToObjectIdMongodb(shopId),
				discount_is_active: true,
			},
			unselect: ['__v', 'discount_shopId'],
			model: DiscountModel,
		});

		return discounts;
	}
	/*
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
	static async getDiscountAmount({ codeId, userId, shopId, products }) {
        
		const foundDiscount = await checkDiscountExists({
			discount_code: codeId,
			discount_shopId: convertToObjectIdMongodb(shopId),
		});

		if (!foundDiscount) throw new NotFoundError(`Discount doesn't existed`);

		const {
			discount_is_active,
			discount_max_uses,
			discount_start_date,
			discount_end_date,
			discount_min_order_value,
			discount_max_users_per_user,
			discount_users_used,
			discount_type,
			discount_value,
		} = foundDiscount;
		if (!discount_is_active) throw new NotFoundError('discount expired!');
		if (!discount_max_uses) throw new NotFoundError('discount expired!');

		if (
			new Date() <
			new Date(
				discount_start_date || new Date() > new Date(discount_end_date),
			)
		) {
			throw new NotFoundError('Discount code has expired!');
		}

		let totalOrder = 0;
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			if (totalOrder < discount_min_order_value) {
				throw new NotFoundError(
					`discount requires a minium order value of ${discount_min_order_value}`,
				);
			}
		}

		if (discount_max_users_per_user > 0) {
			const userUsedDiscount = discount_users_used.find(
				(user) => user.userId === userId,
			);
			if (userUsedDiscount) {
				// Already use.
			}
		}

		// Check xem discount nay la fixed_amount
		const amount =
			discount_type === 'fixed_amount'
				? discount_value
				: totalOrder * (discount_value / 100);
		return {
			totalOrder,
			discount: amount,
			totalPrice: totalOrder - amount,
		};
	}

	static async deleteDiscountCode({ shopId, codeId }) {
		const deleted = await DiscountModel.findOneAndDelete({
			discount_code: codeId,
			discount_shopId: convertToObjectIdMongodb(shopId),
		});

		return deleted;
	}

	static async cancelDiscountCode({ codeId, shopId, userId }) {
		const foundDiscount = await checkDiscountExists({
			discount_shopId: shopId,
			discount_code: codeId,
		});

		if (!foundDiscount) {
			throw new NotFoundError(`Discount doesn't existed!`);
		}

		const result = await DiscountModel.findByIdAndUpdate(
			foundDiscount._id,
			{
				$pull: {
					discount_users_userId: userId,
				},
				$inc: {
					discount_max_uses: 1,
					discount_uses_count: -1,
				},
			},
		);

		return result;
	}
}

export default DiscountService;
