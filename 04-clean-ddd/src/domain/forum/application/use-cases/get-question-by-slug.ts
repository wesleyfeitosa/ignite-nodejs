import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { type Either, left, right } from '@/core/errors/either';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<UseCaseError, { question: Question }>;

export class GetQuestionBySlugUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.findBySlug(slug);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		return right({ question });
	}
}
