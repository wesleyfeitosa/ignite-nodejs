import { type QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionBySlugRequest {
	slug: string;
}

export class GetQuestionBySlugUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ slug }: GetQuestionBySlugRequest) {
		const question = await this.questionsRepository.findBySlug(slug);

		if (!question) {
			throw new Error('Question not found!');
		}

		return { question };
	}
}
