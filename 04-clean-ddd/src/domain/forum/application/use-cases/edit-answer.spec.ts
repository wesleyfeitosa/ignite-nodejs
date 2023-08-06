import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { EditAnswerUseCase } from './edit-answer';

describe('Edit answer', () => {
	let answersRepository: InMemoryAnswersRepository;
	let sut: EditAnswerUseCase;

	beforeEach(() => {
		answersRepository = new InMemoryAnswersRepository();
		sut = new EditAnswerUseCase(answersRepository);
	});

	it('should be able to edit a answer', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), content: 'Old content' },
			new UniqueEntityid('answer-01'),
		);
		await answersRepository.create(answerCreated);

		await sut.execute({
			authorId: 'author-01',
			answerId: 'answer-01',
			content: 'New content',
		});

		expect(answersRepository.items[0]).toMatchObject({
			content: 'New content',
		});
	});

	it('should not be able to edit a answer from another author', async () => {
		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), content: 'old content' },
			new UniqueEntityid('answer-01'),
		);
		await answersRepository.create(answerCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			answerId: 'answer-01',
			content: 'New content',
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
