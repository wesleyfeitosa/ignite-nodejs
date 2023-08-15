import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/cases/resource-not-found-error';

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<UseCaseError, { answerComment: AnswerComment }>;

export class CommentOnAnswerUseCase {
	constructor(
		private readonly answersRepository: AnswersRepository,
		private readonly answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({ answerComment });
	}
}
