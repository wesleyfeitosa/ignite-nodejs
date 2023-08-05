import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentUseCaseRquest {
	authorId: string;
	answerCommentId: string;
}

export class DeleteAnswerCommentUseCase {
	constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({ authorId, answerCommentId }: DeleteAnswerCommentUseCaseRquest) {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

		if (!answerComment) {
			throw new Error('Question comment not found!');
		}

		if (authorId !== answerComment.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		await this.answerCommentsRepository.delete(answerComment);

		return {};
	}
}
