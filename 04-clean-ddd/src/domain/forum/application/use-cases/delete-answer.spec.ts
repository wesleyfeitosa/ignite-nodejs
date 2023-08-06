import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { DeleteAnswerUseCase } from './delete-answer';

describe('Delete answer', () => {
	let answerRepository: InMemoryAnswersRepository;
	let sut: DeleteAnswerUseCase;

	beforeEach(() => {
		answerRepository = new InMemoryAnswersRepository();
		sut = new DeleteAnswerUseCase(answerRepository);
	});

	it('should be able to delete an answer', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('answer-01'),
		);
		await answerRepository.create(answerCreated);

		await sut.execute({
			authorId: 'author-01',
			answerId: 'answer-01',
		});

		expect(answerRepository.items).toHaveLength(0);
	});

	it('should not be able to delete an answer from another author', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('answer-01'),
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
