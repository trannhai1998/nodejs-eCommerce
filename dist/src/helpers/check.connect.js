'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverload = exports.countConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const process_1 = __importDefault(require("process"));
const _SECOND_CHECK_OVERLOAD = 10000;
// Count Connect
const countConnect = () => {
    const numConnection = mongoose_1.default.connect.length;
    console.log('Number of connections::', numConnection);
};
exports.countConnect = countConnect;
// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose_1.default.connect.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process_1.default.memoryUsage().rss;
        // Example maximum number of connections base on number of cores
        const maxConnections = numCores * 5;
        // console.log(`=====================================`)
        // console.log(`Active connections: ${numConnection}`)
        // console.log(`Memory Usage:: ${memoryUsage / 1024 / 1024} MB`)
        // console.log(`=====================================`)
        if (numConnection > maxConnections) {
            console.log('Connection overload detected!');
        }
    }, _SECOND_CHECK_OVERLOAD); // Monitor every 5 seconds
};
exports.checkOverload = checkOverload;
