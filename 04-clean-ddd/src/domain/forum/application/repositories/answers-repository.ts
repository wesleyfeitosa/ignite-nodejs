import { type Answer } from '@/domain/forum/enterprise/entities/answer';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export interface AnswersRepository {
	create(answer: Answer): Promise<void>;
	bulkCreate(data: Answer[]): Promise<number>;
	save(answer: Answer): Promise<void>;
	findById(id: string): Promise<Answer | null>;
	findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>;
	delete(answer: Answer): Promise<void>;
}
