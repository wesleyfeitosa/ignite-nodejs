import { faker } from '@faker-js/faker';

import { Answer, type AnswerProps } from '@/domain/forum/enterprise/entities/answer';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityid) {
	const answer = Answer.create(
		{
			authorId: new UniqueEntityid(),
			questionId: new UniqueEntityid(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answer;
}
