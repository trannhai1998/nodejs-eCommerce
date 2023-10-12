import express, { Router } from 'express';
import { apiKey, permission } from '../auth/checkAuth';
import productRouter from './product';
import accessRouter from './access';

const router: Router = express.Router();

// Check Api Key
router.use(apiKey);
// Check permission 
router.use(permission('0000'));

router.use('/v1/api/product', productRouter);
router.use('/v1/api', accessRouter);

export default router;