import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

describe('Fetch question answers', () => {
	let answersRepository: InMemoryAnswersRepository;
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
	let sut: FetchQuestionAnswersUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
		sut = new FetchQuestionAnswersUseCase(answersRepository);
	});

	it('should be able to fetch question answers', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const answerCreated1 = makeAnswer(
			{ authorId: new UniqueEntityId('author-01'), questionId: questionCreated.id },
			new UniqueEntityId('answer-01'),
		);
		await answersRepository.create(answerCreated1);
		const answerCreated2 = makeAnswer(
			{ authorId: new UniqueEntityId('author-01'), questionId: new UniqueEntityId('question-02') },
			new UniqueEntityId('answer-01'),
		);
		await answersRepository.create(answerCreated2);
		const answerCreated3 = makeAnswer(
			{ authorId: new UniqueEntityId('author-01'), questionId: questionCreated.id },
			new UniqueEntityId('answer-01'),
		);
		await answersRepository.create(answerCreated3);

		const result = await sut.execute({
			questionId: questionCreated.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(2);
	});

	it('should be able to fetch question answers by page', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeAnswer({ questionId: questionCreated.id }));
		}

		await answersRepository.bulkCreate(data);

		const result = await sut.execute({ page: 2, questionId: questionCreated.id.toString() });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(2);
	});
});
