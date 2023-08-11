import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';

describe('Create question', () => {
	let questionsRepository: InMemoryQuestionsRepository;
	let sut: CreateQuestionUseCase;

	beforeEach(() => {
		questionsRepository = new InMemoryQuestionsRepository();
		sut = new CreateQuestionUseCase(questionsRepository);
	});

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			content: 'This is a relative question',
			title: 'New question',
			authorId: '1',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.question.title).toEqual('New question');
		expect(questionsRepository.items[0].id).toEqual(result.value?.question.id);
		expect(questionsRepository.items[0].attachments).toHaveLength(2);
		expect(questionsRepository.items[0].attachments).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
