import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

void app.register(cookie);

app.addHook('preHandler', async request => {
	console.log(`[${request.method} - ${request.url}]`);
});

void app.register(transactionsRoutes, {
	prefix: '/transactions',
});
