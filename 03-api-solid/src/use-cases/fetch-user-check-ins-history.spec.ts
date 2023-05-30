import { beforeEach, describe, expect, it } from 'vitest';

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { type CheckInsRepository } from '../repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';

describe(' Fetch User Check In History Use Case', () => {
	let checkInsRepository: CheckInsRepository;
	let sut: FetchUserCheckInsHistoryUseCase;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
	});

	it('should be able to fetch check-in history', async () => {
		await checkInsRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		});
		await checkInsRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-02',
		});

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 1,
		});

		expect(checkIns).toBeTruthy();
		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' }),
		]);
	});

	it('should be able to fetch paginated check-in history', async () => {
		const data = [];
		for (let i = 1; i <= 22; i++) {
			data.push({
				user_id: 'user-01',
				gym_id: `gym-${i}`,
			});
		}

		await checkInsRepository.bulkCreate(data);

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 2,
		});

		expect(checkIns).toBeTruthy();
		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' }),
		]);
	});
});
