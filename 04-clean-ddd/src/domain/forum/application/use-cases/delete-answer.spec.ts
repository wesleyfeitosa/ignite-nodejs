import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { makeAnswer } from 'test/factories/make-answer';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeleteAnswerUseCase } from './delete-answer';

describe('Delete answer', () => {
	let answerRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: DeleteAnswerUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
		sut = new DeleteAnswerUseCase(answerRepository);
	});

	it('should be able to delete an answer', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('answer-01'),
		);
		await answerRepository.create(answerCreated);

		answerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: answerCreated.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: answerCreated.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		await sut.execute({
			authorId: 'author-01',
			answerId: 'answer-01',
		});

		expect(answerRepository.items).toHaveLength(0);
		expect(answerAttachmentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete an answer from another author', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('answer-01'),
		);
		await answerRepository.create(answerCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			answerId: 'answer-01',
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
