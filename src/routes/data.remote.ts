import { query } from '$app/server';
import { z } from 'zod';
import type { OpenLibraryISBNResponse } from '$lib/types/openlibrary';
import type { NewBook } from '$lib/db/books';

// Tipos exportados
export interface LibraryStats {
	total: number;
	toRead: number;
	reading: number;
	read: number;
	didNotFinish: number;
	averageRating?: number;
}

// Query: Buscar libro por ISBN en OpenLibrary (server-side para evitar CORS)
export const fetchOpenLibraryBookQuery = query(
	z.object({
		isbn: z.string().min(1)
	}),
	async ({ isbn }) => {
		try {

            console.log(isbn);
			
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
			
            console.log('fetching...');

			const response = await fetch(
				`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`,
				{
					headers: {
						'User-Agent': 'LibrarianProject/1.0 (Educational Project)',
					},
					signal: controller.signal
				}
			);
			
			clearTimeout(timeoutId);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: OpenLibraryISBNResponse = await response.json();
			const bookKey = `ISBN:${isbn}`;
			
			if (!data[bookKey]) {
				return null;
			}

			const book = data[bookKey];
			
			// Transformar a nuestro formato OpenLibraryBook
			const transformedBook: NewBook = {
				//key: book.key || `/books/${isbn}`,
				title: book.title || 'Título desconocido',
				//subtitle: book.subtitle,
				//isbn_13: isbn.length === 13 ? [isbn] : undefined,
				//isbn_10: isbn.length === 10 ? [isbn] : undefined,
				isbn,
				authors: book.authors?.map((author: any) => author.name).join(", ") || null,
				publisher: book.publishers?.map((pub: any) => pub.name || pub).join(", ") || null,
				publishDate: book.publish_date || null,
				numberOfPages: book.number_of_pages || null,
				subjects: book.subjects?.map((subject: any) => subject.name || subject) || null,
				languages: book.languages?.map((lang: any) => lang.name) || null,
				//description: book.description,
				coverImageUrl: book.cover?.large || null,
				//type: { key: "/type/edition" }
			};

			return transformedBook;

		} catch (error) {
			console.error('Error fetching book from OpenLibrary:', error);
			throw error;
		}
	}
);
