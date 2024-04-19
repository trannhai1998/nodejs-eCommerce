import RedisPubSubService from '../services/redisPubsub.service';

class ProductServiceTest {
	constructor() {}

	purchaseProduct(productId, quantity) {
		const order = {
			productId,
			quantity,
		};
		console.log('Run here 2 2 ');
		RedisPubSubService.publish('purchase_events', JSON.stringify(order));
	}
}

export default new ProductServiceTest();
