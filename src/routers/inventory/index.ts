import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import DiscountController from '../../controllers/discount.controller';
import { authenticationV2 } from '../../auth/authUtils';
import InventoryController from '../../controllers/inventory.controller';

const router = express.Router();
router.use(authenticationV2);

router.post('', asyncHandler(InventoryController.addStockToInventory));
// Authentication

export default router;
