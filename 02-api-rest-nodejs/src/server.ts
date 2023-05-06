import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from './env';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();

void app.register(cookie);

app.addHook('preHandler', async request => {
	console.log(`[${request.method} - ${request.url}]`);
});

void app.register(transactionsRoutes, {
	prefix: '/transactions',
});

void app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log('HTTP Server Running');
	});

