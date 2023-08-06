import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { AnswerQuestionUseCase } from './answer-question';

describe('Aswer question', () => {
	let answersRepository: InMemoryAnswersRepository;
	let sut: AnswerQuestionUseCase;

	beforeEach(() => {
		answersRepository = new InMemoryAnswersRepository();
		sut = new AnswerQuestionUseCase(answersRepository);
	});

	it('should be able to answer a question', async () => {
		const result = await sut.execute({
			content: 'New answer',
			instructorId: '1',
			questionId: '1',
		});

		expect(result.isRight()).toBeTruthy();
		expect(answersRepository.items[0]).toEqual(result.value?.answer);
	});
});
