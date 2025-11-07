<script lang="ts">
	import type { Book } from "$lib/db/books";
	import BookCard from "./BookCard.svelte";

	export let books: Book[];
	let title = "";
	let author = "";

	// Creamos regex solo cuando los campos tienen valor
	$: titleRegex = title ? new RegExp(title, 'i') : null;
	$: authorRegex = author ? new RegExp(author, 'i') : null;

	// Filtramos aplicando ambas condiciones si existen
	$: filteredBooks = books.filter(book => {
		const matchesTitle = !titleRegex || titleRegex.test(book.title);
		const matchesAuthor = !authorRegex || (book.authors && authorRegex.test(book.authors));
		return matchesTitle && matchesAuthor;
	});
</script>

<!-- Opcional: inputs para probar el filtro -->
<div class="p-4 space-y-4">
	<input
		type="text"
		bind:value={title}
		placeholder="Filtrar por título..."
		class="input input-bordered w-full"
	/>
	<input
		type="text"
		bind:value={author}
		placeholder="Filtrar por autor..."
		class="input input-bordered w-full"
	/>
</div>

<div class="grid md:grid-cols-4 gap-4">
	{#each filteredBooks as book (book.id)}
		<BookCard {book} />
	{/each}
</div>