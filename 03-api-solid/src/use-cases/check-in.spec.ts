import { type Gym } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { type CheckInsRepository } from '../repositories/check-ins-repository';
import { type GymsRepository } from '../repositories/gyms-repository';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';

describe('Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository;
	let gymsRepository: GymsRepository;
	let gym: Gym;
	let sut: CheckInUseCase;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		gym = await gymsRepository.create({
			title: 'Javascript Gym',
			latitude: new Decimal(0),
			longitude: new Decimal(0),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toBeTruthy();
		expect(checkIn.id).toEqual(expect.any(String));
		expect(checkIn.user_id).toEqual('user-01');
		expect(checkIn.gym_id).toEqual(gym.id);
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: 'user-01',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(async () =>
			sut.execute({
				userId: 'user-01',
				gymId: gym.id,
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: 'user-01',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toBeTruthy();
		expect(checkIn.id).toEqual(expect.any(String));
		expect(checkIn.user_id).toEqual('user-01');
		expect(checkIn.gym_id).toEqual(gym.id);
	});

	it('should be not able to check in on distant gym', async () => {
		const gym = await gymsRepository.create({
			title: 'Javascript Gym',
			latitude: new Decimal(-4.9649698),
			longitude: new Decimal(-39.0074127),
		});

		await expect(async () =>
			sut.execute({
				userId: 'user-01',
				gymId: gym.id,
				userLatitude: -5.1943276,
				userLongitude: -39.2921775,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
