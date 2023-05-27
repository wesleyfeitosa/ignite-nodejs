import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { type CheckInsRepository } from '../repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';

describe('Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository;
	let sut: CheckInUseCase;

	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
		});

		expect(checkIn.id).toBeTruthy();
		expect(checkIn.id).toEqual(expect.any(String));
		expect(checkIn.user_id).toEqual('user-01');
		expect(checkIn.gym_id).toEqual('gym-01');
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
		});

		await expect(async () =>
			sut.execute({
				userId: 'user-01',
				gymId: 'gym-01',
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it.only('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
		});

		expect(checkIn.id).toBeTruthy();
		expect(checkIn.id).toEqual(expect.any(String));
		expect(checkIn.user_id).toEqual('user-01');
		expect(checkIn.gym_id).toEqual('gym-01');
	});
});
