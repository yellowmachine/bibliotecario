<script lang="ts">
    import type { NewBook } from '$lib/db/books';
	
	interface Props {
		book: NewBook
	}

	let {
		book,
	}: Props = $props();

    let showFull = $state(false);
    
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