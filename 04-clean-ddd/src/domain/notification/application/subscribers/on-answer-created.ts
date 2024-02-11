import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { type EventHandler } from '@/core/events/event-handler';
import { DomainEvents } from '@/core/events/domain-events';
import { type SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
	constructor(
		private readonly questionsRepository: QuestionsRepository,
		private readonly sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		// Subscribe to events
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}

	private async sendNewAnswerNotification({
		answer,
	}: AnswerCreatedEvent): Promise<void> {
		console.log('New answer created with id:', answer.id.toString());

		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

		if (!question) {
			throw new Error('Question not found');
		}

		await this.sendNotificationUseCase.execute({
			recipientId: question.authorId.toString(),
			title: `New answer to your question: ${question.title}`
				.substring(0, 40)
				.concat('...'),
			content: answer.excerpt,
		});
	}
}
