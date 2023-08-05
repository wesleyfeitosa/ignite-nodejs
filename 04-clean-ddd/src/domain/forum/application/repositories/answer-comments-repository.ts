import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export interface AnswerCommentsRepository {
	create(AnswerComment: AnswerComment): Promise<void>;
	bulkCreate(data: AnswerComment[]): Promise<number>;
	findById(id: string): Promise<AnswerComment | null>;
	findManyByAnswerId(id: string, params: PaginationParams): Promise<AnswerComment[]>;
	delete(AnswerComment: AnswerComment): Promise<void>;
}
