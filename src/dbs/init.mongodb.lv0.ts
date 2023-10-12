import mongoose, { ConnectOptions } from 'mongoose';

const CONNECT_STRING = `mongodb://127.0.0.1:27017/myShop`;

mongoose
	.connect(CONNECT_STRING)
	.then(() => console.log('Connected Mongodb Success'))
	.catch((err: Error) => console.log('Error Connect!: ', err));

export default mongoose;
