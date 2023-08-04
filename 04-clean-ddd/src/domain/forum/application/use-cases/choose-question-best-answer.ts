import { type QuestionsRepository } from '../repositories/questions-repository';
import { type AnswersRepository } from '../repositories/answers-repository';

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private readonly answersRepository: AnswersRepository,
		private readonly questionsRepository: QuestionsRepository,
	) {}

	async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found!');
		}

		const question = await this.questionsRepository.findById(answer.questionId.toString());

		if (!question) {
			throw new Error('Question not found!');
		}

		if (authorId !== question.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return { question };
	}
}
