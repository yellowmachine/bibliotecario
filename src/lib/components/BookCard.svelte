<script lang="ts">
    import { type OpenLibraryBook, OpenLibraryHelpers } from '$lib/types/openlibrary';
	
	interface Props {
		book: OpenLibraryBook;
	}

	let {
		book,
	}: Props = $props();

    const authors = $derived(OpenLibraryHelpers.getAuthorsString(book));
    const publishYear = $derived(OpenLibraryHelpers.getPublishYear(book));
    const isbn = $derived(OpenLibraryHelpers.getFirstISBN(book));
	const bookUrl = $derived(OpenLibraryHelpers.getBookUrl(book.key));
    
</script>

<div class="card bg-base-100 w-96 shadow-sm">
    {#if book.cover}
    <figure>
      <img
        src="{book.cover.large}"
        alt="Cover" />
    </figure>
    {/if}
    <div class="card-body">
      <h2 class="card-title">{book.title}</h2>
      <p class="italic">{authors}</p>
      <div class="book-meta">
        {#if book.publishers && book.publishers[0]}
            <span class="meta-item">
                <strong>Editorial:</strong> 
                {book.publishers[0]}
            </span>
        {/if}
        
        {#if publishYear}
            <span class="meta-item">
                <strong>Año:</strong> {publishYear}
            </span>
        {/if}
        
        {#if book.number_of_pages}
            <span class="meta-item">
                <strong>Páginas:</strong> {book.number_of_pages}
            </span>
        {/if}
        
        {#if isbn}
            <span class="meta-item isbn">
                <strong>ISBN:</strong> {isbn}
            </span>
        {/if}
      </div>
      <a 
        href={bookUrl} 
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