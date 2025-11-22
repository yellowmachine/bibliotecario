<script lang="ts">
	import BookForm from "$lib/components/BookForm.svelte";
	import { bookUpdateSchema } from "$lib/db/books";
	import { updateBook } from "$lib/remote/book.remote";

    const { data } = $props();

</script>

<BookForm mode="update" schema={bookUpdateSchema} book={data.book} save={updateBook} />