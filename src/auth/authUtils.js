'use strict'
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findKeyTokenByUserId: findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        // Verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify:: ${error}`)
            } else {
                console.log(`decode verify:: ${decode.toString()}`)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
    }
}

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**
     * 1- Check userId missing???
     * 2- get accessToken
     * 3- verifyToken
     * 4- Check use in dbs
     * 5- check keyStore with this userId
     * 6- Ok all => return next()
     */

    //1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not Found KeyStore');
    //3
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            console.log(decodeUser);
            if (userId !== decodeUser?.userId) throw AuthFailureError('Invalid User')
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next()
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser?.userId) throw AuthFailureError('Invalid User')
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next()
    } catch (error) {
        console.log(error);
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authenticationV2,
    verifyJWT
}