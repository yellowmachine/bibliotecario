import { query } from '$app/server';
import { z } from 'zod';
import type { OpenLibraryBook } from '$lib/types/openlibrary';

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

			const data = await response.json();

            console.log(data);

			const bookKey = `ISBN:${isbn}`;
			
			if (!data[bookKey]) {
				return null;
			}

			const book = data[bookKey];
			
			// Transformar a nuestro formato OpenLibraryBook
			const transformedBook: OpenLibraryBook = {
				key: book.key || `/books/${isbn}`,
				title: book.title || 'Título desconocido',
				subtitle: book.subtitle,
				isbn_13: isbn.length === 13 ? [isbn] : undefined,
				isbn_10: isbn.length === 10 ? [isbn] : undefined,
				authors: book.authors?.map((author: any) => ({
					key: author.key || `/authors/${author.name}`,
					name: author.name
				})),
				publishers: book.publishers?.map((pub: any) => pub.name || pub),
				publish_date: book.publish_date,
				number_of_pages: book.number_of_pages,
				subjects: book.subjects?.map((subject: any) => subject.name || subject),
				languages: book.languages?.map((lang: any) => ({
					key: lang.key || `/languages/${lang.name}`,
					name: lang.name
				})),
				description: book.description,
				covers: book.cover ? [book.cover.medium || book.cover.large || book.cover.small] : undefined,
				type: { key: "/type/edition" }
			};

			return transformedBook;

		} catch (error) {
			console.error('Error fetching book from OpenLibrary:', error);
			throw error;
		}
	}
);
