import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<UseCaseError, { questionComment: QuestionComment }>;

export class CommentOnQuestionUseCase {
	constructor(
		private readonly questionsRepository: QuestionsRepository,
		private readonly questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityid(authorId),
			questionId: new UniqueEntityid(questionId),
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({ questionComment });
	}
}
