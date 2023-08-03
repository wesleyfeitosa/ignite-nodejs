import { type AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerUseCaseRquest {
	authorId: string;
	answerId: string;
	content: string;
}

export class EditAnswerUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({ authorId, answerId, content }: EditAnswerUseCaseRquest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found!');
		}

		if (authorId !== answer.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		answer.content = content;

		await this.answersRepository.save(answer);

		return {};
	}
}
