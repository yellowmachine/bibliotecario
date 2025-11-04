import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export * from './books';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});
