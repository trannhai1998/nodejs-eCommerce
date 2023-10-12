'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model.js');
const { convertToObjectIdMongodb } = require('../utils');
const { findAllProducts } = require('../models/repositories/product.repo');
const {
	findAllDiscountCodesUnselect,
} = require('../models/repositories/discount.repo');
/**
 * Discount Service
 * 1- Generator Discount Code [Shop | Admin]
 * 2- get Discount amount [User]
 * 3- Get all discount codes [User | Shop]
 * 4- Verify discount code [user]
 * 5- Delete discount Code [Admin | Shop]
 * 6- Cancel discount code [users]
 */

const DISCOUNT_TYPE = {
	ALL: 'all',
	SPECIFIC: 'specific',
};

class DiscountService {
	static async createDiscountCode(payload) {
		const {
			discount_code,
			discount_start_date,
			discount_end_date,
			discount_is_active,
			discount_shopId,
			discount_min_order_value,
			discount_product_ids,
			discount_applies_to,
			discount_name,
			discount_description,
			discount_type,
			discount_value,
			discount_max_uses,
			discount_uses_count,
			discount_users_used,
			discount_max_value_while_percent,
			discount_max_users_per_user,
		} = payload;

		if (
			new Date() < new Date(discount_start_date) ||
			new Date() > new Date(discount_end_date)
		) {
			throw new BadRequestError('Discount code has expired');
		}

		if (new Date(discount_end_date) <= new Date(discount_start_date)) {
			return BadRequestError('Start Date must be before end date');
		}

		// create index for discount code
		const foundDiscount = await this.findDiscountCode({
			discount_code,
			discount_shopId,
		});

		if (foundDiscount && foundDiscount?.discount_is_active) {
			throw new BadRequestError('Discount existed and active!');
		}

		const newDiscount = await discountModel.create({
			discount_code,
			discount_start_date: new Date(discount_start_date),
			discount_end_date: new Date(discount_end_date),
			discount_is_active,
			discount_shopId,
			discount_min_order_value: discount_min_order_value || 0,
			discount_product_ids:
				discount_applies_to === 'all' ? [] : discount_product_ids,
			discount_applies_to,
			discount_name,
			discount_description,
			discount_type,
			discount_value,
			discount_max_uses,
			discount_uses_count,
			discount_users_used,
			discount_max_value_while_percent,
			discount_max_users_per_user,
		});

		return newDiscount;
	}

	static async findDiscountCode({ discount_code, discount_shopId }) {
		return await discountModel
			.findOne({
				discount_code,
				discount_shopId: convertToObjectIdMongodb(discount_shopId),
			})
			.lean();
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
		userId,
		limit,
		page,
	}) {
		// create index for discount_code.
		const foundDiscount = await this.findDiscountCode({
			discount_code: code,
			discount_shopId: convertToObjectIdMongodb(shopId),
		});

		if (!foundDiscount || foundDiscount.discount_is_active) {
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
		}
	}

	// Get all discount code of shop
	static async getAllDiscountCodesByShop({ limit, page, shopId }) {
		const discounts = await findAllDiscountCodesUnselect({
			limit,
			page,
			filter: {
				discount_shopId: convertToObjectIdMongodb(shopId),
				discount_is_active: true,
			},
			unselect: ['__v', 'discount_shopId'],
			model: discountModel,
		});

		return discounts;
	}
}
