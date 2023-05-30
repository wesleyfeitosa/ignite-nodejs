import { type Prisma, type Gym } from '@prisma/client';

export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	findById(userId: string): Promise<Gym | null>;
}
