import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsRequest {
	page: number;
	answerId: string;
}

export class FetchAnswerCommentsUseCase {
	constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({ page, answerId }: FetchAnswerCommentsRequest) {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
			page,
		});

		return { answerComments };
	}
}
