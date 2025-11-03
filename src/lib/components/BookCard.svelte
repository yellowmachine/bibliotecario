<script lang="ts">
    import type { OpenLibraryBook } from '$lib/types/openlibrary.js';
	
	interface Props {
		book: OpenLibraryBook;
	}

	let {
		book,
	}: Props = $props();

    function authors(arg: OpenLibraryBook["authors"]){
        return arg?.map(x => x.name).join(", ")
    }
</script>

<div class="card bg-base-100 w-96 shadow-sm">
    {#if book.covers}
    <figure>
      <img
        src="{book.covers[0]}"
        alt="Cover" />
    </figure>
    {/if}
    <div class="card-body">
      <h2 class="card-title">{book.title}</h2>
      <p>{authors(book.authors)}</p>
      <p>{book.description}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
</div>