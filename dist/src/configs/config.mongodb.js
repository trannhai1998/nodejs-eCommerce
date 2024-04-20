'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: '127.0.0.1',
//         port: 27017,
//         name: db
//     }
// }
// level 1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT,
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME,
    },
};
const prod = {
    app: {
        port: process.env.PROD_APP_PORT,
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        name: process.env.PROD_DB_NAME,
    },
};
const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';
console.log(config[env], env);
exports.default = config[env];
