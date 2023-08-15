import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { type AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/cases/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';

interface DeleteAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<UseCaseError, {}>;

export class DeleteAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		authorId,
		answerId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError());
		}

		await this.answersRepository.delete(answer);

		return right({});
	}
}
