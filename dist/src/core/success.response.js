'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.CREATED = exports.OK = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
})(StatusCode || (StatusCode = {}));
var ReasonStatusCode;
(function (ReasonStatusCode) {
    ReasonStatusCode["OK"] = "Success!";
    ReasonStatusCode["CREATED"] = "Created!";
})(ReasonStatusCode || (ReasonStatusCode = {}));
class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}, }) {
        this.message = !message ? ReasonStatusCode.OK : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor({ message, metadata, }) {
        super({ message, metadata });
    }
}
exports.OK = OK;
class CREATED extends SuccessResponse {
    constructor({ options, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata, }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}
exports.CREATED = CREATED;
