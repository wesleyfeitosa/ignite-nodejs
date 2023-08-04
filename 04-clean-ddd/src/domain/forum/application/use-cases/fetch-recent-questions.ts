import { type QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsRequest {
	page: number;
}

export class FetchRecentQuestionsUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ page }: FetchRecentQuestionsRequest) {
		const questions = await this.questionsRepository.findManyRecent({ page });

		return { questions };
	}
}
