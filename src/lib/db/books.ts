import { pgTable, serial, text, json, integer, timestamp } from "drizzle-orm/pg-core";

export const books = pgTable('books', {
	id: serial('id').primaryKey(),
	isbn: text('isbn').notNull().unique(), // ISBN como clave única
	openLibraryKey: text('open_library_key'), // /works/OL123W o /books/OL123M
	title: text('title').notNull(),
	subtitle: text('subtitle'),
	authors: json('authors').$type<string[]>(), // Array de nombres de autores
	publishDate: text('publish_date'), // Fecha como string (puede venir en varios formatos)
	publisher: text('publisher'),
	numberOfPages: integer('number_of_pages'),
	description: text('description'),
	subjects: json('subjects').$type<string[]>(), // Array de temas/categorías
	languages: json('languages').$type<string[]>(), // Array de códigos de idioma
	coverImageUrl: text('cover_image_url'), // URL de la imagen de portada
	openLibraryData: json('open_library_data'), // Datos completos de OpenLibrary para backup
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});