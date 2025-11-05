<script lang="ts">
    import type { NewBook } from '$lib/db/books';
	
	interface Props {
		book: NewBook
	}

	let {
		book,
	}: Props = $props();
    
</script>

<div class="card bg-base-100 w-96 shadow-sm">
    {#if book.coverImageUrl}
    <figure>
      <img
        src="{book.coverImageUrl}"
        alt="Cover" />
    </figure>
    {/if}
    <div class="card-body">
      <h2 class="card-title">{book.title}</h2>
      <p class="italic">{book.authors}</p>
      <p>{book.description}</p>
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