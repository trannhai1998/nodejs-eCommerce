'use strict';

enum StatusCode {
	OK = 200,
	CREATED = 201,
}

enum ReasonStatusCode {
	OK = 'Success!',
	CREATED = 'Created!',
}

class SuccessResponse {
	message: string;
	status: StatusCode;
	metadata: any;

	constructor({
		message,
		statusCode = StatusCode.OK,
		reasonStatusCode = ReasonStatusCode.OK,
		metadata = {} as any,
	} : any) {
		this.message = !message ? ReasonStatusCode.OK : message;
		this.status = statusCode;
		this.metadata = metadata;
	}

	send(res: any, headers: any = {}): any {
		return res.status(this.status).json(this);
	}
}

class OK extends SuccessResponse {
	constructor({
		message,
		metadata,
	}: {
		message?: string;
		metadata: any;
	}) {
		super({ message, metadata });
	}
}

class CREATED extends SuccessResponse {
	options: any;

	constructor({
		options,
		message,
		statusCode = StatusCode.CREATED,
		reasonStatusCode = ReasonStatusCode.CREATED,
		metadata,
	}: {
		options: any;
		message?: string;
		statusCode?: StatusCode;
		reasonStatusCode?: ReasonStatusCode;
		metadata?: any;
	}) {
		super({ message, statusCode, reasonStatusCode, metadata });
		this.options = options;
	}
}

export { OK, CREATED, SuccessResponse };
