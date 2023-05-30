import { type CheckIn, type Prisma } from '@prisma/client';

import { type CheckInsRepository } from '../check-ins-repository';
import { prisma } from '@/lib/prisma';

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = await prisma.checkIn.create({
			data: {
				user_id: data.user_id,
				gym_id: data.gym_id,
			},
		});

		return checkIn;
	}

	async bulkCreate(data: Prisma.CheckInUncheckedCreateInput[]): Promise<CheckIn[]> {
		throw new Error('Method not implemented.');
	}

	async findManyByUserId(userId: string): Promise<CheckIn[]> {
		throw new Error('Method not implemented.');
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const checkInOnSameDate = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
					lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
				},
			},
		});

		return checkInOnSameDate;
	}
}
