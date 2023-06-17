'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router()

// Authentication
router.use(authenticationV2)
router.post('/product/new', asyncHandler(productController.createProduct))

module.exports = router;