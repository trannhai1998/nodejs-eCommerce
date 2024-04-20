require('dotenv').config();

import app from './src/app';

const PORT = process.env.PORT || 3200;

const server = app.listen(PORT, () => {
	console.log('WSV Node start with port', PORT);
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Exit Server Express');
	});
	// notify.send(...ping)
});

process.on('unhandledRejection', (error, promise) => {
	console.log(`Logged Error: ${error}`);
	server.close(() => process.exit(1));
});
