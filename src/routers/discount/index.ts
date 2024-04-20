import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import DiscountController from '../../controllers/discount.controller';
import { authenticationV2 } from '../../auth/authUtils';

const router = express.Router();

// QUERY Without Authentication
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get(
	'/list_product_code',
	asyncHandler(DiscountController.getAllDiscountCodesWithProduct),
);

// Authentication
router.use(authenticationV2);

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeByShop))

export default router;
