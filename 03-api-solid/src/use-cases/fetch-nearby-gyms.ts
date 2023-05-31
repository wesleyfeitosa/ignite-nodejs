import { type GymsRepository } from '../repositories/gyms-repository';

interface FetchNearbyGymsRequest {
	userLatitude: number;
	userLongitude: number;
}

export class FetchNearbyGyms {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({ userLatitude, userLongitude }: FetchNearbyGymsRequest) {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		return {
			gyms,
		};
	}
}
