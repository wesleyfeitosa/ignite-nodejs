import { type GymsRepository } from '../repositories/gyms-repository';

interface SearchGymsUseCaseRequest {
	query: string;
	page: number;
}

export class SearchGymsUseCase {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({ query, page }: SearchGymsUseCaseRequest) {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return {
			gyms,
		};
	}
}
