'use strict'
const ProductService = require('../services/product.service');
const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product successfully!',
            metadata: await ProductService.createProduct(req.body?.product_type, req.body)
        }).send(res)
    }

}

module.exports = new AccessController()