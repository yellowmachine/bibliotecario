<script lang="ts">
    import type { NewMovie } from '$lib/db/movies';
	import { deleteMovie, insertMovie, updateMovie } from '$lib/remote/movie.remote';
	import ColorSquare from './ColorSquare.svelte';
    import { invalidateAll } from '$app/navigation';
	
	interface Props {
        mode: "insert" | "update";
        movie: NewMovie;
	}

	let {
		movie,
        mode,  
	}: Props = $props();

    let showFull = $state(false);
    let editing = $state(false);
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

    async function onUpdateMovie(){
        try{
            if(!location) return;
            await updateMovie({...movie, location});
            movie.location = location;
            editing = false;
        }catch(err){
            console.error("Error guardando libro", err)
        }
    }

    async function onDeleteMovie(){
        try{
            await deleteMovie(movie.id!);
            invalidateAll();
        }catch(err){
            console.error("Error guardando libro", err)
        }
    }
    
</script>

{#snippet modeSnippet()}
{#if mode === "insert"}
{@render insertSnippet()}
{:else}
{@render updateSnippet()}
{/if}
{/snippet}

{#snippet insertSnippet()}
<div class="inline-flex items-center gap-2 text-xs text-gray-400">
<input type="text" class="w-50" bind:value={location} placeholder="Localizador" /><ColorSquare color={location} />
</div>
{/snippet}

{#snippet updateSnippet()}
{#if editing}
<div class="text-xs text-gray-400">
    <input class="w-32 sm:w-56 md:w-64 text-sm" type="text" bind:value={location} placeholder="Localizador" />
    <button class="btn btn-primary" onclick={onUpdateMovie}>Guardar</button>
    <button class="btn btn-error" onclick={() => editing = false}>Cancelar</button>
</div>
{:else}
<div class="inline-flex items-center gap-2">
<button class="btn text-gray-400" onclick={() => editing = true}>Localizador: {movie.location}</button><ColorSquare color={movie.location} />
</div>
{/if}
{/snippet}

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

<div class="card bg-base-100 w-96 shadow-sm pb-4 relative">
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
    {@render modeSnippet()}
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
    {#if mode === "update" && movie.id !== undefined}
    <button
        onclick={onDeleteMovie}
        class="absolute bottom-2 right-2 btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
        title="Eliminar película"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </button>
    {/if}
</div>