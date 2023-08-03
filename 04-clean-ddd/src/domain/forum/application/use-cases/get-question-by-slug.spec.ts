import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { GetQuestionBySlug } from './get-question-by-slug';

describe('Get question by slug', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: GetQuestionBySlug;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new GetQuestionBySlug(questionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const questionCreated = makeQuestion({
			slug: Slug.create('new-question'),
		});
		await questionsRepository.create(questionCreated);

		const { question } = await sut.execute({
			slug: 'new-question',
		});

		expect(question.id).toBeTruthy();
		expect(question.title).toEqual(questionCreated.title);
		expect(question.slug.value).toEqual('new-question');
	});
});
