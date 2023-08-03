import { type Question } from '@/domain/forum/enterprise/entities/questions';

export interface QuestionsRepository {
	create(question: Question): Promise<void>;
}
