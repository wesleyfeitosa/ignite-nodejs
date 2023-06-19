import { type Prisma, type Gym } from '@prisma/client';

export interface FindManyNearbyParams {
	latitude: number;
	longitude: number;
}

export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	bulkCreate(data: Prisma.GymCreateInput[]): Promise<number>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	findById(gymId: string): Promise<Gym | null>;
	findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
