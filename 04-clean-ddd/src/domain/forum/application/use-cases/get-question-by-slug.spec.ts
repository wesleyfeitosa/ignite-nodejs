import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestion } from 'test/factories/make-question';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';

describe('Get question by slug', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: GetQuestionBySlugUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
		sut = new GetQuestionBySlugUseCase(questionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const questionCreated = makeQuestion({
			slug: Slug.create('new-question'),
		});
		await questionsRepository.create(questionCreated);

		const result = await sut.execute({
			slug: 'new-question',
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.question.title).toEqual(questionCreated.title);
			expect(result.value.question.slug.value).toEqual('new-question');
		}
	});
});
