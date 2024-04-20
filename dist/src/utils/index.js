"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToObjectIdMongodb = exports.updateNestedObjectParse = exports.removeUndefinedObject = exports.unGetSelectData = exports.getSelectData = exports.getInfoData = void 0;
const mongoose_1 = require("mongoose");
const lodash_1 = __importDefault(require("lodash"));
const convertToObjectIdMongodb = (id) => new mongoose_1.Types.ObjectId(id);
exports.convertToObjectIdMongodb = convertToObjectIdMongodb;
const getInfoData = ({ fields = [], object = {}, }) => {
    return lodash_1.default.pick(object, fields);
};
exports.getInfoData = getInfoData;
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
exports.getSelectData = getSelectData;
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
exports.unGetSelectData = unGetSelectData;
const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k] === null || obj[k] === undefined) {
            delete obj[k];
        }
    });
    return obj;
};
exports.removeUndefinedObject = removeUndefinedObject;
const updateNestedObjectParse = (obj) => {
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (!!obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParse(obj[k]);
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = response[a];
            });
        }
        else {
            if (!!obj[k]) {
                final[k] = obj[k];
            }
        }
    });
    return final;
};
exports.updateNestedObjectParse = updateNestedObjectParse;
