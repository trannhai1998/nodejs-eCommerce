'use strict'

import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const _SECOND_CHECK_OVERLOAD: number = 10000;

// Count Connect
const countConnect = (): void => {
    const numConnection: number = mongoose.connect.length;
    console.log('Number of connections::', numConnection);
}

// Check overload
const checkOverload = (): void => {
    setInterval(() => {
        const numConnection: number = mongoose.connect.length;
        const numCores: number = os.cpus().length;
        const memoryUsage: number = process.memoryUsage().rss;
        // Example maximum number of connections base on number of cores
        const maxConnections: number = numCores * 5;

        // console.log(`=====================================`)
        // console.log(`Active connections: ${numConnection}`)
        // console.log(`Memory Usage:: ${memoryUsage / 1024 / 1024} MB`)
        // console.log(`=====================================`)

        if (numConnection > maxConnections) {
            console.log('Connection overload detected!');
        }
    }, _SECOND_CHECK_OVERLOAD) // Monitor every 5 seconds
}

export {
    countConnect,
    checkOverload
};