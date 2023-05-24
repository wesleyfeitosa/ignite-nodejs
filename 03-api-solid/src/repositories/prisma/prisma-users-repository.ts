import { type Prisma } from '@prisma/client';

import { type UsersRepository } from '../users-repository';
import { prisma } from '@/lib/prisma';

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data,
		});

		return user;
	}

	async findUniqueByEmail(email: string) {
		const userWithSameEmail = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return userWithSameEmail;
	}
}
