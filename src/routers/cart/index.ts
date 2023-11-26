import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';

import { authenticationV2 } from '../../auth/authUtils';
import cartController from '../../controllers/cart.controller';

const router = express.Router();

// QUERY Without Authentication
router.post('', asyncHandler(cartController.addToCart));
router.get(
	'',
	asyncHandler(cartController.listToCart),
);
router.delete(
	'',
	asyncHandler(cartController.delete),
);
router.post(
	'/update',
	asyncHandler(cartController.update),
);

export default router;
