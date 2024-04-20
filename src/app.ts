import dotenv from 'dotenv';
dotenv.config();
import Routers from './routers';
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { checkOverload } from './helpers/check.connect';
import ProductTestService from './tests/product.test';
import InventoryTestService from './tests/inventory.test';

const app: Application = express();

// Init Middleware
app.use(morgan('dev')); // Show info request (IP, status, request by, request where - Postman, chrome....)
app.use(helmet()); // Protection (curl http://localhost:3000 --include)
app.use(compression()); // Zip Faster payload (small size)
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
// Test pub sub redis
// require('./tests/inventory.test');
// const productTest = require('./tests/product.test');
// ProductTestService.purchaseProduct('product:001', 1);

// Init DB
require('./dbs/init.mongodb');

checkOverload();

// Init Router
app.use('/', Routers);

// Handling error
// 404
app.use((req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Not found');

	// error.name .status = 404;
	next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	const statusCode = error?.status || 500;
	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		stack: error?.stack,
		message: error.message || 'Internal Server Error',
	});
});

export default app;
