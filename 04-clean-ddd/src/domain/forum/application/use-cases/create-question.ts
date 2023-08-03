import { Question } from '@/domain/forum/enterprise/entities/questions';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseRquest {
	authorId: string;
	title: string;
	content: string;
}

export class CreateQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ authorId, title, content }: CreateQuestionUseCaseRquest) {
		const question = Question.create({ authorId: new UniqueEntityid(authorId), title, content });

		await this.questionsRepository.create(question);

		return { question };
	}
}
