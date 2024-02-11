import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen';
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { type EventHandler } from '@/core/events/event-handler';
import { DomainEvents } from '@/core/events/domain-events';
import { type SendNotificationUseCase } from '../use-cases/send-notification';

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private readonly answersRepository: AnswersRepository,
		private readonly sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		// Subscribe to events
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		);
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent): Promise<void> {
		console.log(
			'Best answer chosen for question with id:',
			question.id.toString(),
		);

		const answer = await this.answersRepository.findById(
			bestAnswerId.toString(),
		);

		if (!answer) {
			throw new Error('Answer not found');
		}

		await this.sendNotificationUseCase.execute({
			recipientId: answer.authorId.toString(),
			title:
				`Your answer was chosen as the best for question: ${question.title}`
					.substring(0, 40)
					.concat('...'),
			content: answer.excerpt,
		});
	}
}
