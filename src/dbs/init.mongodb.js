'use strict'

const mongoose = require('mongoose')
const { db: { host, port, name } } = require('../configs/config.mongodb')
const { countConnect } = require('../helpers/check.connect')

const CONNECT_STRING = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        // dev
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose
            .connect(CONNECT_STRING).then(_ => {
                console.log(`Connected Mongodb Success Advance: ${name}`)
                countConnect()
            })
            .catch(err => console.log(`Error Connect!: `, err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
