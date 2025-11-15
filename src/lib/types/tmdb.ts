import ky from "ky";


interface TMDbGenre {
  id: number;
  name: string;
}

interface TMDbProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface TMDbProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface TMDbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface TMDbCreditPerson {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
}

interface TMDbCast extends TMDbCreditPerson {
  cast_id: number;
  character: string;
  order: number;
}

interface TMDbCrew extends TMDbCreditPerson {
  department: string;
  job: string;
}

interface TMDbCredits {
  cast: TMDbCast[];
  crew: TMDbCrew[];
}

export interface TMDbMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: TMDbGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDbProductionCompany[];
  production_countries: TMDbProductionCountry[];
  release_date: string; // "1975-06-20"
  revenue: number;
  runtime: number | null;
  spoken_languages: TMDbSpokenLanguage[];
  status: string; // "Released"
  tagline: string | null;
  title: string; // ← Título en español si usas language=es-ES
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: TMDbCredits;
}

export interface TMDB_Movie {
  adult: boolean,
  backdrop_path: string,
  genre_ids: number[],
  id: number,
  original_language: string,
  original_title: string,
  overview: string
  poster: string,
  release_date: string,
  title: string,
}

export type TMDB_SearchResponse = {
  page: number;
  results: TMDB_Movie[];
  total_pages: number,
  total_results: number
};

export const genres = [
    {
      "id": 28,
      "name": "Acción"
    },
    {
      "id": 12,
      "name": "Aventura"
    },
    {
      "id": 16,
      "name": "Animación"
    },
    {
      "id": 35,
      "name": "Comedia"
    },
    {
      "id": 80,
      "name": "Crimen"
    },
    {
      "id": 99,
      "name": "Documental"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familia"
    },
    {
      "id": 14,
      "name": "Fantasía"
    },
    {
      "id": 36,
      "name": "Historia"
    },
    {
      "id": 27,
      "name": "Terror"
    },
    {
      "id": 10402,
      "name": "Música"
    },
    {
      "id": 9648,
      "name": "Misterio"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ciencia ficción"
    },
    {
      "id": 10770,
      "name": "Película de TV"
    },
    {
      "id": 53,
      "name": "Suspense"
    },
    {
      "id": 10752,
      "name": "Bélica"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

export const getImagePath = (path: string) => {
  return `https://image.tmdb.org/t/p/w500${path}`;
};

export const mapGenresIdToName = (gs: number[]) => {
  return gs.map(g => genres.find(x => x.id === g)?.name).filter(x => x !== undefined);
};