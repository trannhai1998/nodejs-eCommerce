'use strict';
const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
	Object.keys(obj).forEach((k) => {
		if (obj[k] === null || obj[k] === undefined) {
			delete obj[k];
		}
	});

	return obj;
};

const updateNestedObjectParse = (obj) => {
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

module.exports = {
	getInfoData,
	getSelectData,
	unGetSelectData,
	removeUndefinedObject,
	updateNestedObjectParse,
};
