import { type CheckInsRepository } from '../repositories/check-ins-repository';

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
}

export class CheckInUseCase {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async execute({ userId, gymId }: CheckInUseCaseRequest) {
		console.log('DATE: ', new Date());
		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

		if (checkInOnSameDate) {
			throw new Error();
		}

		const checkIn = await this.checkInsRepository.create({ user_id: userId, gym_id: gymId });

		return {
			checkIn,
		};
	}
}
