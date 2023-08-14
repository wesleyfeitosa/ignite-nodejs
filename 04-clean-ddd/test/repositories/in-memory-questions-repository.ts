import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { type QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(private readonly questionAttachmentsRepository: QuestionAttachmentsRepository) {}

	async create(question: Question) {
		this.items.push(question);
	}

	async bulkCreate(data: Question[]) {
		const createdItems: Question[] = [];

		for (const dataItem of data) {
			createdItems.push(dataItem);
			this.items.push(dataItem);
		}

		return createdItems.length;
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[questionIndex] = question;
	}

	async findBySlug(slug: string) {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}

		return question;
	}

	async findById(id: string) {
		const question = this.items.find((item) => item.id.toString() === id);

		if (!question) {
			return null;
		}

		return question;
	}

	async findManyRecent({ page }: PaginationParams) {
		const ITEMS_BY_PAGE = 20;

		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * ITEMS_BY_PAGE, page * ITEMS_BY_PAGE);

		return questions;
	}

	async delete(question: Question) {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(questionIndex, 1);

		await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
	}
}
