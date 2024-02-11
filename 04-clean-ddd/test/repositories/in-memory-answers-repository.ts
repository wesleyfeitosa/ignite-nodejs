import { type Answer } from '@/domain/forum/enterprise/entities/answer';
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { type AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { type PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(
		private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async create(answer: Answer) {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async bulkCreate(data: Answer[]) {
		const createdItems: Answer[] = [];

		for (const dataItem of data) {
			createdItems.push(dataItem);
			this.items.push(dataItem);

			DomainEvents.dispatchEventsForAggregate(dataItem.id);
		}

		return createdItems.length;
	}

	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items[answerIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async findById(id: string) {
		const answer = this.items.find((item) => item.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const ITEMS_BY_PAGE = 20;

		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * ITEMS_BY_PAGE, page * ITEMS_BY_PAGE);

		return answers;
	}

	async delete(answer: Answer) {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items.splice(answerIndex, 1);

		await this.answerAttachmentsRepository.deleteManyByAnswerId(
			answer.id.toString(),
		);
	}
}
