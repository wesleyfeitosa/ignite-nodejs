import { beforeEach, describe, expect, it } from 'vitest';

import { GetUserMetricsUseCase } from './get-user-metrics';
import { type CheckInsRepository } from '../repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';

describe('Get User Metrics Use Case', () => {
	let checkInsRepository: CheckInsRepository;
	let sut: GetUserMetricsUseCase;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new GetUserMetricsUseCase(checkInsRepository);
	});

	it('should be able to get check-ins count from metrics', async () => {
		await checkInsRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		});
		await checkInsRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-02',
		});
		await checkInsRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-02',
		});

		const { checkInsCount } = await sut.execute({
			userId: 'user-01',
		});

		expect(checkInsCount).toBeTruthy();
		expect(checkInsCount).toEqual(3);
	});
});
