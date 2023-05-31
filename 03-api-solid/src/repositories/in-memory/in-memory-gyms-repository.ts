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

	async bulkCreate(data: Prisma.GymCreateInput[]): Promise<Gym[]> {
		const createdItems: Gym[] = [];

		for (const dataItem of data) {
			const gym = {
				id: randomUUID(),
				title: dataItem.title,
				description: dataItem.description ?? null,
				phone: dataItem.phone ?? null,
				latitude: new Decimal(Number(dataItem.latitude)),
				longitude: new Decimal(Number(dataItem.latitude)),
			};

			createdItems.push(gym);
			this.items.push(gym);
		}

		return createdItems;
	}

	async findById(gymId: string) {
		const gym = this.items.find((item) => item.id === gymId);

		if (!gym) {
			return null;
		}

		return gym;
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}
}
