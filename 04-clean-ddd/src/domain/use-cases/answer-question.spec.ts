import { type AnswersRepository } from '../repositories/answers-repository';
import { type Answer } from '../entities/answer';
import { AnswerQuestionUseCase } from './answer-question';

const fakeAnswersRepository: AnswersRepository = {
	async create(answer: Answer) {
		// Later implementation
	},
};

test('create an answer', async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

	const answer = await answerQuestion.execute({
		content: 'Nova resposta',
		instructorId: '1',
		questionId: '1',
	});

	expect(answer.content).toEqual('Nova resposta');
});
