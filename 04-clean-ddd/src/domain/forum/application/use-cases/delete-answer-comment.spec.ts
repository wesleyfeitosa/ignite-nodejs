import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeAnswer } from 'test/factories/make-answer';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

describe('Delete answer comment comment', () => {
	let answerCommentsRepository: InMemoryAnswerCommentsRepository;
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: DeleteAnswerCommentUseCase;

	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
		sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
	});

	it('should be able to delete a answer comment', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const answerCommentCreated = makeAnswerComment({
			authorId: answerCreated.authorId,
			answerId: answerCreated.id,
		});
		await answerCommentsRepository.create(answerCommentCreated);

		await sut.execute({
			authorId: answerCreated.authorId.toString(),
			answerCommentId: answerCommentCreated.id.toString(),
		});

		expect(answerCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a answer comment from another author', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const answerCommentCreated = makeAnswerComment({
			authorId: new UniqueEntityId('author-01'),
			answerId: answerCreated.id,
		});
		await answerCommentsRepository.create(answerCommentCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			answerCommentId: answerCommentCreated.id.toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
