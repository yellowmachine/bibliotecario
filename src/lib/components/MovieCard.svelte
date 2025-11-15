<script lang="ts">
    import type { NewMovie } from '$lib/db/movies';
	import { insertMovie } from '$lib/remote/movie.remote';
	
	interface Props {
        mode: "insert" | "update";
        movie: NewMovie;
	}

	let {
		movie=$bindable(),
        mode,
	}: Props = $props();

    let showFull = $state(false);
    //let editing = $state(false);
    let location = $state('');
    let success = $state(false);
    let error: string | null = $state(null);

    const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const getMovieUrl = (movie: NewMovie) => {
      return `https://www.themoviedb.org/movie/${movie.id}-${slug(movie.title)}`;
    };

    const onInsertMovie = async () => {
        try{
            await insertMovie({...movie, location});
            success = true;
            error = null;
        }catch(err){
            console.error("Error guardando libro", err)
            error = JSON.stringify(err);
            success = false;
        }
    }
    
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

{#if success}
<div class="alert alert-success shadow-lg">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>Movie guardado correctamente</span>
  </div>
</div>
{/if}
{#if error}
<div class="alert alert-error shadow-lg">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>{error}</span>
  </div>
</div>
{/if}

<div class="card bg-base-100 w-96 shadow-sm pb-4">
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
    <div class="card-body">
        <h2 class="card-title">{movie.title}</h2>
        <p>Director: {movie.director}</p>
        <p>Actores: {movie.actors}</p>
        {@render description(movie.overview)}   
    </div>
    {#if mode === "insert"}
    <button class="btn btn-primary" onclick={onInsertMovie}>Guardar</button>
    {/if}
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