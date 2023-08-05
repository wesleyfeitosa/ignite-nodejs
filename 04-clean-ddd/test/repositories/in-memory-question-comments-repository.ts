import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { type QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment);
	}
}
