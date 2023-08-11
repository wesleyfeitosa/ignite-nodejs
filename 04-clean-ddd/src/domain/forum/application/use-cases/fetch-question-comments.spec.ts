import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { makeQuestion } from 'test/factories/make-question';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

describe('Fetch question comments', () => {
	let questioncommentsRepository: InMemoryQuestionCommentsRepository;
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: FetchQuestionCommentsUseCase;

	beforeEach(() => {
		questioncommentsRepository = new InMemoryQuestionCommentsRepository();
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new FetchQuestionCommentsUseCase(questioncommentsRepository);
	});

	it('should be able to fetch question questioncomments', async () => {
		const questionCreated = makeQuestion();
		await questionsRepository.create(questionCreated);

		const questioncommentCreated1 = makeQuestionComment({
			authorId: questionCreated.authorId,
			questionId: questionCreated.id,
		});
		await questioncommentsRepository.create(questioncommentCreated1);
		const questioncommentCreated2 = makeQuestionComment({
			authorId: questionCreated.authorId,
			questionId: new UniqueEntityId('question-02'),
		});
		await questioncommentsRepository.create(questioncommentCreated2);
		const questioncommentCreated3 = makeQuestionComment({
			authorId: questionCreated.authorId,
			questionId: questionCreated.id,
		});
		await questioncommentsRepository.create(questioncommentCreated3);

		const result = await sut.execute({
			questionId: questionCreated.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questionComments).toHaveLength(2);
	});

	it('should be able to fetch question questioncomments by page', async () => {
		const questionCreated = makeQuestion();
		await questionsRepository.create(questionCreated);

		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push(makeQuestionComment({ questionId: questionCreated.id }));
		}

		await questioncommentsRepository.bulkCreate(data);

		const result = await sut.execute({
			page: 2,
			questionId: questionCreated.id.toString(),
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questionComments).toHaveLength(2);
	});
});
