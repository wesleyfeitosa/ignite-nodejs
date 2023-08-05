import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswer } from 'test/factories/make-answer';

import { CommentOnAnswerUseCase } from './comment-on-answer';

describe('Comment on answer', () => {
	let answersRepository: InMemoryAnswersRepository;
	let answerCommentsRepository: InMemoryAnswerCommentsRepository;
	let sut: CommentOnAnswerUseCase;

	beforeEach(() => {
		answersRepository = new InMemoryAnswersRepository();
		answerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository);
	});

	it('should be able to comment on answer', async () => {
		const answerCreated = makeAnswer();
		await answersRepository.create(answerCreated);

		const { answerComment } = await sut.execute({
			content: 'This is a relative comment',
			authorId: answerCreated.authorId.toString(),
			answerId: answerCreated.id.toString(),
		});

		expect(answerComment.id).toBeTruthy();
		expect(answerComment.content).toEqual('This is a relative comment');
	});
});
