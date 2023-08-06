import { type UseCaseError } from '@/core/errors/use-case-error';
import { type Either, left, right } from '@/core/errors/either';
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<UseCaseError, {}>;

export class DeleteAnswerCommentUseCase {
	constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

		if (!answerComment) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answerComment.authorId.toString()) {
			return left(new NotAllowedError());
		}

		await this.answerCommentsRepository.delete(answerComment);

		return right({});
	}
}
