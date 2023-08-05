import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

describe('Fetch answer comments', () => {
	let answerCommentsRepository: InMemoryAnswerCommentsRepository;
	let answersRepository: InMemoryAnswersRepository;
	let sut: FetchAnswerCommentsUseCase;

	beforeEach(() => {
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		answersRepository = new InMemoryAnswersRepository();
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
			answerId: new UniqueEntityid('answer-02'),
		});
		await answerCommentsRepository.create(answercommentCreated2);
		const answercommentCreated3 = makeAnswerComment({
			authorId: answerCreated.authorId,
			answerId: answerCreated.id,
		});
		await answerCommentsRepository.create(answercommentCreated3);

		const { answerComments } = await sut.execute({
			answerId: answerCreated.id.toString(),
			page: 1,
		});

		expect(answerComments).toHaveLength(2);
	});

	it('should be able to fetch answer answercomments by page', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeAnswerComment({ answerId: answerCreated.id }));
		}

		await answerCommentsRepository.bulkCreate(data);

		const { answerComments } = await sut.execute({
			page: 2,
			answerId: answerCreated.id.toString(),
		});

		expect(answerComments).toBeTruthy();
		expect(answerComments).toHaveLength(2);
	});
});
