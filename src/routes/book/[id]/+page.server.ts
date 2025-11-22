import { db } from '$lib/server/db';
import { books } from '$lib/db/books';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({params}) => {
    const id = parseInt(params.id);
	return {
		book: await db.select().from(books).where(eq(books.id, id))
	};
};