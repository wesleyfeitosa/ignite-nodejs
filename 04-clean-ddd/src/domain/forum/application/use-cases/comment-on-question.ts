import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionComment } from '../../enterprise/entities/question-comment';

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

export class CommentOnQuestionUseCase {
	constructor(
		private readonly questionsRepository: QuestionsRepository,
		private readonly questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest) {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			throw new Error('Question not found!');
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityid(authorId),
			questionId: new UniqueEntityid(questionId),
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return { questionComment };
	}
}
