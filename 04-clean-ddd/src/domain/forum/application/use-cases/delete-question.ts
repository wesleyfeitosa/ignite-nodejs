import { type QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionUseCaseRquest {
	authorId: string;
	questionId: string;
}

export class DeleteQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ authorId, questionId }: DeleteQuestionUseCaseRquest) {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			throw new Error('Question not found!');
		}

		if (authorId !== question.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		await this.questionsRepository.delete(question);

		return {};
	}
}
