import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import productController from '../../controllers/product.controller';
import { authenticationV2 } from '../../auth/authUtils';

const router = express.Router();

// QUERY Without Authenication
router.get(
	'/search/:keySearch',
	asyncHandler((req, res) =>
		productController.getListSearchProduct(req, res),
	),
);
router.get(
	'',
	asyncHandler((req, res) => productController.findAllProducts(req, res)),
);
router.get(
	'/:product_id',
	asyncHandler((req, res) => productController.findProduct(req, res)),
);

// Authentication
router.use(authenticationV2);

// QUERY
router.get(
	'/draft/all',
	asyncHandler((req, res) => productController.getAllDraftsForShop(req, res)),
);
router.get(
	'/published/all',
	asyncHandler((req, res) =>
		productController.getAllPublishesForShop(req, res),
	),
);

// PUT
router.post(
	'/new',
	asyncHandler((req, res) => productController.createProduct(req, res)),
);

router.post(
	'/published/:id',
	asyncHandler((req, res) =>
		productController.publishProductByShop(req, res),
	),
);
router.post(
	'/unpublished/:id',
	asyncHandler((req, res) =>
		productController.unpublishProductByShop(req, res),
	),
);

// PATCH
router.patch(
	'/update/:productId',
	asyncHandler((req, res) => productController.updateProduct(req, res)),
);

export default router;
