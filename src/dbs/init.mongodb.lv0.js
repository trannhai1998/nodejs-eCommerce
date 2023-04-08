'use strict'

const mongoose = require('mongoose')

const CONNECT_STRING = `mongodb://127.0.0.1:27017/myShop`
mongoose
    .connect(CONNECT_STRING).then(_ => console.log('Connected Mongodb Success'))
    .catch(err => console.log(`Error Connect!: `, err))



module.exports = mongoose;