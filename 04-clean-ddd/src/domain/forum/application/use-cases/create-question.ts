import { Question } from '@/domain/forum/enterprise/entities/question';
import { type Either, right } from '@/core/errors/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type QuestionsRepository } from '../repositories/questions-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		title,
		content,
		attachmentsIds,
	}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({ authorId: new UniqueEntityId(authorId), title, content });

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});

		question.attachments = new QuestionAttachmentList(questionAttachments);

		await this.questionsRepository.create(question);

		return right({ question });
	}
}
