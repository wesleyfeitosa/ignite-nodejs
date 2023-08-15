import { type Notification } from '@/domain/notification/enterprise/entities/notification';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/cases/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { type NotificationsRepository } from '../repositories/notifications-repository';

interface ReadNotificationUseCaseRequest {
	recipientId: string;
	notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<UseCaseError, { notification: Notification }>;

export class ReadNotificationUseCase {
	constructor(private readonly notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification = await this.notificationsRepository.findById(notificationId);

		if (!notification) {
			return left(new ResourceNotFoundError());
		}

		if (recipientId !== notification.recipientId.toString()) {
			return left(new NotAllowedError());
		}

		notification.read();

		await this.notificationsRepository.save(notification);

		return right({ notification });
	}
}
