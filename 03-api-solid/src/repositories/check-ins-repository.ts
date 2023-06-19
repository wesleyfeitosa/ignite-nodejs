import { type CheckIn, type Prisma } from '@prisma/client';

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	save(checkIn: CheckIn): Promise<CheckIn>;
	bulkCreate(data: Prisma.CheckInUncheckedCreateInput[]): Promise<number>;
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	findById(checkInId: string): Promise<CheckIn | null>;
	countByUserId(userId: string): Promise<number>;
}
