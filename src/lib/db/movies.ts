import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const movies = pgTable('movies', {
    id: serial('id').primaryKey(),
	adult: boolean('adult').notNull(),
    backdrop_path: text('backdrop_path'),
    genres: text('genres').array(),
    original_language: text('original_language').notNull(),
    original_title: text('original_title').notNull(),
    overview: text('overview'),
    poster: text('poster'),
    release_date: text('release_date').notNull(),
    title: text('title').notNull(),
    year: text('year').notNull(),
    director: text('director').notNull(),
    actors: text('actors'),
    tmdbUrl: text('tmdb_url').notNull(),
    location: text('location'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export const movieSelectSchema = createSelectSchema(movies);
export const movieInsertSchema = createInsertSchema(movies);
export const movieUpdateSchema = createUpdateSchema(movies);