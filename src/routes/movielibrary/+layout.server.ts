import { db } from '$lib/server/db';
import { movies } from '$lib/db/movies';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		movies: await db.select().from(movies)
	};
};