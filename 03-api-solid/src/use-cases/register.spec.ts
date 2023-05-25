import { compare } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';

describe('Register Use Case', () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: RegisterUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should be able to register', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(user.id).toBeTruthy();
		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const isPasswordCorrectlyHashed = compare('123456', user.password_hash);

		expect(isPasswordCorrectlyHashed).toBeTruthy();
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com';

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456',
		});

		await expect(async () =>
			sut.execute({
				name: 'John Doe',
				email,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
