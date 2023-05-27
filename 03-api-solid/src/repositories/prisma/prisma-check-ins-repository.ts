import { type Prisma } from '@prisma/client';

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
}
