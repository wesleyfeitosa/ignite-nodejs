import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';

import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';

describe('Authenticate Use Case', () => {
	const mockEmail = 'johndoe@example.com';
	let usersRepository: InMemoryUsersRepository;
	let sut: AuthenticateUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: mockEmail,
			password_hash: await hash('123456', 6),
		});

		const { user } = await sut.execute({
			email: mockEmail,
			password: '123456',
		});

		expect(user.id).toBeTruthy();
		expect(user.id).toEqual(expect.any(String));
		expect(user.email).toEqual(mockEmail);
	});

	it('should not be able to authenticate with wrong email', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: mockEmail,
			password_hash: await hash('123456', 6),
		});

		await expect(async () =>
			sut.execute({
				email: 'mike@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: mockEmail,
			password_hash: await hash('123456', 6),
		});

		await expect(async () =>
			sut.execute({
				email: mockEmail,
				password: '123455',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
