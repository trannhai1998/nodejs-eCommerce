import { Request, Response, NextFunction } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import AccessService from '../services/access.service';

class AccessController {
	handlerRefreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		new SuccessResponse({
			message: 'Get Token Success !',
			metadata: await AccessService.handlerRefreshTokenV2({
				refreshToken: req.body.refreshToken,
				user: req.params.user,
				keyStore: req.params.keyStore,
			}),
		}).send(res);
	};

	login = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		new SuccessResponse({
			metadata: await AccessService.login(req.body),
		}).send(res);
	};

	logout = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		new SuccessResponse({
			message: 'Logout Success',
			metadata: await AccessService.logout(req.params.keyStore),
		}).send(res);
	};

	signUp = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		new CREATED({
			message: 'Registered Success',
			metadata: await AccessService.signUp(req.body),
			options: {
				limit: 10,
			},
		}).send(res);
	};
}

export default new AccessController();
