import { type Answer } from '@/domain/forum/enterprise/entities/answer';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { type AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type EditAnswerUseCaseResponse = Either<UseCaseError, { answer: Answer }>;

export class EditAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		authorId,
		answerId,
		content,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError());
		}

		answer.content = content;

		await this.answersRepository.save(answer);

		return right({ answer });
	}
}
