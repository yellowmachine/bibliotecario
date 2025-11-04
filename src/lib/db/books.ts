import { pgTable, serial, text, json, integer, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const books = pgTable('books', {
    id: serial('id').primaryKey(),
	isbn: text('isbn').notNull().unique(), 
	openLibraryKey: text('open_library_key'), 
	title: text('title').notNull(),
	subtitle: text('subtitle'),
	authors: text('authors'), 
	publishDate: text('publish_date'), 
	publisher: text('publisher'),
    bookUrl: text('url'),
	numberOfPages: integer('number_of_pages'),
	description: text('description'),
	subjects: text('subject').array(), 
	languages: text('languages').array(), 
	coverImageUrl: text('cover_image_url'), 
	openLibraryData: json('open_library_data'), 
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

export const bookSelectSchema = createSelectSchema(books);
export const bookInsertSchema = createInsertSchema(books);
export const bookUpdateSchema = createUpdateSchema(books);