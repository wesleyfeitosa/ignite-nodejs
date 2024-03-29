import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

describe('Fetch answer comments', () => {
	let answerCommentsRepository: InMemoryAnswerCommentsRepository;
	let answersRepository: InMemoryAnswersRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: FetchAnswerCommentsUseCase;

	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
		sut = new FetchAnswerCommentsUseCase(answerCommentsRepository);
	});

	it('should be able to fetch answer answercomments', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const answercommentCreated1 = makeAnswerComment({
			authorId: answerCreated.authorId,
			answerId: answerCreated.id,
		});
		await answerCommentsRepository.create(answercommentCreated1);
		const answercommentCreated2 = makeAnswerComment({
			authorId: answerCreated.authorId,
			answerId: new UniqueEntityId('answer-02'),
		});
		await answerCommentsRepository.create(answercommentCreated2);
		const answercommentCreated3 = makeAnswerComment({
			authorId: answerCreated.authorId,
			answerId: answerCreated.id,
		});
		await answerCommentsRepository.create(answercommentCreated3);

		const result = await sut.execute({
			answerId: answerCreated.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(2);
	});

	it('should be able to fetch answer answercomments by page', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeAnswerComment({ answerId: answerCreated.id }));
		}

		await answerCommentsRepository.bulkCreate(data);

		const result = await sut.execute({
			page: 2,
			answerId: answerCreated.id.toString(),
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(2);
	});
});
