import RedisPubSubService from '../services/redisPubsub.service';

class InventoryServiceTest {
	constructor() {
		RedisPubSubService.subscribe('purchase_events', (channel, message) => {
			InventoryServiceTest.updateInventory(message);
		});
	}

	static updateInventory({ productId, quantity }) {
		console.log(`Updated inventory ${productId} with quantity ${quantity}`);
	}
}

export default new InventoryServiceTest();
