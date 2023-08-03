import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { CreateQuestionUseCase } from './create-question';

const fakeQuestionsRepository: QuestionsRepository = {
	async create(question: Question) {
		// Later implementation
	},
};

test('create a question', async () => {
	const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository);

	const { question } = await createQuestion.execute({
		content: 'This is a relative question',
		title: 'New question',
		authorId: '1',
	});

	expect(question.id).toBeTruthy();
	expect(question.title).toEqual('New question');
});
