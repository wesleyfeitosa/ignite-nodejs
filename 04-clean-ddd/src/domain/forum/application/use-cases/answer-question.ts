import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { right, type Either } from '@/core/errors/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
	constructor(private readonly answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityId(instructorId),
			questionId: new UniqueEntityId(questionId),
		});

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			});
		});

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
