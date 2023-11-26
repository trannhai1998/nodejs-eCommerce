import * as redis from 'redis'
import { promisify } from 'util';
import { reservationInventory } from '../models/repositories/inventory.repo';

const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

// Khoá Lạc Quan
const acquireLock = async (productId, quantity, cartId) => {
	const key = `lock_v2023_${productId}`;
	const retryTimes = 10;
	const expireTime = 3000; // 3 second => lock.

	for (let index = 0; index < retryTimes; index++) {
		// Create 1 key, Who take it will go to order
		const result = await setNXAsync(key, expireTime);
		console.log(`result:::`, result);
		if (result === 1) {
			// thao tac vs inventory
			const isReservation = await reservationInventory({
				productId,
				quantity,
				cartId,
			});
			if (!!isReservation.modifiedCount) {
				await pExpire(key, expireTime);
                return key;
			}
			return null;
		} else {
			await new Promise((resolve) => {
				setTimeout(resolve, 50);
			});
		}
	}
};

const releaseLock = async (keyLock) => {
	const deleteAsyncKey = promisify(redisClient.del).bind(redisClient);
	return await deleteAsyncKey(keyLock);
};

export { acquireLock, releaseLock };
