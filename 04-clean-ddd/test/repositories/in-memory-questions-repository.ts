import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	async create(question: Question): Promise<void> {
		this.items.push(question);
	}
}
