import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { makeQuestion } from 'test/factories/make-question';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { DeleteQuestionUseCase } from './delete-question';

describe('Delete question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: DeleteQuestionUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
		sut = new DeleteQuestionUseCase(questionsRepository);
	});

	it('should be able to delete a question', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('question-01'),
		);
		await questionsRepository.create(questionCreated);

		questionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: questionCreated.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: questionCreated.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		await sut.execute({
			authorId: 'author-01',
			questionId: 'question-01',
		});

		expect(questionsRepository.items).toHaveLength(0);
		expect(questionAttachmentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question from another author', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01') },
			new UniqueEntityId('question-01'),
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
