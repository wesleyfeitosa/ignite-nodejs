import { type AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseRquest {
	authorId: string;
	answerId: string;
}

export class DeleteAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({ authorId, answerId }: DeleteAnswerUseCaseRquest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found!');
		}

		if (authorId !== answer.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		await this.answersRepository.delete(answer);

		return {};
	}
}
