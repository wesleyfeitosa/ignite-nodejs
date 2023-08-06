import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestion } from 'test/factories/make-question';

import { CommentOnQuestionUseCase } from './comment-on-question';

describe('Comment on question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let questionCommentsRepository: InMemoryQuestionCommentsRepository;
	let sut: CommentOnQuestionUseCase;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		questionCommentsRepository = new InMemoryQuestionCommentsRepository();
		sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
	});

	it('should be able to comment on question', async () => {
		const questionCreated = makeQuestion();
		await questionsRepository.create(questionCreated);

		const result = await sut.execute({
			content: 'This is a relative comment',
			authorId: questionCreated.authorId.toString(),
			questionId: questionCreated.id.toString(),
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.questionComment.content).toEqual('This is a relative comment');
		}
	});
});
