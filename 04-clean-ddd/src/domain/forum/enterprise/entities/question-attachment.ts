import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

export interface QuestionAttachmentProps {
	questionId: UniqueEntityId;
	attachmentId: UniqueEntityId;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
	static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
		const questionAttachment = new QuestionAttachment(props, id);

		return questionAttachment;
	}

	get questionId() {
		return this.props.questionId;
	}

	get attachmentId() {
		return this.props.attachmentId;
	}
}
