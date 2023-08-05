import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

export class CommentOnAnswerUseCase {
	constructor(
		private readonly answersRepository: AnswersRepository,
		private readonly answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found!');
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityid(authorId),
			answerId: new UniqueEntityid(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return { answerComment };
	}
}
