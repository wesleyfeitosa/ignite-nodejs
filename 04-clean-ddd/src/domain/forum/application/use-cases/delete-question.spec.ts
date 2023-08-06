import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { DeleteQuestionUseCase } from './delete-question';

describe('Delete question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: DeleteQuestionUseCase;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new DeleteQuestionUseCase(questionsRepository);
	});

	it('should be able to delete a question', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		await sut.execute({
			authorId: 'author-01',
			questionId: 'question-01',
		});

		expect(questionsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question from another author', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			questionId: 'question-01',
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
