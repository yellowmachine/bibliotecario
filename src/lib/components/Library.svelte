<script lang="ts">
	import type { Book } from "$lib/db/books";
	import BookCard from "./BookCard.svelte";

    export let books: Book[];
</script>

<div class="grid grid-cols-4 gap-4">
    {#each books as book(book.id)}
    <BookCard {book} />
    {/each}
</div>