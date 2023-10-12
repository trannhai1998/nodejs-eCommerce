'use strict';

import mongoose from 'mongoose';
import config from '../configs/config.mongodb';
import { countConnect } from '../helpers/check.connect';

const CONNECT_STRING: string = `mongodb://${config.db?.host}:${config?.db.port}/${config?.db.name}`;

class Database {
    private static instance: any;

    private constructor() {
        this.connect();
    }

    private connect(type = 'mongodb'): void {
        // dev
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        console.log(CONNECT_STRING);
        mongoose
            .connect(CONNECT_STRING)
            .then(() => {
                console.log(`Connected Mongodb Success Advance: ${config?.db.name}`);
                countConnect();
            })
            .catch((err: Error) => console.log(`Error Connect!: `, err));
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb: Database = Database.getInstance();

export default instanceMongodb;