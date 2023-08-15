import { faker } from '@faker-js/faker';

import {
	Notification,
	type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return notification;
}
