import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to search for gyms', async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Javascript Gym',
				description: 'lorem ipsom',
				phone: '88999999999',
				latitude: -4.9649698,
				longitude: -39.0074127,
			})
			.set('Authorization', `Bearer ${token}`);

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Typescript Gym',
				description: 'lorem ipsom',
				phone: '88999999999',
				latitude: -4.9649698,
				longitude: -39.0074127,
			})
			.set('Authorization', `Bearer ${token}`);

		const response = await request(app.server)
			.get('/gyms/search')
			.query({ q: 'Javascript Gym' })
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ gyms: [expect.objectContaining({ title: 'Javascript Gym' })] });
		expect(response.body.gyms).toHaveLength(1);
	});
});
