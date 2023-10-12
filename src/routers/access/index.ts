import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import accessController from '../../controllers/access.controller';
import { authenticationV2 } from '../../auth/authUtils';

const router = express.Router();

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// Authentication
router.use(authenticationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post(
	'/shop/handlerRefreshToken',
	asyncHandler(accessController.handlerRefreshToken),
);

export default router;
