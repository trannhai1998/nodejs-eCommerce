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
exports.permission = exports.apiKey = void 0;
const apiKey_service_1 = require("../services/apiKey.service");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};
const apiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const key = (_a = req.headers[HEADER.API_KEY]) === null || _a === void 0 ? void 0 : _a.toString();
        console.log(key);
        if (!key) {
            return res === null || res === void 0 ? void 0 : res.status(403).json({
                message: 'Forbidden Error',
            });
        }
        // Check objKey
        const objKey = yield (0, apiKey_service_1.findById)(key);
        if (!objKey) {
            return res === null || res === void 0 ? void 0 : res.status(403).json({
                message: 'Forbidden Error',
            });
        }
        req.objKey = objKey;
        return next();
    }
    catch (error) { }
});
exports.apiKey = apiKey;
const permission = (permission) => {
    return (req, res, next) => {
        var _a;
        if (!(req === null || req === void 0 ? void 0 : req.objKey.permissions)) {
            return res === null || res === void 0 ? void 0 : res.status(403).json({
                message: 'Permissions Denied',
            });
        }
        const validPermissions = (_a = req === null || req === void 0 ? void 0 : req.objKey) === null || _a === void 0 ? void 0 : _a.permissions.includes(permission);
        if (!validPermissions) {
            return res === null || res === void 0 ? void 0 : res.status(403).json({
                message: 'Permissions Denied',
            });
        }
        return next();
    };
};
exports.permission = permission;
