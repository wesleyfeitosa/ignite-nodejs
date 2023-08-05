import { faker } from '@faker-js/faker';

import {
	QuestionComment,
	type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';
import { UniqueEntityid } from '@/core/entities/unique-entity-id';

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityid,
) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityid(),
			questionId: new UniqueEntityid(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return questionComment;
}
