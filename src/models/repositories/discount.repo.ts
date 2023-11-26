import { getSelectData, unGetSelectData } from '../../utils';
import DiscountModel from '../discount.model';
import discountModel from '../discount.model';

interface FindAllDiscountCodesUnselectOptions {
	limit?: number;
	page?: number;
	sort?: string;
	filter: any;
	unselect: string[];
	model: any;
}

const findAllDiscountCodesUnselect = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	unselect,
	model,
}: FindAllDiscountCodesUnselectOptions) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const documents = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(unGetSelectData(unselect))
		.lean();

	return documents;
};

interface FindAllDiscountCodesSelectOptions {
	limit?: number;
	page?: number;
	sort?: string;
	filter: any;
	select: string[];
	model: any;
}

const findAllDiscountCodesSelect = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	select,
	model,
}: FindAllDiscountCodesSelectOptions) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const documents = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();

	return documents;
};

const checkDiscountExists = async (filter: {
	discount_shopId;
	discount_code;
}) => {
	return await DiscountModel.findOne(filter).lean();
};

export {
	findAllDiscountCodesSelect,
	findAllDiscountCodesUnselect,
	checkDiscountExists,
};
