import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { right, type Either } from '@/core/errors/either';
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
	page: number;
	answerId: string;
}

type FetchAnswerCommentsResponse = Either<null, { answerComments: AnswerComment[] }>;

export class FetchAnswerCommentsUseCase {
	constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsResponse> {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
			page,
		});

		return right({ answerComments });
	}
}
