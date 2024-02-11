import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { type QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment);
	}

	async bulkCreate(data: QuestionComment[]) {
		const createdItems: QuestionComment[] = [];

		for (const dataItem of data) {
			createdItems.push(dataItem);
			this.items.push(dataItem);
		}

		return createdItems.length;
	}

	async findById(id: string) {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id,
		);

		if (!questionComment) {
			return null;
		}

		return questionComment;
	}

	async findManyByQuestionId(id: string, { page }: PaginationParams) {
		const ITEMS_BY_PAGE = 20;

		const questionComments = this.items
			.filter((item) => item.questionId.toString() === id)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * ITEMS_BY_PAGE, page * ITEMS_BY_PAGE);

		return questionComments;
	}

	async delete(questionComment: QuestionComment) {
		const questionCommentIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		this.items.splice(questionCommentIndex, 1);
	}
}
