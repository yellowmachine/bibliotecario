import { query, command } from '$app/server';
import { z } from 'zod';
import ky from "ky";
import { env } from "$env/dynamic/private";
import type { TMDB_SearchResponse, TMDbMovieDetails } from '$lib/types/tmdb';
import { movieInsertSchema, movies, movieUpdateSchema, type NewMovie } from '$lib/db/movies';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';


const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

const enrichMovie = async (movie: any, apiKey: string): Promise<NewMovie> => {
    const url = `https://api.themoviedb.org/3/movie/${movie.id}?language=es-ES&append_to_response=credits`;
    const data = await ky.get(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).json<TMDbMovieDetails>();
  
    const director = data.credits.crew.find((c: any) => c.job === 'Director')?.name || 'Desconocido';
    const actors = data.credits.cast.slice(0, 3).map((c: any) => c.name);
    const year = data.release_date.split('-')[0];
    const slug = createSlug(data.title);
  
    return {
      ...data,
      id: data.id,
      title: data.title,
      year,
      director,
      actors: actors.join(', '),
      genres: data.genres.map((g: any) => g.name),
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
      tmdbUrl: `https://www.themoviedb.org/movie/${data.id}-${slug}`,
      overview: data.overview,
    };
  };

export const queryMovies = query(
    z.string(),
    async (arg) => {
      const query = arg.trim();
      if (!query) throw new Error('Query vacía');
  
      const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-ES&region=ES&page=1&include_adult=false`;
      
      const searchResponse = await ky.get(searchUrl, {
        headers: { Authorization: `Bearer ${env.TMDB_API_KEY}` },
      }).json<TMDB_SearchResponse>();
  
      if (searchResponse.total_results === 0) {
        return [];
      }
  
      // === TOMAR MÁXIMO 10 PELÍCULAS ===
      const moviesToEnrich = searchResponse.results.slice(0, 10);
  
      // === ENRIQUECER EN PARALELO (máximo 10 llamadas) ===
      const enrichedMovies = await Promise.all(
        moviesToEnrich.map(movie => enrichMovie(movie, env.TMDB_API_KEY))
      );
  
      return enrichedMovies;
    }
  );

  export const insertMovie = command(
	movieInsertSchema, async (arg: NewMovie) => {
        try{
            const {id, ...movie} = arg;
		    await db.insert(movies).values(movie);
        }catch(err){
            console.log(err);
            throw new Error('Error guardando película');
        }
	}
);

export const updateMovie = command(
	movieUpdateSchema, async (arg) => {
        if (!arg.id) {
            throw new Error('Movie ID is required for update');
        }
	    await db.update(movies).set(arg).where(eq(movies.id, arg.id));
	}
);

export const deleteMovie = command(
	z.number(), async (arg) => {
        if (!arg) {
            throw new Error('Movie ID is required for update');
        }
		await db.delete(movies).where(eq(movies.id, arg));
	}
);
