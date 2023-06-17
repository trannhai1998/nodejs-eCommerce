'use strict'
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.advance.service');

const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    createProduct = async (req, res, next) => {
        console.log(req?.user);
        new SuccessResponse({
            message: 'Create new product successfully!',
            metadata: await ProductServiceV2.createProduct(req.body?.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

}

module.exports = new AccessController()