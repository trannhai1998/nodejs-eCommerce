'use strict';
import { REASON_PHRASES, STATUS_CODES } from '../utils/httpStatusCode';

class ErrorResponse extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(
		message = REASON_PHRASES.CONFLICT,
		status = STATUS_CODES.FORBIDDEN,
	) {
		super(message, status);
	}
}

class BadRequestError extends ErrorResponse {
	constructor(
		message = REASON_PHRASES.FORBIDDEN,
		status = STATUS_CODES.CONFLICT,
	) {
		super(message, status);
	}
}

class AuthFailureError extends ErrorResponse {
	constructor(
		message = REASON_PHRASES.UNAUTHORIZED,
		status = STATUS_CODES.UNAUTHORIZED,
	) {
		super(message, status);
	}
}

class NotFoundError extends ErrorResponse {
	constructor(
		message = REASON_PHRASES.NOT_FOUND,
		status = STATUS_CODES.NOT_FOUND,
	) {
		super(message, status);
	}
}

class ForbiddenError extends ErrorResponse {
	constructor(
		message = REASON_PHRASES.FORBIDDEN,
		status = STATUS_CODES.FORBIDDEN,
	) {
		super(message, status);
	}
}

export {
	ConflictRequestError,
	BadRequestError,
	AuthFailureError,
	NotFoundError,
	ForbiddenError,
};
