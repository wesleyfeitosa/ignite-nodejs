import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export interface QuestionCommentsRepository {
	create(questionComment: QuestionComment): Promise<void>;
	bulkCreate(data: QuestionComment[]): Promise<number>;
	findById(id: string): Promise<QuestionComment | null>;
	findManyByQuestionId(id: string, params: PaginationParams): Promise<QuestionComment[]>;
	delete(questionComment: QuestionComment): Promise<void>;
}
