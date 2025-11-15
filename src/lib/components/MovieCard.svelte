<script lang="ts">
    import type { Movie } from '$lib/types/tmdb';
	
	interface Props {
        movie: Movie;
	}

	let {
		movie=$bindable(),
	}: Props = $props();

    let showFull = $state(false);
    //let editing = $state(false);
    //let location = $state('');

    const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const getMovieUrl = (movie: Movie) => {
      return `https://www.themoviedb.org/movie/${movie.id}-${slug(movie.title)}`;
    };
    
</script>

{#snippet description(arg?: string | null)}
{#if arg}
<p>
{#if arg.length > 100 && !showFull}
    {arg.slice(0, 100)}...
    <button class="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-focus cursor-pointer select-none transition-colors" onclick={() => showFull = true}>leer más</button>
{:else}
    {arg}
    {#if arg.length > 100}
        <button class="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-focus cursor-pointer select-none transition-colors" onclick={() => showFull = false}>ocultar</button> 
    {/if}
{/if}
</p>
{/if}
{/snippet}


<div class="card bg-base-100 w-96 shadow-sm">
    {#if movie.poster}
    <figure>
      <img
        src="{movie.poster}"
        alt="Poster" 
        loading="lazy"
        class="w-full h-auto object-cover"
        />
    </figure>
    {/if}
    <p>Director: {movie.director}</p>
    <p>Actores: {movie.actors.join(', ')}</p>
    <div class="card-body">
      <h2 class="card-title">{movie.title}</h2>
      {@render description(movie.overview)}   
    </div>
    <a 
        href={getMovieUrl(movie)} 
        target="_blank" 
        rel="noopener noreferrer"
        class="external-link"
    >
        <button class="btn">
                The Movie Database ↗
        </button>
    </a>
</div>