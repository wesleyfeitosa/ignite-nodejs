import { expect, describe, it, beforeEach } from 'vitest';

import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';

describe('Create Gym Use Case', () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: CreateGymUseCase;

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			title: 'Javascript Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		expect(gym.id).toBeTruthy();
		expect(gym.id).toEqual(expect.any(String));
	});
});
