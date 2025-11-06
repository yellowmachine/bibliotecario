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

async function fetchBookByISBN(isbn: string) {
    const api = ky.create({
        prefixUrl: 'https://openlibrary.org/api/',
        timeout: 10_000,
        headers: { 'User-Agent': 'LibrarianProject/1.0' }
    });

    // 1️⃣ Primer fetch: datos de la edición por ISBN
    const booksData = await api
      .get(`api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
      .json<Record<string, OpenLibraryEdition>>();
  
    const bookKey = `ISBN:${isbn}`;
    const book = booksData[bookKey];
    if (!book) throw new Error(`No se encontró ningún libro con ISBN ${isbn}`);
  
    // Intentar obtener descripción directamente
    let description: string | null = null;
    if (book.description) {
      description =
        typeof book.description === "string"
          ? book.description
          : book.description.value ?? null;
    }
  
    // 2️⃣ Si no hay descripción, intentar buscarla en el "work"
    if (!description && book.key) {
      // Obtener datos de la edición completa
      const editionData = await api.get(`${book.key}.json`).json<OpenLibraryEdition>();
  
      if (editionData.works?.[0]?.key) {
        const workData = await api.get(`${editionData.works[0].key}.json`).json<OpenLibraryWork>();
  
        if (workData.description) {
          description =
            typeof workData.description === "string"
              ? workData.description
              : workData.description.value ?? null;
        }
      }
    }
  
    // Devuelve los datos unificados
    return {
      ...book,
      description,
    };
  }

// Query: Buscar libro por ISBN en OpenLibrary (server-side para evitar CORS)
export const fetchOpenLibraryBookQuery = query(
	z.object({
		isbn: z.string().min(1)
	}),
	async ({ isbn }) => {
		try {
            console.log(isbn);
            const book = await fetchBookByISBN(isbn);
						
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
				description: book.description,
				coverImageUrl: book.cover?.large || null,
			};

			return transformedBook;

		} catch (error) {
			console.error('Error fetching book from OpenLibrary:', error);
			throw error;
		}
	}
);
