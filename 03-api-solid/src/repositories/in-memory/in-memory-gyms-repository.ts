import { randomUUID } from 'node:crypto';

import { type Prisma, type Gym } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { type GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(Number(data.latitude)),
			longitude: new Decimal(Number(data.latitude)),
		};

		this.items.push(gym);

		return gym;
	}

	async findById(gymId: string) {
		const gym = this.items.find((item) => item.id === gymId);

		if (!gym) {
			return null;
		}

		return gym;
	}
}
