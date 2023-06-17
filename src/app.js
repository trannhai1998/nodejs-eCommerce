require('dotenv').config()

const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');



// Init Middleware
app.use(morgan("dev")) // Show info request (IP, status, request by, request where - Postman, chrome....)
app.use(helmet()) // Protection (curl http://localhost:3000 --include)
app.use(compression()) // Zip Faster payload (small size)
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// app.use(morgan("combined"))
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))

// Init DB
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect')
checkOverload()
// Init Router
app.use('/', require('./routers'))

// Handling error
// 404
app.use((req, res, next) => {
    const error = new Error('Not found');

    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error?.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error?.stack,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;