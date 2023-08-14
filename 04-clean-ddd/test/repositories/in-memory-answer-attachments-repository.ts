import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { type AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string) {
		const answerAttachments = this.items.filter((item) => item.answerId.toString() === answerId);

		return answerAttachments;
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		this.items = this.items.filter((item) => item.answerId.toString() !== answerId);
	}
}
