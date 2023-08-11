import { type Optional } from '@/core/types/optional';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

export interface AnswerProps {
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
	static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityId) {
		const answer = new Answer(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return answer;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}
}
