import { faker } from '@faker-js/faker';

import { Question, type QuestionProps } from '@/domain/forum/enterprise/entities/questions';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return question;
}
