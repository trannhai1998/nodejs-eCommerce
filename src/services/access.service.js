'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("../services/shop.service")


const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static logout = async(keyStore) => {
        console.log('Run here')
        console.log('Key Store:', keyStore)
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey });
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
        console.log(`Email::${email}`)
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
        console.log('Run here')
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }

    }

    static signUp = async ({ name, email, password }) => {
        try {
            // Step 1: check email exists?
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

                console.log('PrivateKey Public Key')
                console.log(privateKey, publicKey); // Save collection keyStore
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

}

module.exports = AccessService