import { beforeEach, describe, expect, it } from 'vitest';

import { FetchNearbyGyms } from './fetch-nearby-gyms';
import { type GymsRepository } from '../repositories/gyms-repository';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';

describe('Fetch Nearby Gyms Use Case', () => {
	let gymsInsRepository: GymsRepository;
	let sut: FetchNearbyGyms;

	beforeEach(async () => {
		gymsInsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGyms(gymsInsRepository);
	});

	it('should be able to fetch nearby gyms', async () => {
		await gymsInsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});
		await gymsInsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -27.0610928,
			longitude: -49.5229501,
		});

		const { gyms } = await sut.execute({
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		});

		expect(gyms).toBeTruthy();
		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
	});
});
