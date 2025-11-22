<script lang="ts">
	import BookForm from "$lib/components/BookForm.svelte";
	import { bookInsertSchema, type NewBook } from "$lib/db/books";
	import { insertBook } from "$lib/remote/book.remote";

    const book: NewBook = $state({
        title: "",
        authors: "",
        publisher: "",
        isbn: "",
        publishDate: "",
        bookUrl: "",
        numberOfPages: 0,
        description: "",
        subjects: [],
        languages: [],
        coverImageUrl: "",
        openLibraryData: {},
        location: ""
    })

</script>

<BookForm mode="insert" schema={bookInsertSchema} {book} save={insertBook} />