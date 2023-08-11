import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

interface AnswerAttachmentProps {
	answerId: UniqueEntityId;
	attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
	static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
		const answerAttachment = new AnswerAttachment(props, id);

		return answerAttachment;
	}

	get answerId() {
		return this.props.answerId;
	}

	get attachmentId() {
		return this.props.attachmentId;
	}
}
