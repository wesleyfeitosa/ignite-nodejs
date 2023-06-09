import { fastifyJwt } from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { appRoutes } from './http/routes';

export const app = fastify();

void app.register(fastifyJwt, { secret: env.JWT_SECRET });
void app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
	}

	console.error(error);

	return reply.status(500).send({ message: 'Internal server error!' });
});
