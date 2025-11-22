import { db } from '$lib/server/db';
import { books } from '$lib/db/books';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({params}) => {
    const id = parseInt(params.id);
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);

	return {
		book: book[0]
	};
};