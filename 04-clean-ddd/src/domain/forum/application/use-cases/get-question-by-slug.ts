import { type Question } from '@/domain/forum/enterprise/entities/question';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { type Either, left, right } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/cases/resource-not-found-error';
import { type QuestionsRepository } from '../repositories/questions-repository';

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
