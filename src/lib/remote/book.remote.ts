import { command, query } from '$app/server';
import { z } from 'zod';
import { getDescriptionText, type OpenLibraryEdition, type OpenLibraryWork } from '$lib/types/openlibrary';
import { bookInsertSchema, books, type NewBook } from '$lib/db/books';
import ky from 'ky';
import { db } from '$lib/server/db';


export interface LibraryStats {
	total: number;
	toRead: number;
	reading: number;
	read: number;
	didNotFinish: number;
	averageRating?: number;
}

export const queryLibrary = query(
    async () => {
        return await db.select().from(books);
    }
);

export const insertBook = command(
	bookInsertSchema, async (arg: NewBook) => {
		await db.insert(books).values(arg);
	}
);

// Query: Buscar libro por ISBN en OpenLibrary (server-side para evitar CORS)
export const fetchOpenLibraryBookQuery = query(
	z.object({
		isbn: z.string().min(1)
	}),
	async ({ isbn }) => {
		try {

            console.log(isbn);

			const api = ky.create({
				prefixUrl: 'https://openlibrary.org/api/',
				timeout: 10_000,
				headers: { 'User-Agent': 'LibrarianProject/1.0' }
			});

			// 1️⃣ Primer fetch: datos básicos del libro
			const booksData = await api
				.get(`api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
				.json<Record<string, OpenLibraryEdition>>();

			const bookKey = `ISBN:${isbn}`;
			const book = booksData[bookKey];
			if (!book) throw new Error(`Book not found for ISBN ${isbn}`);

			// 2️⃣ Obtener el work key
			const workKey = book.works?.[0]?.key;
			if (!workKey) throw new Error(`No work key found for book ${isbn}`);

			// 3️⃣ Segundo fetch: descripción u otros detalles
			const workData = await api.get(`${workKey}.json`).json<OpenLibraryWork>();
						
			// Transformar a nuestro formato OpenLibraryBook
			const transformedBook: NewBook = {
				title: book.title || 'Título desconocido',
				isbn,
				authors: book.authors?.map((author: any) => author.name).join(", ") || null,
				publisher: book.publishers?.map((pub: any) => pub.name || pub).join(", ") || null,
				publishDate: book.publish_date || null,
				numberOfPages: book.number_of_pages || null,
				subjects: book.subjects?.map((subject: any) => subject.name || subject) || null,
				languages: book.languages?.map((lang: any) => lang.name) || null,
				description: getDescriptionText(workData.description),
				coverImageUrl: book.cover?.large || null,
			};

			return transformedBook;

		} catch (error) {
			console.error('Error fetching book from OpenLibrary:', error);
			throw error;
		}
	}
);
