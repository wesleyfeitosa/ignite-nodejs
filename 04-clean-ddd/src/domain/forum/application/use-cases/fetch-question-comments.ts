import { type QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionCommentsRequest {
	page: number;
	questionId: string;
}

export class FetchQuestionCommentsUseCase {
	constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({ page, questionId }: FetchQuestionCommentsRequest) {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
			questionId,
			{ page },
		);

		return { questionComments };
	}
}
