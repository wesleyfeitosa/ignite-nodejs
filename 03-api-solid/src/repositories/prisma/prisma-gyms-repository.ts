import { type Prisma, type Gym } from '@prisma/client';

import { type FindManyNearbyParams, type GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		throw new Error('Method not implemented.');
	}

	async bulkCreate(data: Prisma.GymCreateInput[]): Promise<Gym[]> {
		throw new Error('Method not implemented.');
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		throw new Error('Method not implemented.');
	}

	async findById(userId: string): Promise<Gym | null> {
		throw new Error('Method not implemented.');
	}

	async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		throw new Error('Method not implemented.');
	}
}
