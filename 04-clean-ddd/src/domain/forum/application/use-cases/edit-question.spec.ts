import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { makeQuestion } from 'test/factories/make-question';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EditQuestionUseCase } from './edit-question';

describe('Edit question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: EditQuestionUseCase;

	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);

		sut = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository);
	});

	it('should be able to edit a question', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01'), title: 'Old title', content: 'Old content' },
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
			title: 'New title',
			content: 'New content',
			attachmentsIds: ['1', '3'],
		});

		expect(questionsRepository.items[0]).toMatchObject({
			title: 'New title',
			content: 'New content',
		});
		expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(questionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a question from another author', async () => {
		const questionCreated = makeQuestion(
			{ authorId: new UniqueEntityId('author-01'), title: 'Old title', content: 'old content' },
			new UniqueEntityId('question-01'),
		);
		await questionsRepository.create(questionCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			questionId: 'question-01',
			title: 'New title',
			content: 'New content',
			attachmentsIds: ['1', '3'],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
