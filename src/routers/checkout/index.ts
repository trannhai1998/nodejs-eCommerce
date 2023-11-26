import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import DiscountController from '../../controllers/discount.controller';
import { authenticationV2 } from '../../auth/authUtils';
import checkoutController from '../../controllers/checkout.controller';

const router = express.Router();

router.post('/review', checkoutController.checkoutReview)
// Authentication

export default router;
