import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestion } from 'test/factories/make-question';

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

describe('Fetch recent questions', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: FetchRecentQuestionsUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
		sut = new FetchRecentQuestionsUseCase(questionsRepository);
	});

	it('should be able to fetch recent questions', async () => {
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }));
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }));
		await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }));

		const result = await sut.execute({ page: 1 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questions).toHaveLength(3);
		expect(result.value?.questions).toEqual([
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

		const result = await sut.execute({ page: 2 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questions).toHaveLength(2);
		expect(result.value?.questions).toEqual([
			expect.objectContaining({ title: 'Title test' }),
			expect.objectContaining({ title: 'Title test' }),
		]);
	});
});
