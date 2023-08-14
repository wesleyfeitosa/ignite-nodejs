import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';

describe('Aswer question', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: AnswerQuestionUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
		sut = new AnswerQuestionUseCase(answersRepository);
	});

	it('should be able to answer a question', async () => {
		const result = await sut.execute({
			content: 'New answer',
			instructorId: '1',
			questionId: '1',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBeTruthy();
		expect(answersRepository.items[0]).toEqual(result.value?.answer);
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
