import { type QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseRquest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
}

export class EditQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({ authorId, questionId, title, content }: EditQuestionUseCaseRquest) {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			throw new Error('Question not found!');
		}

		if (authorId !== question.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		question.title = title;
		question.content = content;

		await this.questionsRepository.save(question);

		return { question };
	}
}
