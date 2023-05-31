import { type Prisma, type Gym } from '@prisma/client';

export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	bulkCreate(data: Prisma.GymCreateInput[]): Promise<Gym[]>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	findById(userId: string): Promise<Gym | null>;
}
