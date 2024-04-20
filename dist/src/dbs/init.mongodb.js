'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_mongodb_1 = __importDefault(require("../configs/config.mongodb"));
const check_connect_1 = require("../helpers/check.connect");
const CONNECT_STRING = `mongodb://${(_a = config_mongodb_1.default.db) === null || _a === void 0 ? void 0 : _a.host}:${config_mongodb_1.default === null || config_mongodb_1.default === void 0 ? void 0 : config_mongodb_1.default.db.port}/${config_mongodb_1.default === null || config_mongodb_1.default === void 0 ? void 0 : config_mongodb_1.default.db.name}`;
class Database {
    constructor() {
        this.connect();
    }
    connect(type = 'mongodb') {
        // dev
        if (1 === 1) {
            mongoose_1.default.set('debug', true);
            mongoose_1.default.set('debug', { color: true });
        }
        console.log(CONNECT_STRING);
        mongoose_1.default
            .connect(CONNECT_STRING)
            .then(() => {
            console.log(`Connected Mongodb Success Advance: ${config_mongodb_1.default === null || config_mongodb_1.default === void 0 ? void 0 : config_mongodb_1.default.db.name}`);
            (0, check_connect_1.countConnect)();
        })
            .catch((err) => console.log(`Error Connect!: `, err));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance();
exports.default = instanceMongodb;
