import { randomUUID } from 'node:crypto';

import { type CheckIn, type Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { type CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async bulkCreate(data: Prisma.CheckInUncheckedCreateInput[]): Promise<CheckIn[]> {
		const createdItems: CheckIn[] = [];
		for (const dataItem of data) {
			const checkIn = {
				id: randomUUID(),
				user_id: dataItem.user_id,
				gym_id: dataItem.gym_id,
				validated_at: dataItem.validated_at ? new Date(dataItem.validated_at) : null,
				created_at: new Date(),
			};

			createdItems.push(checkIn);
			this.items.push(checkIn);
		}

		return createdItems;
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items.filter((item) => item.user_id === userId).slice((page - 1) * 20, page * 20);
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}

	async countByUserId(userId: string): Promise<number> {
		const checkInsCount = this.items.reduce((accumulator, currentValue) => {
			if (currentValue.user_id === userId) {
				return accumulator + 1;
			}

			return accumulator;
		}, 0);

		return checkInsCount;
	}
}
