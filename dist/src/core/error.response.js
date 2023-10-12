'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.NotFoundError = exports.AuthFailureError = exports.BadRequestError = exports.ConflictRequestError = void 0;
const httpStatusCode_1 = require("../utils/httpStatusCode");
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.REASON_PHRASES.CONFLICT, status = httpStatusCode_1.STATUS_CODES.FORBIDDEN) {
        super(message, status);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.REASON_PHRASES.FORBIDDEN, status = httpStatusCode_1.STATUS_CODES.CONFLICT) {
        super(message, status);
    }
}
exports.BadRequestError = BadRequestError;
class AuthFailureError extends ErrorResponse {
    constructor(message = httpStatusCode_1.REASON_PHRASES.UNAUTHORIZED, status = httpStatusCode_1.STATUS_CODES.UNAUTHORIZED) {
        super(message, status);
    }
}
exports.AuthFailureError = AuthFailureError;
class NotFoundError extends ErrorResponse {
    constructor(message = httpStatusCode_1.REASON_PHRASES.NOT_FOUND, status = httpStatusCode_1.STATUS_CODES.NOT_FOUND) {
        super(message, status);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ErrorResponse {
    constructor(message = httpStatusCode_1.REASON_PHRASES.FORBIDDEN, status = httpStatusCode_1.STATUS_CODES.FORBIDDEN) {
        super(message, status);
    }
}
exports.ForbiddenError = ForbiddenError;
