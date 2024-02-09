import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { type Answer } from '@/domain/forum/enterprise/entities/answer';
import { type UseCaseError } from '@/core/errors/use-case-error';
import { right, type Either, left } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/cases/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/cases/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';
import { type AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
	attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<UseCaseError, { answer: Answer }>;

export class EditAnswerUseCase {
	constructor(
		private readonly answersRepository: AnswersRepository,
		private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(
			answerId,
		);

		const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments);

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			});
		});

		answerAttachmentList.update(answerAttachments);

		answer.content = content;
		answer.attachments = answerAttachmentList;

		await this.answersRepository.save(answer);

		return right({ answer });
	}
}
