import keyTokenModel from '../models/keyToken.model';
import { Types } from 'mongoose';

class KeyTokenService {
	static createKeyToken = async ({
		userId,
		publicKey,
		privateKey,
		refreshToken,
	}: {
		userId: any;
		publicKey: any;
		privateKey: any;
		refreshToken?: any;
	}) => {
		try {
			const filter = { user: userId },
				update = {
					publicKey,
					privateKey,
					refreshTokenUsed: [],
					refreshToken,
				},
				options = { upsert: true, new: true };

			const tokens = await keyTokenModel.findOneAndUpdate(
				filter,
				update,
				options,
			);
			return tokens ? tokens?.publicKey : null;
		} catch (err) {
			return err;
		}
	};

	static findKeyTokenByUserId = async (userId: string): Promise<any> => {
		return await keyTokenModel.findOne({
			user: new Types.ObjectId(userId),
		});
	};

	static removeKeyById = async (id: string): Promise<any> => {
		return await keyTokenModel.findByIdAndDelete(id);
	};

	static findByRefreshTokenUsed = async (
		refreshToken: string,
	): Promise<any> => {
		return await keyTokenModel
			.findOne({ refreshTokenUsed: refreshToken })
			.lean();
	};

	static deleteKeyById = async (userId: string): Promise<any> => {
		return await keyTokenModel.deleteOne({
			user: new Types.ObjectId(userId),
		});
	};

	static findByRefreshToken = async (refreshToken: string): Promise<any> => {
		return await keyTokenModel.findOne({ refreshToken });
	};
}

export default KeyTokenService;
