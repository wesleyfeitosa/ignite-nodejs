import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { SendNotificationUseCase } from './send-notification';

describe('Send notification', () => {
	let notificationsRepository: InMemoryNotificationsRepository;
	let sut: SendNotificationUseCase;

	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(notificationsRepository);
	});

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: '1',
			content: 'This is a relative notification',
			title: 'New notification',
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.notification.title).toEqual('New notification');
		expect(notificationsRepository.items[0].id).toEqual(result.value?.notification.id);
	});
});
