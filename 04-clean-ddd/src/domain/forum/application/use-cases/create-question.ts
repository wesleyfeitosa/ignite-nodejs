import { Question } from '@/domain/forum/enterprise/entities/questions';
import { type Either, right } from '@/core/errors/either';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
}

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		title,
		content,
	}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({ authorId: new UniqueEntityid(authorId), title, content });

		await this.questionsRepository.create(question);

		return right({ question });
	}
}
