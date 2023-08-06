import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

interface DeleteQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<UseCaseError, {}>;

export class DeleteQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		questionId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		await this.questionsRepository.delete(question);

		return right({});
	}
}
