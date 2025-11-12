import { command, query } from '$app/server';
import { z } from 'zod';
import { type OpenLibraryEdition, type OpenLibraryWork } from '$lib/types/openlibrary';
import { bookInsertSchema, books, bookUpdateSchema, type Book, type NewBook } from '$lib/db/books';
import ky from 'ky';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';


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
    try{
      console.log(arg);
		  await db.insert(books).values(arg);
      console.log("Libro guardado");
    }catch(err){
      console.log(err);
      throw new Error('Error guardando libro');
    }
	}
);

export const updateBook = command(
	bookUpdateSchema, async (arg) => {
    if (!arg.id) {
      throw new Error('Book ID is required for update');
    }
		await db.update(books).set(arg).where(eq(books.id, arg.id));
	}
);

async function fetchBookByISBN(isbn: string) {
  const api = ky.create({
    prefixUrl: "https://openlibrary.org",
    timeout: 10_000,
    headers: { "User-Agent": "LibrarianProject/1.0" },
  });

  const clean = (p: string) => p.replace(/^\//, "");

  const booksData = await api
    .get(`api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
    .json<Record<string, OpenLibraryEdition>>();

  const bookKey = `ISBN:${isbn}`;
  const book = booksData[bookKey];

  if (!book) {
    throw error(404, {
      message: `No se encontró ningún libro con ISBN ${isbn}`
    });
  }

  let description: string | null = null;
  if (book.description) {
    description =
      typeof book.description === "string"
        ? book.description
        : book.description.value ?? null;
  }

  if (!description && book.key) {
    const editionData = await api
      .get(`${clean(book.key)}.json`)
      .json<OpenLibraryEdition>();

    if (editionData.works?.[0]?.key) {
      const workData = await api
        .get(`${clean(editionData.works[0].key)}.json`)
        .json<OpenLibraryWork>();

      if (workData.description) {
        description =
          typeof workData.description === "string"
            ? workData.description
            : workData.description.value ?? null;
      }
    }
  }

  console.log(book.key, description);

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

      const result = await db
        .select()
        .from(books)
        .where(eq(books.isbn, isbn))
        .limit(1);

      const exists = result[0];

      if(exists){
        return {
          book: exists,
          inLibrary: true
        };
      }

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
        bookUrl: `https://openlibrary.org${book.key}`
			};

			return {book: transformedBook, inLibrary: false};

		} catch (error) {
			console.error('Error fetching book from OpenLibrary:', error);
			throw error;
		}
	}
);
