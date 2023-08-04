import { type Optional } from '@/core/types/optional';
import { type UniqueEntityid } from '@/core/entities/unique-entity-id';
import { Comment, type CommentProps } from './comment';

export interface QuestionCommentProps extends CommentProps {
	questionId: UniqueEntityid;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
	static create(props: Optional<QuestionCommentProps, 'createdAt'>, id?: UniqueEntityid) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return questionComment;
	}

	get questionId() {
		return this.props.questionId;
	}
}
