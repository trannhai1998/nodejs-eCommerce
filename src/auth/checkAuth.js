'use strict'

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res?.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // Check objKey
        const objKey = await findById(key);

        if (!objKey) {
            return res?.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const permission = (permission) => {
    return (req, res, next) => {
        console.log('Run here ====================')
        console.log('Permission::', permission);

        if (!req?.objKey.permissions) {
            return res?.status(403).json({
                message: 'Permissions Denied'
            })
        }

        const validPermissions = req?.objKey?.permissions.includes(permission);



        if (!validPermissions) {
            return res?.status(403).json({
                message: 'Permissions Denied'
            })
        }
        console.log('run here');

        return next();
    }
}



module.exports = {
    apiKey,
    permission,
}