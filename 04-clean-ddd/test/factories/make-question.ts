import { faker } from '@faker-js/faker';

import { Question, type QuestionProps } from '@/domain/forum/enterprise/entities/questions';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityid) {
	const question = Question.create(
		{
			authorId: new UniqueEntityid(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return question;
}
