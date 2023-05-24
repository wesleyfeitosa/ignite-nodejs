import { type Prisma, type User } from '@prisma/client';

export interface UsersRepository {
	create: (data: Prisma.UserCreateInput) => Promise<User>;
	findUniqueByEmail: (email: string) => Promise<User | null>;
}
