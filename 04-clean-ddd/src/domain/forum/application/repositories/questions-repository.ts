import { type Question } from '@/domain/forum/enterprise/entities/questions';

export interface QuestionsRepository {
	create(question: Question): Promise<void>;
	findBySlug(slug: string): Promise<Question | null>;
}
