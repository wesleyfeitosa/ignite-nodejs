import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';

describe('Choose question best answer', () => {
	let answerRepository: InMemoryAnswersRepository;
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: ChooseQuestionBestAnswerUseCase;

	beforeEach(() => {
		answerRepository = new InMemoryAnswersRepository();
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new ChooseQuestionBestAnswerUseCase(answerRepository, questionsRepository);
	});

	it('should be able to choose the best answer of a question', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), questionId: questionCreated.id },
			new UniqueEntityid('answer-01'),
		);
		await answerRepository.create(answerCreated);

		await sut.execute({
			authorId: 'author-01',
			answerId: 'answer-01',
		});

		expect(questionsRepository.items[0].bestAnswerId).toEqual(answerCreated.id);
	});

	it('should not be able to choose the best answer of a question from another author', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const answerCreated = makeAnswer(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('answer-01'),
		);
		await answerRepository.create(answerCreated);

		await expect(async () =>
			sut.execute({
				authorId: 'author-02',
				answerId: 'answer-01',
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
