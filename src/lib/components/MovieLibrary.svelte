<script lang="ts">
	import type { Movie } from "$lib/db/movies";
	import MovieCard from "./MovieCard.svelte";

	export let movies: Movie[];
	let title = "";
	let actors = "";
	let director = "";

	$: titleRegex = title ? new RegExp(title, 'i') : null;
	$: actorsRegex = actors ? new RegExp(actors, 'i') : null;
	$: directorRegex = director ? new RegExp(director, 'i') : null;

	$: filteredMovies = movies.filter(movie => {
		const matchesTitle = !titleRegex || titleRegex.test(movie.title);
		const matchesActors = !actorsRegex || (movie.actors && actorsRegex.test(movie.actors));
		const matchesDirector = !directorRegex || (movie.director && directorRegex.test(movie.director));
		
		return matchesTitle && matchesActors && matchesDirector;
	});

    $: total = filteredMovies.length;
</script>

<div class="p-4 space-y-4">
	<input
		type="text"
		bind:value={title}
		placeholder="Filtrar por título..."
		class="input input-bordered w-full md:w-1/3"
	/>
	<input
		type="text"
		bind:value={actors}
		placeholder="Filtrar por actores..."
		class="input input-bordered w-full md:w-1/3"
	/>
	<input
		type="text"
		bind:value={director}
		placeholder="Filtrar por director..."
		class="input input-bordered w-full md:w-1/3"
	/>
</div>

<div class="mb-4">Total: {total}</div>
<div class="grid md:grid-cols-4 gap-4">
	{#each filteredMovies as movie (movie.id)}
		<MovieCard mode={"update"} {movie} />
	{/each}
</div>