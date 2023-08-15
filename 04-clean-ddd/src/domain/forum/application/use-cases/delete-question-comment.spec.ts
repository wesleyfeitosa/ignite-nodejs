import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { makeQuestion } from 'test/factories/make-question';

import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';

describe('Delete question comment comment', () => {
	let questionCommentsRepository: InMemoryQuestionCommentsRepository;
	let questionsRepository: InMemoryQuestionsRepository;
	let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: DeleteQuestionCommentUseCase;

	beforeEach(() => {
		questionCommentsRepository = new InMemoryQuestionCommentsRepository();
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
		sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
	});

	it('should be able to delete a question comment', async () => {
		const questionCreated = makeQuestion();
		await questionsRepository.create(questionCreated);

		const questionCommentCreated = makeQuestionComment({
			authorId: questionCreated.authorId,
			questionId: questionCreated.id,
		});
		await questionCommentsRepository.create(questionCommentCreated);

		await sut.execute({
			authorId: questionCreated.authorId.toString(),
			questionCommentId: questionCommentCreated.id.toString(),
		});

		expect(questionCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question comment from another author', async () => {
		const questionCreated = makeQuestion();
		await questionsRepository.create(questionCreated);

		const questionCommentCreated = makeQuestionComment({
			authorId: new UniqueEntityId('author-01'),
			questionId: questionCreated.id,
		});
		await questionCommentsRepository.create(questionCommentCreated);

		const result = await sut.execute({
			authorId: 'author-02',
			questionCommentId: questionCommentCreated.id.toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
