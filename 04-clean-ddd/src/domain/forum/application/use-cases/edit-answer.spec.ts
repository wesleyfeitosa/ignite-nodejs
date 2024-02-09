import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { makeAnswer } from 'test/factories/make-answer';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EditAnswerUseCase } from './edit-answer';

describe('Edit answer', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: EditAnswerUseCase;

	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);

		sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
	});

	it('should be able to edit a answer', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityId('author-01'), content: 'Old content' },
			new UniqueEntityId('answer-01'),
		);
		await answersRepository.create(answerCreated);

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
			content: 'New content',
			attachmentsIds: ['1', '3'],
		});

		expect(answersRepository.items[0]).toMatchObject({
			content: 'New content',
		});
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a answer from another author', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityId('author-01'), content: 'old content' },
			new UniqueEntityId('answer-01'),
		);
		await answersRepository.create(answerCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			answerId: 'answer-01',
			content: 'New content',
			attachmentsIds: ['1', '3'],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
