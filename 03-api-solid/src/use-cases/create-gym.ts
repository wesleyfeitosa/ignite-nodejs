import { type GymsRepository } from '../repositories/gyms-repository';

interface CreateGymUseCaseRequest {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
}

export class CreateGymUseCase {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({ title, description, phone, latitude, longitude }: CreateGymUseCaseRequest) {
		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		});

		return {
			gym,
		};
	}
}
