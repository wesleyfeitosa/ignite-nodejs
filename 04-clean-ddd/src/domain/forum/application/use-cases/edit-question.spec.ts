import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { EditQuestionUseCase } from './edit-question';

describe('Edit question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: EditQuestionUseCase;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new EditQuestionUseCase(questionsRepository);
	});

	it('should be able to edit a question', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01'), title: 'Old title', content: 'Old content' },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		await sut.execute({
			authorId: 'author-01',
			questionId: 'question-01',
			title: 'New title',
			content: 'New content',
		});

		expect(questionsRepository.items[0]).toMatchObject({
			title: 'New title',
			content: 'New content',
		});
	});

	it('should not be able to edit a question from another author', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01'), title: 'Old title', content: 'old content' },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			questionId: 'question-01',
			title: 'New title',
			content: 'New content',
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
