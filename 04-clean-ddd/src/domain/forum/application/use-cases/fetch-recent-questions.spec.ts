import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

describe('Fetch recent questions', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: FetchRecentQuestionsUseCase;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new FetchRecentQuestionsUseCase(questionsRepository);
	});

	it('should be able to fetch recent questions', async () => {
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }));
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }));
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }));

		const { questions } = await sut.execute({ page: 1 });

		expect(questions).toHaveLength(3);
		expect(questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it('should be able to fetch recent questions by page', async () => {
		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeQuestion({ title: 'Title test' }));
		}

		await questionsRepository.bulkCreate(data);

		const { questions } = await sut.execute({ page: 2 });

		expect(questions).toBeTruthy();
		expect(questions).toHaveLength(2);
		expect(questions).toEqual([
			expect.objectContaining({ title: 'Title test' }),
			expect.objectContaining({ title: 'Title test' }),
		]);
	});
});
