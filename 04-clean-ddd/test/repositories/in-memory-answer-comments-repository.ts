import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { type AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment);
	}
}
