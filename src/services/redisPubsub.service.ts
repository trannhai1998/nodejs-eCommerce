import * as redis from 'redis';

class RedisPubSubService {
	subscriber;
	publisher;
	constructor() {
		this.init();
		this.subscriber = redis.createClient();
		console.log('subscriber:::', this.subscriber);
		this.subscriber.on('ready', () => {
			console.log('Redis is ready');
		});

		this.publisher = redis.createClient();
	}

	async init() {
		console.log('Run here 3 3 ');
		const test = redis.createClient();
		test.connect()
			.then(() => {
				console.log('========Test:::', test.isReady);
			})
			.catch((err) => {
				console.log('========Test:::', err);
			});
	}

	publish(channel, message) {
		return new Promise((resolve, reject) => {
			console.log(channel, message);

			this.publisher.publish(channel, message, (err, reply) => {
				if (err) {
					console.log(err);

					reject(err);
				} else {
					resolve(reply);
				}
			});
		});
	}

	subscribe(channel, callback) {
		this.subscriber.subscribe(channel);
		this.subscriber.on('message', (subscriberChannel, message) => {
			if (channel === subscriberChannel) {
				callback(channel);
			}
		});
	}
}

export default new RedisPubSubService();
