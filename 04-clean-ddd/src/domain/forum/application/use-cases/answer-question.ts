import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseRquest {
	instructorId: string;
	questionId: string;
	content: string;
}

export class AnswerQuestionUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRquest) {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityid(instructorId),
			questionId: new UniqueEntityid(questionId),
		});

		await this.answersRepository.create(answer);

		return { answer };
	}
}
