"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllDiscountCodesUnselect = exports.findAllDiscountCodesSelect = void 0;
const utils_1 = require("../../utils");
const findAllDiscountCodesUnselect = ({ limit = 50, page = 1, sort = 'ctime', filter, unselect, model, }) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = yield model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, utils_1.unGetSelectData)(unselect))
        .lean();
    return documents;
});
exports.findAllDiscountCodesUnselect = findAllDiscountCodesUnselect;
const findAllDiscountCodesSelect = ({ limit = 50, page = 1, sort = 'ctime', filter, select, model, }) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = yield model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, utils_1.getSelectData)(select))
        .lean();
    return documents;
});
exports.findAllDiscountCodesSelect = findAllDiscountCodesSelect;
