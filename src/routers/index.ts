import express, { Router } from 'express';
import { apiKey, permission } from '../auth/checkAuth';
import productRouter from './product';
import accessRouter from './access';
import discountRouter from './discount';
import cartRouter from './cart';
import checkoutRouter from './checkout';
import inventoryRouter from './inventory';

const router: Router = express.Router();

// Check Api Key
router.use(apiKey);
// Check permission
router.use(permission('0000'));

router.use('/v1/api/cart', cartRouter);

router.use('/v1/api/checkout', checkoutRouter);

router.use('/v1/api/inventory', inventoryRouter);

router.use('/v1/api/discount', discountRouter);

router.use('/v1/api/product', productRouter);

router.use('/v1/api', accessRouter);

export default router;
