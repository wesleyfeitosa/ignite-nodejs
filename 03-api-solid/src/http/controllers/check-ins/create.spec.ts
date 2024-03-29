import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { type GymsResponseProps } from './types';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to checkin', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Javascript Gym',
				description: 'lorem ipsom',
				phone: '88993200822',
				latitude: -4.9649698,
				longitude: -39.0074127,
			})
			.set('Authorization', `Bearer ${token}`);

		const responseGyms: GymsResponseProps = await request(app.server)
			.get('/gyms/search')
			.query({ q: 'Javascript Gym' })
			.set('Authorization', `Bearer ${token}`);

		const response = await request(app.server)
			.post(`/gyms/${responseGyms.body.gyms[0].id}/check-ins`)
			.send({
				latitude: -4.9649691,
				longitude: -39.0074129,
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(201);
	});
});
