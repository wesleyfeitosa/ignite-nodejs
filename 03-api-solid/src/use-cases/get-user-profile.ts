import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { type UsersRepository } from '../repositories/users-repository';

interface GetUserProfileUseCaseRequest {
	userId: string;
}

export class GetUserProfileUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ userId }: GetUserProfileUseCaseRequest) {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}
