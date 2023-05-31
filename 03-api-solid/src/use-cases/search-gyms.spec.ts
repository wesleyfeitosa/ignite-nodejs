import { beforeEach, describe, expect, it } from 'vitest';

import { SearchGymsUseCase } from './search-gyms';
import { type GymsRepository } from '../repositories/gyms-repository';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';

describe('Search Gyms Use Case', () => {
	let gymsInsRepository: GymsRepository;
	let sut: SearchGymsUseCase;

	beforeEach(async () => {
		gymsInsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsInsRepository);
	});

	it('should be able to search gyms', async () => {
		await gymsInsRepository.create({
			title: 'Javascript Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});
		await gymsInsRepository.create({
			title: 'Javascript Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		const { gyms } = await sut.execute({
			query: 'Javascript Gym',
			page: 1,
		});

		expect(gyms).toBeTruthy();
		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Javascript Gym' }),
			expect.objectContaining({ title: 'Javascript Gym' }),
		]);
	});

	it('should be able to search paginated gyms', async () => {
		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push({
				title: `gym-${i}`,
				description: null,
				phone: null,
				latitude: 0,
				longitude: 0,
			});
		}

		await gymsInsRepository.bulkCreate(data);

		const { gyms } = await sut.execute({
			query: 'gym',
			page: 2,
		});

		expect(gyms).toBeTruthy();
		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-21' }),
			expect.objectContaining({ title: 'gym-22' }),
		]);
	});
});
