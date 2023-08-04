import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityid } from '@/core/entities/unique-entity-id';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

describe('Fetch question answers', () => {
	let answersRepository: InMemoryAnswersRepository;
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: FetchQuestionAnswersUseCase;

	beforeEach(() => {
		answersRepository = new InMemoryAnswersRepository();
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new FetchQuestionAnswersUseCase(answersRepository);
	});

	it('should be able to fetch question answers', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const answerCreated1 = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), questionId: questionCreated.id },
			new UniqueEntityid('answer-01'),
		);
		await answersRepository.create(answerCreated1);
		const answerCreated2 = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), questionId: new UniqueEntityid('question-02') },
			new UniqueEntityid('answer-01'),
		);
		await answersRepository.create(answerCreated2);
		const answerCreated3 = makeAnswer(
			{ authorId: new UniqueEntityid('author-01'), questionId: questionCreated.id },
			new UniqueEntityid('answer-01'),
		);
		await answersRepository.create(answerCreated3);

		const { answers } = await sut.execute({
			questionId: questionCreated.id.toString(),
			page: 1,
		});

		expect(answers).toHaveLength(2);
	});

	it('should be able to fetch question answers by page', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityid('author-01') },
			new UniqueEntityid('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeAnswer({ questionId: questionCreated.id }));
		}

		await answersRepository.bulkCreate(data);

		const { answers } = await sut.execute({ page: 2, questionId: questionCreated.id.toString() });

		expect(answers).toBeTruthy();
		expect(answers).toHaveLength(2);
	});
});
