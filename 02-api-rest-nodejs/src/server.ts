import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', async () => {
	const tables: unknown[] = await knex('sqlite_schema').select('*');

	return tables;
});

void app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log('HTTP Server Running');
	});

