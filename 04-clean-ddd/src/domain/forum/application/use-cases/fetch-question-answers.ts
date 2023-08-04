import { type AnswersRepository } from '../repositories/answers-repository';

interface FetchQuestionAnswersRequest {
	page: number;
	questionId: string;
}

export class FetchQuestionAnswersUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({ page, questionId }: FetchQuestionAnswersRequest) {
		const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

		return { answers };
	}
}
