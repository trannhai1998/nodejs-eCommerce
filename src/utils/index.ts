import { Types } from 'mongoose';
import _ from 'lodash';

const convertToObjectIdMongodb = (id: string): Types.ObjectId =>
	new Types.ObjectId(id);

interface GetInfoDataParams {
	fields?: string[];
	object: object;
}

const getInfoData = ({
	fields = [],
	object = {},
}: GetInfoDataParams): object => {
	return _.pick(object, fields);
};

const getSelectData = (select: string[] = []): object => {
	return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select: string[] = []): object => {
	return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj: object): object => {
	Object.keys(obj).forEach((k) => {
		if (obj[k] === null || obj[k] === undefined) {
			delete obj[k];
		}
	});

	return obj;
};

const updateNestedObjectParse = (obj: object): object => {
	const final = {};
	Object.keys(obj).forEach((k) => {
		if (!!obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
			const response = updateNestedObjectParse(obj[k]);
			Object.keys(response).forEach((a) => {
				final[`${k}.${a}`] = response[a];
			});
		} else {
			if (!!obj[k]) {
				final[k] = obj[k];
			}
		}
	});

	return final;
};

export {
	getInfoData,
	getSelectData,
	unGetSelectData,
	removeUndefinedObject,
	updateNestedObjectParse,
	convertToObjectIdMongodb,
};
