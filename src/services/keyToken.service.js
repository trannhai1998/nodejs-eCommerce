'use strict'

const keyTokenModel = require("../models/keyToken.model")
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // Level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens?.publicKey : null
        } catch (err) {
            return err
        }
    }

    static findKeyTokenByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
    }
 
    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({user: new Types.ObjectId(userId)})
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
}

module.exports = KeyTokenService;