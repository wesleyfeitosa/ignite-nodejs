import { type Optional } from '@/core/types/optional';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Comment, type CommentProps } from './comment';

export interface AnswerCommentProps extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
	static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityId) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return answerComment;
	}

	get answerId() {
		return this.props.answerId;
	}
}
