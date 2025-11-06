import { db } from '$lib/server/db';
import { books } from '$lib/db/books';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		books: await db.select().from(books)
	};
};