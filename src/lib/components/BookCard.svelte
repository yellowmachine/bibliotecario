<script lang="ts">
    import type { NewBook } from '$lib/db/books';
    import { updateBook } from '$lib/remote/book.remote';
	
	interface Props {
        update: boolean;
		book: NewBook;
	}

	let {
		book,
        update=false
	}: Props = $props();

    let showFull = $state(false);
    let editing = $state(false);
    let location = $state('');

    async function onUpdateBook(){
        if(!location) return;
        await updateBook({...book, location});
        editing = false;
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

{#snippet updateSnippet()}
{#if editing}
<span class="text-xs text-gray-400">Location: <input type="text" bind:value={location} /><button class="btn btn-primary" onclick={onUpdateBook}>Guardar</button></span>
{:else}
<span class="text-xs text-gray-400">Location: {book.location}</span>
{/if}
{/snippet}

<div class="card bg-base-100 w-96 shadow-sm">
    {#if book.coverImageUrl}
    <figure>
      <img
        src="{book.coverImageUrl}"
        alt="Cover" 
        loading="lazy"
        class="w-full h-auto object-cover"
        />
    </figure>
    {/if}
    <div class="card-body">
      <h2 class="card-title">{book.title}</h2>
      <p class="italic">{book.authors}</p>
      {@render description(book.description)}
      <div class="book-meta">
        {#if book.publisher}
            <span class="meta-item">
                <strong>Editorial:</strong> 
                {book.publisher}
            </span>
        {/if}
        
        {#if book.publishDate}
            <span class="meta-item">
                <strong>Año:</strong> {book.publishDate}
            </span>
        {/if}
        
        {#if book.numberOfPages}
            <span class="meta-item">
                <strong>Páginas:</strong> {book.numberOfPages}
            </span>
        {/if}
        
        {#if book.isbn}
            <span class="meta-item isbn">
                <strong>ISBN:</strong> {book.isbn}
            </span>
        {/if}
        {@render updateSnippet()}
      </div>
      <a 
        href={book.bookUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        class="external-link"
    >
        <button class="btn">
            OpenLibrary ↗
        </button>
      </a>
    </div>
</div>