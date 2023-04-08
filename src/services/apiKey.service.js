'use strict'

const apiKeyModel = require("../models/apiKey.model")
const findById = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true })?.lean();
    console.log(objKey);
    return objKey;
}


module.exports = {
    findById
}