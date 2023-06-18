'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router()

// QUERY Without Authenication
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))


// Authentication
router.use(authenticationV2)

// QUERY
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishesForShop))

// PUT
router.post('/new', asyncHandler(productController.createProduct))

router.post('/published/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublished/:id', asyncHandler(productController.unpublishProductByShop))
// PATCH
router.patch('/update/:productId', asyncHandler(productController.updateProduct))


module.exports = router;