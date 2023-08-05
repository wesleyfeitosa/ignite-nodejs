import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { type AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment);
	}

	async bulkCreate(data: AnswerComment[]) {
		const createdItems: AnswerComment[] = [];

		for (const dataItem of data) {
			createdItems.push(dataItem);
			this.items.push(dataItem);
		}

		return createdItems.length;
	}

	async findById(id: string) {
		const answerComment = this.items.find((item) => item.id.toString() === id);

		if (!answerComment) {
			return null;
		}

		return answerComment;
	}

	async findManyByAnswerId(id: string, { page }: PaginationParams) {
		const ITEMS_BY_PAGE = 20;

		const questionComments = this.items
			.filter((item) => item.answerId.toString() === id)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * ITEMS_BY_PAGE, page * ITEMS_BY_PAGE);

		return questionComments;
	}

	async delete(answerComment: AnswerComment) {
		const answerCommentIndex = this.items.findIndex((item) => item.id === answerComment.id);

		this.items.splice(answerCommentIndex, 1);
	}
}
