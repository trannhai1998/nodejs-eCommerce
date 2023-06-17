'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("../services/shop.service")


const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey;
    }

    /*
        1- Check email in dbs.
        2- match Password.
        3- create access token & refresh token and save.
        4- generate tokens.
        5- get Data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        //1
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!')
        }
        //2
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Authentication error')
        }
        //3
        // Create privateKey, publicKey.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const { _id: userId } = foundShop
        //4- generate tokens.
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken,
            userId
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            // Step 1: check email exists?
            console.log('Run here 0')

            const holderShop = await shopModel.findOne({ email }).lean() // Lean help query faster => tra? ve object js nhe. hon neu ko co lean

            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered!')
            }
            // ma hoa password
            const passwordHash = await bcrypt.hash(password, 6);

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [ROLE_SHOP.SHOP]
            })
            if (newShop) {
                // Created privateKey, publicKey 
                // level advance: amazon...
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { // rsa: bat doi xung 
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // Public key cryptoGraphy Standards
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1', // Public key cryptoGraphy Standards
                //         format: 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if (!keyStore) {
                    return {
                        status: 'xxxxx',
                        message: 'Key Store error'
                    }
                }
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        } catch (error) {

            console.error(error);
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    /**
   * 
   * @param {*} refreshToken 
   * Check this token used?
   */
    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        console.log(user);
        const { userId, email } = user;

        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);

            throw new ForbiddenError('Something wrong happened! Please login again');
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not Registered');
        }
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new AuthFailureError('Shop not registered');
        }
        // Create new token
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        // Update token
        console.log('Run here', keyStore);

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken // Add token used to refreshTokenUsed field
            }
        })
        return {
            user,
            tokens
        }
    }

    /**
     * 
     * @param {*} refreshToken 
     * Check this token used?
     */
    // static handlerRefreshToken = async (refreshToken) => {
    //     // Check Token Used??
    //     const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    //     console.log(foundToken);
    //     if (foundToken) {
    //         // Decode xem may la thang nao?
    //         const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
    //         console.log({ userId, email });
    //         // delete all token in keyStore
    //         await KeyTokenService.deleteKeyById(userId);

    //         throw new ForbiddenError('Something wrong happened! Please login again');
    //     }
    //     // No => good
    //     const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    //     console.log('Holder Token: ', holderToken);
    //     if (!holderToken) {
    //         throw new AuthFailureError('Shop not Registered');
    //     }
    //     // Verify Token
    //     const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    //     console.log(' Run 2----:::', userId, email);
    //     // Check UserId
    //     const foundShop = await findByEmail({ email });
    //     if (!foundShop) {
    //         throw new AuthFailureError('Shop not registered');
    //     }
    //     // Create new token
    //     const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
    //     // Update token
    //     await holderToken.updateOne({
    //         $set: {
    //             refreshToken: tokens.refreshToken
    //         },
    //         $addToSet: {
    //             refreshTokenUsed: refreshToken // Add token used to refreshTokenUsed field
    //         }
    //     })
    //     console.log('Run here');

    //     return {
    //         user: { userId, email },
    //         tokens
    //     }
    // }
}

module.exports = AccessService