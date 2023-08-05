import { faker } from '@faker-js/faker';

import {
	AnswerComment,
	type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityid) {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityid(),
			answerId: new UniqueEntityid(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answerComment;
}
