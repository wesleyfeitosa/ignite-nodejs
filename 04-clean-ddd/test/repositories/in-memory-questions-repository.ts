import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	async create(question: Question) {
		this.items.push(question);
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

	async delete(question: Question) {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(questionIndex, 1);
	}
}
