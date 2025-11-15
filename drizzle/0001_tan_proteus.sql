CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"adult" boolean NOT NULL,
	"backdrop_path" text,
	"genres" text[],
	"original_language" text NOT NULL,
	"original_title" text NOT NULL,
	"overview" text,
	"poster" text,
	"release_date" text NOT NULL,
	"title" text NOT NULL,
	"year" text NOT NULL,
	"director" text NOT NULL,
	"actors" text,
	"tmdb_url" text NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
