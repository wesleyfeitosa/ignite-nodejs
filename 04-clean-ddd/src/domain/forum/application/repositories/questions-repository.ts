import { type Question } from '@/domain/forum/enterprise/entities/questions';
import { type PaginationParams } from '@/core/repositories/pagination-params';

export interface QuestionsRepository {
	create(question: Question): Promise<void>;
	bulkCreate(data: Question[]): Promise<number>;
	save(question: Question): Promise<void>;
	findBySlug(slug: string): Promise<Question | null>;
	findById(id: string): Promise<Question | null>;
	findManyRecent(params: PaginationParams): Promise<Question[]>;
	delete(question: Question): Promise<void>;
}
