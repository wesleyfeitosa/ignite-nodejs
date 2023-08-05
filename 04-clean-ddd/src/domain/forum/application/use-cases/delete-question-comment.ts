import { type QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentUseCaseRquest {
	authorId: string;
	questionCommentId: string;
}

export class DeleteQuestionCommentUseCase {
	constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRquest) {
		const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

		if (!questionComment) {
			throw new Error('Question comment not found!');
		}

		if (authorId !== questionComment.authorId.toString()) {
			throw new Error('Not allowed!');
		}

		await this.questionCommentsRepository.delete(questionComment);

		return {};
	}
}
