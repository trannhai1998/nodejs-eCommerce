'use strict';

import shopModel from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair, verifyJWT } from '../auth/authUtils';
import { getInfoData } from '../utils';
import {
	BadRequestError,
	ConflictRequestError,
	AuthFailureError,
	ForbiddenError,
} from '../core/error.response';
import { findByEmail } from '../services/shop.service';

interface Shop {
	_id: string;
	name: string;
	email: string;
}

const ROLE_SHOP = {
	SHOP: 'SHOP',
	WRITER: 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
};

class AccessService {
	static logout = async (keyStore): Promise<boolean> => {
        console.log('Logout')
		const delKey: boolean = await KeyTokenService.removeKeyById(
			keyStore._id,
		);
        
		return delKey;
	};

	/*
        1- Check email in dbs.
        2- match Password.
        3- create access token & refresh token and save.
        4- generate tokens.
        5- get Data return login
    */
	static login = async ({
		email,
		password,
	}: // refreshToken = null,
	{
		email: string;
		password: string;
		refreshToken?: string;
	}) => {
		//1
		const foundShop = await findByEmail({ email });
		if (!foundShop) {
			throw new BadRequestError('Shop not registered!');
		}
		//2
		const match: boolean = await bcrypt.compare(
			password,
			foundShop.password,
		);
		if (!match) {
			throw new AuthFailureError('Authentication error');
		}
		//3
		// Create privateKey, publicKey.
		const privateKey: string = crypto.randomBytes(64).toString('hex');
		const publicKey: string = crypto.randomBytes(64).toString('hex');
		const { _id: userId } = foundShop;
		//4- generate tokens.
		const tokens = await createTokenPair(
			{ userId, email },
			publicKey,
			privateKey,
		);
		await KeyTokenService.createKeyToken({
			privateKey,
			publicKey,
			refreshToken: tokens?.refreshToken,
			userId,
		});
		return {
			shop: getInfoData({
				fields: ['_id', 'name', 'email'],
				object: foundShop,
			}),
			tokens,
		};
	};

	static signUp = async ({
		name,
		email,
		password,
	}: {
		name: string;
		email: string;
		password: string;
	}) => {
		try {
			// Step 1: check email exists?
			const holderShop: Shop | null = await shopModel
				.findOne({ email })
				.lean(); // Lean help query faster => tra? ve object js nhe. hon neu ko co lean

			if (holderShop) {
				throw new BadRequestError('Error: Shop already registered!');
			}
			// ma hoa password
			const passwordHash: string = await bcrypt.hash(password, 6);

			const newShop = await shopModel.create({
				name,
				email,
				password: passwordHash,
				roles: [ROLE_SHOP.SHOP],
			});
			if (newShop) {
				// Created privateKey, publicKey
				// level advance: amazon...
				// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { // rsa: bat doi xung
				//     modulusLength: 4096,
				//     publicKeyEncoding: {
				//         type: 'pkcs1', // Public key cryptoGraphy Standards
				//         format: 'pem'
				//     },
				//     privateKeyEncoding: {
				//         type: 'pkcs1', // Public key cryptoGraphy Standards
				//         format: 'pem'
				//     }
				// })

				const privateKey: string = crypto
					.randomBytes(64)
					.toString('hex');
				const publicKey: string = crypto
					.randomBytes(64)
					.toString('hex');

				const keyStore = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
					privateKey,
				});
				if (!keyStore) {
					return {
						status: 'xxxxx',
						message: 'Key Store error',
					};
				}
				const tokens = await createTokenPair(
					{ userId: newShop._id, email },
					publicKey,
					privateKey,
				);
				return {
					code: 201,
					metadata: {
						shop: getInfoData({
							fields: ['_id', 'name', 'email'],
							object: newShop,
						}),
						tokens,
					},
				};
			}

			return {
				code: 200,
				metadata: null,
			};
		} catch (error: any) {
			console.error(error);
			return {
				code: 'xxx',
				message: error?.message,
				status: 'error',
			};
		}
	};

	/**
	 *
	 * @param {*} refreshToken
	 * Check this token used?
	 */
	static handlerRefreshTokenV2 = async ({
		keyStore,
		user,
		refreshToken,
	}: {
		keyStore;
		user;
		refreshToken: string;
	}) => {
		console.log(user);
		const { userId, email } = user;

		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenService.deleteKeyById(userId);

			throw new ForbiddenError(
				'Something wrong happened! Please login again',
			);
		}

		if (keyStore.refreshToken !== refreshToken) {
			throw new AuthFailureError('Shop not Registered');
		}
		const foundShop = await findByEmail({ email });
		if (!foundShop) {
			throw new AuthFailureError('Shop not registered');
		}
		// Create new token
		const tokens = await createTokenPair(
			{ userId, email },
			keyStore.publicKey,
			keyStore.privateKey,
		);
		// Update token
		console.log('Run here', keyStore);

		await keyStore.updateOne({
			$set: {
				refreshToken: tokens?.refreshToken,
			},
			$addToSet: {
				refreshTokenUsed: refreshToken, // Add token used to refreshTokenUsed field
			},
		});
		return {
			user,
			tokens,
		};
	};
}

export default AccessService;
