import { type Answer } from '@/domain/forum/enterprise/entities/answer';
import { type AnswersRepository } from '../repositories/answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

const fakeAnswersRepository: AnswersRepository = {
	async create(answer: Answer) {
		// Later implementation
	},
};

test('create an answer', async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

	const { answer } = await answerQuestion.execute({
		content: 'New answer',
		instructorId: '1',
		questionId: '1',
	});

	expect(answer.content).toEqual('New answer');
});
