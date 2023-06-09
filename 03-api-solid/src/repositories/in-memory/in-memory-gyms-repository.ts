import { randomUUID } from 'node:crypto';

import { type Prisma, type Gym } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates';
import { type FindManyNearbyParams, type GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(Number(data.latitude)),
			longitude: new Decimal(Number(data.longitude)),
		};

		this.items.push(gym);

		return gym;
	}

	async bulkCreate(data: Prisma.GymCreateInput[]) {
		const createdItems: Gym[] = [];

		for (const dataItem of data) {
			const gym = {
				id: randomUUID(),
				title: dataItem.title,
				description: dataItem.description ?? null,
				phone: dataItem.phone ?? null,
				latitude: new Decimal(Number(dataItem.latitude)),
				longitude: new Decimal(Number(dataItem.longitude)),
			};

			createdItems.push(gym);
			this.items.push(gym);
		}

		return createdItems.length;
	}

	async searchMany(query: string, page: number) {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async findById(gymId: string) {
		const gym = this.items.find((item) => item.id === gymId);

		if (!gym) {
			return null;
		}

		return gym;
	}

	async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
		const TEN_KILOMETERS_AWAY = 10;

		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude, longitude },
				{ latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() },
			);

			return distance < TEN_KILOMETERS_AWAY;
		});
	}
}
