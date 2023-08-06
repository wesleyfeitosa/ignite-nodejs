import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { right, type Either } from '@/core/errors/either';
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionCommentsUseCaseRequest {
	page: number;
	questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>;

export class FetchQuestionCommentsUseCase {
	constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
			questionId,
			{ page },
		);

		return right({ questionComments });
	}
}
