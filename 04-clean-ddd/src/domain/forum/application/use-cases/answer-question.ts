import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { right, type Either } from '@/core/errors/either';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityid(instructorId),
			questionId: new UniqueEntityid(questionId),
		});

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
