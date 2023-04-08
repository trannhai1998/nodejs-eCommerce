'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND_CHECK_OVERLOAD = 10000;
// Count Connect
const countConnect = () => {
    const numConnection = mongoose.connect.length;
    console.log('Number of connections::', numConnection);
}

// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connect.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections base on number of cores
        const maxConnections = numCores * 5;

        // console.log(`=====================================`)
        // console.log(`Active connections: ${numConnection}`)
        // console.log(`Memory Usage:: ${memoryUsage / 1024 / 1024} MB`)
        // console.log(`=====================================`)

        if (numConnection > maxConnections) {
            console.log('Connection overload detected!');
        }
    }, _SECOND_CHECK_OVERLOAD) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}