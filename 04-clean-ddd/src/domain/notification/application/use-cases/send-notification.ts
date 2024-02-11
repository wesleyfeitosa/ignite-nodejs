import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { right, type Either } from '@/core/errors/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{ notification: Notification }
>;

export class SendNotificationUseCase {
	constructor(
		private readonly notificationsRepository: NotificationsRepository,
	) {}

	async execute({
		content,
		recipientId,
		title,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			content,
			recipientId: new UniqueEntityId(recipientId),
			title,
		});

		await this.notificationsRepository.create(notification);

		return right({ notification });
	}
}
