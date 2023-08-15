import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makeNotification } from 'test/factories/make-notification';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { ReadNotificationUseCase } from './read-notification';

describe('Read notification', () => {
	let notificationsRepository: InMemoryNotificationsRepository;
	let sut: ReadNotificationUseCase;

	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository();
		sut = new ReadNotificationUseCase(notificationsRepository);
	});

	it('should be able to read a notification', async () => {
		const notificationCreated = makeNotification();
		await notificationsRepository.create(notificationCreated);

		const result = await sut.execute({
			recipientId: notificationCreated.recipientId.toString(),
			notificationId: notificationCreated.id.toString(),
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.notification.readAt).toEqual(expect.any(Date));
		}
	});

	it('should not be able to read a notification from another recipient', async () => {
		const notificationCreated = makeNotification();
		await notificationsRepository.create(notificationCreated);

		const result = await sut.execute({
			recipientId: '1',
			notificationId: notificationCreated.id.toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
