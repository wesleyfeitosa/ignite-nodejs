import { compare } from 'bcryptjs';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { type UsersRepository } from '../repositories/users-repository';

interface AutheticateUseCaseRequest {
	email: string;
	password: string;
}

export class AuthenticateUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ email, password }: AutheticateUseCaseRequest) {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError();
		}

		return {
			user,
		};
	}
}
