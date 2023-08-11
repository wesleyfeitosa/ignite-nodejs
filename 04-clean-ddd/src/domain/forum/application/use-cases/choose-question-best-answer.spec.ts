import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
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
		const questionCreated = makeQuestion({ authorId: new UniqueEntityId('author-01') });
		await questionsRepository.create(questionCreated);

		const answerCreated = makeAnswer({
			authorId: new UniqueEntityId('author-01'),
			questionId: questionCreated.id,
		});
		await answerRepository.create(answerCreated);

		await sut.execute({
			authorId: 'author-01',
			answerId: answerCreated.id.toString(),
		});

		expect(questionsRepository.items[0].bestAnswerId).toEqual(answerCreated.id);
	});

	it('should not be able to choose the best answer of a question from another author', async () => {
		const questionCreated = makeQuestion({ authorId: new UniqueEntityId('author-01') });
		await questionsRepository.create(questionCreated);

		const answerCreated = makeAnswer({
			authorId: new UniqueEntityId('author-01'),
			questionId: questionCreated.id,
		});
		await answerRepository.create(answerCreated);

		const result = await sut.execute({
			authorId: 'author-invalid',
			answerId: answerCreated.id.toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
